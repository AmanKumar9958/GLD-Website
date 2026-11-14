import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { DatabaseUser } from '../types/test'

interface AuthContextType {
  user: User | null
  profile: DatabaseUser | null
  session: Session | null
  loading: boolean
  isAuthModalOpen: boolean
  openAuthModal: (mode?: string) => void
  closeAuthModal: () => void
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (
    name: string,
    email: string,
    password: string,
    phone?: string,
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<DatabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const openAuthModal = (_mode?: string) => {
    setIsAuthModalOpen(true)
  }

  const closeAuthModal = () => {
    setIsAuthModalOpen(false)
  }

  // Fetch or sync profile in public.users table
  const fetchProfile = async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle()

      const googleName =
        currentUser.user_metadata?.full_name ||
        currentUser.user_metadata?.name ||
        currentUser.email?.split('@')[0] ||
        'Student'

      const googlePhoto =
        currentUser.user_metadata?.avatar_url ||
        currentUser.user_metadata?.picture ||
        null

      if (!error && data) {
        // If data exists, update photo or name if missing
        if (!data.photo_url && googlePhoto) {
          await supabase.from('users').update({ photo_url: googlePhoto }).eq('id', currentUser.id)
          data.photo_url = googlePhoto
        }
        setProfile(data)
      } else {
        // If profile doesn't exist, create it in public.users
        const newProfile: Partial<DatabaseUser> = {
          id: currentUser.id,
          email: currentUser.email || '',
          name: googleName,
          role: 'student',
          phone: currentUser.user_metadata?.phone || null,
          photo_url: googlePhoto,
        }
        const { data: created } = await supabase
          .from('users')
          .upsert([newProfile])
          .select()
          .maybeSingle()

        if (created) {
          setProfile(created)
        } else {
          setProfile(newProfile as DatabaseUser)
        }
      }
    } catch (err) {
      console.error('Error syncing user profile:', err)
    }
  }

  useEffect(() => {
    // 1. Initial session check
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setUser(s?.user || null)
      if (s?.user) {
        fetchProfile(s.user).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    }).catch(() => {
      setLoading(false)
    })

    // 2. Auth state changes listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user || null)
      if (newSession?.user) {
        await fetchProfile(newSession.user)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Google OAuth sign-in
  const signInWithGoogle = async () => {
    try {
      const redirectUrl = window.location.origin
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) throw error
      return { success: true, data }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err)
      return { success: false, error: err.message || 'Google sign-in could not be initiated.' }
    }
  }

  // Fallback email methods (kept for compatibility)
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      if (error) throw error

      if (data.user) {
        await fetchProfile(data.user)
        closeAuthModal()
      }
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' }
    }
  }

  const signup = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            name: name.trim(),
            phone: phone?.trim() || null,
          },
        },
      })

      if (error) throw error

      if (data.user) {
        const newProfile = {
          id: data.user.id,
          name: name.trim(),
          email: email.trim(),
          phone: phone?.trim() || null,
          role: 'student',
        }
        await supabase.from('users').upsert([newProfile])
        await fetchProfile(data.user)
        closeAuthModal()
      }
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message || 'Signup failed' }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
  }

  const value = useMemo(
    () => ({
      user,
      profile,
      session,
      loading,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal,
      signInWithGoogle,
      login,
      signup,
      logout,
    }),
    [user, profile, session, loading, isAuthModalOpen],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
