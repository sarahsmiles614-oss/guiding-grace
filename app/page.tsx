'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    import('@/lib/supabase').then(({ supabase }) => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })
    })
  }, [])

  const signInWithGoogle = async () => {
    const { supabase } = await import('@/lib/supabase')
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/auth/callback' } })
  }

  const signOut = async () => {
    const { supabase } = await import('@/lib/supabase')
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black"><div className="text-white text-xl">Loading...</div></div>

  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{ fontFamily: "'Lora', Georgia, serif", backgroundImage: "url('https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920')" }}>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10">
        <header className="py-4 px-6">
          <div className="container mx-auto flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>Guiding Grace</h1>
            <div className="flex gap-3 flex-wrap">
              {user ? (
                <>
                  <Link href="/dashboard"><button className="text-white bg-black/30 border border-white/30 px-4 py-2 rounded hover:bg-white/20 font-semibold">Dashboard</button></Link>
                  <button onClick={signOut} className="text-white bg-black/30 border border-white/30 px-4 py-2 rounded hover:bg-white/20 font-semibold">Sign Out</button>
                </>
              ) : (
                <button onClick={signInWithGoogle} className="text-white bg-black/30 border border-white/30 px-4 py-2 rounded hover:bg-white/20 font-semibold">Sign In</button>
              )}
              <Link href="/subscribe"><button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded font-semibold">Subscribe</button></Link>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-6 py-16 text-center max-w-4xl">
          <h2 className="text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif", textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>Start Each Day<br />With His Grace</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">Daily devotions, scripture promises, and sacred spaces to nurture your faith journey.</p>
          <Link href="/subscribe"><button className="bg-white/90 hover:bg-white text-gray-900 text-xl px-10 py-4 rounded font-semibold mb-4">Start 3-Day Free Trial</button></Link>
          <p className="text-white/80 text-sm mt-2">$2.99/month • Cancel anytime</p>
        </main>
      </div>
    </div>
  )
}
