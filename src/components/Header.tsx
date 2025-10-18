'use client'

import { signOut, getCurrentUser } from '@/lib/supabaseClient'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { User } from '@supabase/supabase-js'

interface HeaderProps {
  onSignOut: () => void
}

export default function Header({ onSignOut }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Kullanıcı bilgisi alınırken hata:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      onSignOut()
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error)
    }
  }

  if (isLoading) {
    return (
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className={`bg-white/80 backdrop-blur-md border-b border-gray-100/50 sticky top-0 z-50 transition-all duration-700 ease-out ${
      isScrolled ? 'shadow-2xl bg-white/95 backdrop-blur-xl' : 'shadow-none bg-white/80'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className={`flex items-center transition-all duration-700 ease-out ${
          isScrolled ? 'h-14 justify-center' : 'h-20 justify-between'
        }`}>
          <div className={`flex items-center gap-4 transition-all duration-700 ease-out ${
            isScrolled ? 'absolute left-1/2 transform -translate-x-1/2' : 'relative'
          }`}>
            <div className={`transition-all duration-700 ease-out ${
              isScrolled ? 'scale-110 rotate-3' : 'scale-100 rotate-0'
            }`}>
              <Image
                src="/logo.png"
                alt="Ritüeller Logo"
                width={isScrolled ? 36 : 40}
                height={isScrolled ? 36 : 40}
                className="object-contain transition-all duration-700 ease-out drop-shadow-lg"
              />
            </div>
            <h1 className={`editorial-heading text-gray-900 font-light transition-all duration-700 ease-out ${
              isScrolled ? 'text-lg tracking-wider' : 'text-xl tracking-normal'
            }`}>
              Ritüeller
            </h1>
          </div>

          <div className={`flex items-center gap-6 transition-all duration-700 ease-out ${
            isScrolled ? 'absolute right-6' : 'relative'
          }`}>
            {user && (
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className={`text-gray-500 hover:text-gray-700 font-light transition-all duration-500 ease-out hover:scale-110 hover:rotate-1 ${
                    isScrolled ? 'text-xs tracking-wider' : 'text-sm tracking-normal'
                  }`}
                >
                  <span className="relative group">
                    Ana Sayfa
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-700 transition-all duration-500 ease-out group-hover:w-full"></span>
                  </span>
                </Link>
                <Link
                  href="/statistics"
                  className={`text-gray-500 hover:text-gray-700 font-light transition-all duration-500 ease-out hover:scale-110 hover:rotate-1 ${
                    isScrolled ? 'text-xs tracking-wider' : 'text-sm tracking-normal'
                  }`}
                >
                  <span className="relative group">
                    İstatistikler
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-700 transition-all duration-500 ease-out group-hover:w-full"></span>
                  </span>
                </Link>
                <Link
                  href="/profile"
                  className={`text-gray-500 hover:text-gray-700 font-light transition-all duration-500 ease-out hover:scale-110 hover:rotate-1 ${
                    isScrolled ? 'text-xs tracking-wider' : 'text-sm tracking-normal'
                  }`}
                >
                  <span className="relative group">
                    Profil
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-700 transition-all duration-500 ease-out group-hover:w-full"></span>
                  </span>
                </Link>
                <div className={`text-gray-500 font-light transition-all duration-500 ease-out ${
                  isScrolled ? 'text-xs tracking-wider' : 'text-sm tracking-normal'
                }`}>
                  {user.email}
                </div>
                <button
                  onClick={handleSignOut}
                  className={`
                    text-gray-400 hover:text-gray-600 hover:scale-110 hover:rotate-1
                    font-light transition-all duration-500 ease-out
                    ${isScrolled ? 'text-xs tracking-wider' : 'text-sm tracking-normal'}
                  `}
                >
                  <span className="relative group">
                    Çıkış
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-600 transition-all duration-500 ease-out group-hover:w-full"></span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
