'use client'

import { useState } from 'react'
import { signInWithEmail, signUpWithEmail } from '@/lib/supabaseClient'

interface AuthFormProps {
  onAuthSuccess: () => void
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (isLogin) {
        const { error } = await signInWithEmail(email, password)
        if (error) throw error
      } else {
        const { error } = await signUpWithEmail(email, password)
        if (error) throw error
      }
      onAuthSuccess()
    } catch (error: unknown) {
      setError((error as Error).message || 'Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-16 px-6">
      <div className="max-w-lg w-full">
        

        <div className="text-center mb-16">
          <h1 className="editorial-heading text-6xl text-gray-900 mb-6 leading-none">
            Ritüeller
          </h1>
          <div className="w-24 h-px bg-gray-900 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 font-light max-w-md mx-auto leading-relaxed">
            Günlük alışkanlıklarınızı takip edin ve hayatınızı dönüştürün
          </p>
        </div>

        <div className="bg-white">
          <div className="mb-12 text-center">
            <h2 className="editorial-subheading text-3xl text-gray-900 mb-4">
              {isLogin ? 'Giriş' : 'Kayıt'}
            </h2>
            <p className="text-gray-500 font-light">
              {isLogin 
                ? 'Hesabınıza giriş yapın' 
                : 'Yeni hesap oluşturun'
              }
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-400">
              <p className="text-red-600 text-sm font-light">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-0 py-4 border-0 border-b border-gray-300 bg-transparent
                         focus:ring-0 focus:border-gray-900 focus:outline-none
                         text-lg placeholder-gray-400 font-light
                         transition-all duration-200"
                placeholder="E-posta adresiniz"
                disabled={isLoading}
              />
            </div>

            <div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-0 py-4 border-0 border-b border-gray-300 bg-transparent
                         focus:ring-0 focus:border-gray-900 focus:outline-none
                         text-lg placeholder-gray-400 font-light
                         transition-all duration-200"
                placeholder="Şifreniz"
                disabled={isLoading}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 text-white py-4 px-8
                         font-light hover:bg-gray-800 disabled:opacity-50
                         transition-colors duration-200 flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isLogin ? 'Giriş yapılıyor...' : 'Hesap oluşturuluyor...'}
                  </>
                ) : (
                  isLogin ? 'Giriş Yap' : 'Hesap Oluştur'
                )}
              </button>
            </div>
          </form>

          <div className="mt-12 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-gray-500 hover:text-gray-700 font-light transition-colors duration-200"
            >
              {isLogin 
                ? 'Hesabınız yok mu? Kayıt olun' 
                : 'Zaten hesabınız var mı? Giriş yapın'
              }
            </button>
          </div>
        </div>


        <div className="text-center mt-16">
          <div className="w-16 h-px bg-gray-300 mx-auto mb-4"></div>
          <p className="text-sm text-gray-400 font-light">
            Küçük alışkanlıklar, büyük değişimler yaratır
          </p>
        </div>
      </div>
    </div>
  )
}
