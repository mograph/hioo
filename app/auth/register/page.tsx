'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, googleProvider, db } from '@/lib/firebase'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      if (name) await updateProfile(user, { displayName: name })
      await setDoc(doc(db, 'users', user.uid), { email: user.email, name: name || null, createdAt: new Date() })
      router.push('/')
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') setError('Account already exists')
      else if (err.code === 'auth/weak-password') setError('Password must be at least 6 characters')
      else setError(err.message)
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    setError('')
    try {
      const { user } = await signInWithPopup(auth, googleProvider)
      await setDoc(doc(db, 'users', user.uid), { email: user.email, name: user.displayName || null, createdAt: new Date() }, { merge: true })
      router.push('/')
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') setError(err.message)
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <div className="inline-block bg-[#B8F044] rounded-full px-4 py-1.5 mb-4">
            <span className="font-display text-sm font-bold">It&apos;s free!</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-[#0A0A0A] tracking-tight">Create account</h1>
          <p className="text-[#525252] mt-1">Start organizing your wardrobe</p>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-[#FFE0E6] text-[#BE123C] text-sm font-medium">{error}</div>
          )}

          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-[#E5E5E5] text-sm font-semibold font-display text-[#0A0A0A] hover:bg-[#F5F5F5] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E5E5E5]" />
            <span className="text-xs text-[#A3A3A3] font-display font-semibold">OR</span>
            <div className="flex-1 h-px bg-[#E5E5E5]" />
          </div>

          <form onSubmit={handleEmail} className="space-y-3">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Name" className="w-full px-4 py-3 rounded-xl border-2 border-[#E5E5E5] text-sm font-medium focus:outline-none focus:border-[#0A0A0A] transition-colors bg-white" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              placeholder="Email" className="w-full px-4 py-3 rounded-xl border-2 border-[#E5E5E5] text-sm font-medium focus:outline-none focus:border-[#0A0A0A] transition-colors bg-white" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
              placeholder="Password (6+ characters)" className="w-full px-4 py-3 rounded-xl border-2 border-[#E5E5E5] text-sm font-medium focus:outline-none focus:border-[#0A0A0A] transition-colors bg-white" />
            <button type="submit" disabled={loading} className="w-full btn-primary !py-3.5 disabled:opacity-50">
              {loading ? 'Creating...' : 'Get Started'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#525252] mt-8">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#FF6B35] hover:underline font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
