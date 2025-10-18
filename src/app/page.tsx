'use client'

import { useState, useEffect } from 'react'
import { getCurrentUser } from '@/lib/supabaseClient'
import { getHabits, Habit } from '@/lib/habits'
import { User } from '@supabase/supabase-js'
import Header from '@/components/Header'
import AdvancedHabitCard from '@/components/AdvancedHabitCard'
import HabitForm from '@/components/HabitForm'
import AdvancedHabitForm from '@/components/AdvancedHabitForm'
import AuthForm from '@/components/AuthForm'
import Footer from '@/components/Footer'
import Image from 'next/image'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [habits, setHabits] = useState<Habit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAdvancedForm, setShowAdvancedForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Tümü')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        
        if (currentUser) {
          await loadHabits(currentUser.id)
        }
      } catch (error) {
        console.error('Kullanıcı kontrolü sırasında hata:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const loadHabits = async (userId: string) => {
    try {
      const userHabits = await getHabits(userId)
      setHabits(userHabits)
    } catch (error) {
      console.error('Alışkanlıklar yüklenirken hata:', error)
    }
  }

  const categories = ['Tümü', ...Array.from(new Set(habits.map(h => h.category)))]

  const filteredHabits = selectedCategory === 'Tümü' 
    ? habits 
    : habits.filter(h => h.category === selectedCategory)

  const handleAuthSuccess = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      if (currentUser) {
        await loadHabits(currentUser.id)
      }
    } catch (error) {
      console.error('Auth sonrası kullanıcı yükleme hatası:', error)
    }
  }

  const handleSignOut = () => {
    setUser(null)
    setHabits([])
  }

  const handleHabitUpdate = async () => {
    if (user) {
      await loadHabits(user.id)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSignOut={handleSignOut} />
      
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-20">
          <div className="mb-8">
            <div className="mb-8">
              <div className={`transition-all duration-700 ease-out ${
                isScrolled ? 'scale-90 rotate-2' : 'scale-100 rotate-0'
              }`}>
        <Image
                  src="/logo.png"
                  alt="Ritüeller Logo"
                  width={isScrolled ? 80 : 120}
                  height={isScrolled ? 80 : 120}
                  className={`object-contain mx-auto mb-6 transition-all duration-700 ease-out drop-shadow-2xl ${
                    isScrolled ? 'opacity-60 blur-sm' : 'opacity-100 blur-0'
                  }`}
                />
              </div>
            </div>
            <h1 className={`editorial-heading text-gray-900 mb-6 leading-none transition-all duration-700 ease-out ${
              isScrolled ? 'text-4xl md:text-5xl opacity-80 tracking-wider' : 'text-6xl md:text-7xl opacity-100 tracking-normal'
            }`}>
              <span className={`inline-block transition-all duration-700 ease-out ${
                isScrolled ? 'transform translate-y-2' : 'transform translate-y-0'
              }`}>
                Ritüeller
              </span>
            </h1>
            <div className={`bg-gray-900 mx-auto mb-8 transition-all duration-700 ease-out ${
              isScrolled ? 'w-24 h-px opacity-60 blur-sm' : 'w-32 h-px opacity-100 blur-0'
            }`}></div>
            <p className={`text-gray-600 font-light max-w-xl mx-auto leading-relaxed transition-all duration-700 ease-out ${
              isScrolled ? 'text-base opacity-70 tracking-wider' : 'text-lg opacity-100 tracking-normal'
            }`}>
              <span className={`inline-block transition-all duration-700 ease-out ${
                isScrolled ? 'transform translate-y-1' : 'transform translate-y-0'
              }`}>
                Günlük alışkanlıklarınızı takip edin ve hayatınızı dönüştürün
              </span>
            </p>
          </div>
          
          <div className="flex justify-center gap-12 mb-8">
            <div className="text-center">
              <div className="text-2xl font-light text-gray-900 mb-1">{habits.length}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Toplam</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-light text-gray-900 mb-1">
                {habits.filter(h => h.is_done).length}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Tamamlanan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-light text-gray-900 mb-1">
                {habits.filter(h => !h.is_done).length}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Beklemede</div>
            </div>
          </div>
        </div>

        {habits.length > 0 && (
          <div className="flex justify-center gap-16 mb-20 text-center">
            <div>
              <div className="text-4xl font-light text-gray-900 mb-1">{habits.length}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Toplam</div>
            </div>
            <div>
              <div className="text-4xl font-light text-gray-900 mb-1">
                {habits.filter(h => h.is_done).length}
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Tamamlanan</div>
            </div>
            <div>
              <div className="text-4xl font-light text-gray-900 mb-1">
                {habits.filter(h => !h.is_done).length}
              </div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Beklemede</div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setShowAdvancedForm(!showAdvancedForm)}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              {showAdvancedForm ? 'Basit Form' : 'Gelişmiş Form'}
            </button>
          </div>
        </div>

        {showAdvancedForm ? (
          <AdvancedHabitForm 
            userId={user.id} 
            onSuccess={handleHabitUpdate}
            onCancel={() => setShowAdvancedForm(false)}
          />
        ) : (
          <HabitForm userId={user.id} onHabitAdded={handleHabitUpdate} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-12">
          {filteredHabits.map((habit) => (
            <AdvancedHabitCard
              key={habit.id}
              habit={habit}
              onUpdate={handleHabitUpdate}
            />
          ))}
        </div>

        {habits.length > 0 && (
          <div className="mt-24">
            <div className="text-center mb-16">
              <h2 className="editorial-heading text-4xl text-gray-900 mb-4">
                İlerleme Raporunuz
              </h2>
              <div className="w-24 h-px bg-gray-300 mx-auto mb-8"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-8 border-l-4 border-green-300">
                <h3 className="text-xl font-serif text-gray-900 mb-4">Bu Hafta</h3>
                <div className="text-3xl font-light text-gray-900 mb-2">
                  {habits.filter(h => h.is_done).length}
                </div>
                <div className="text-sm text-gray-500">Tamamlanan Alışkanlık</div>
              </div>

              <div className="bg-white p-8 border-l-4 border-blue-300">
                <h3 className="text-xl font-serif text-gray-900 mb-4">Seri Rekoru</h3>
                <div className="text-3xl font-light text-gray-900 mb-2">
                  {Math.max(...habits.map(h => h.best_streak), 0)}
                </div>
                <div className="text-sm text-gray-500">Gün</div>
              </div>

              <div className="bg-white p-8 border-l-4 border-purple-300">
                <h3 className="text-xl font-serif text-gray-900 mb-4">Toplam Puan</h3>
                <div className="text-3xl font-light text-gray-900 mb-2">
                  {habits.reduce((sum, h) => sum + h.points, 0)}
                </div>
                <div className="text-sm text-gray-500">Kazanılan Puan</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-24">
          <div className="text-center mb-16">
            <h2 className="editorial-heading text-4xl text-gray-900 mb-4">
              Alışkanlık Kategorileri
            </h2>
            <div className="w-24 h-px bg-gray-300 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Alışkanlıklarınızı kategorilere ayırarak daha organize bir yaşam sürün
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {['Sağlık', 'Spor', 'Öğrenme', 'İş', 'Kişisel', 'Sosyal', 'Yaratıcılık', 'Finans'].map((category) => (
              <div key={category} className="bg-white p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-2xl mb-3">
                  {category === 'Sağlık' && '🏥'}
                  {category === 'Spor' && '💪'}
                  {category === 'Öğrenme' && '📚'}
                  {category === 'İş' && '💼'}
                  {category === 'Kişisel' && '👤'}
                  {category === 'Sosyal' && '👥'}
                  {category === 'Yaratıcılık' && '🎨'}
                  {category === 'Finans' && '💰'}
                </div>
                <h3 className="font-serif text-lg text-gray-900 mb-2">{category}</h3>
                <div className="text-sm text-gray-500">
                  {habits.filter(h => h.category === category).length} alışkanlık
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24">
          <div className="text-center mb-16">
            <h2 className="editorial-heading text-4xl text-gray-900 mb-4">
              Başarı Hikayeleri
            </h2>
            <div className="w-24 h-px bg-gray-300 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Küçük adımlar büyük değişimler yaratır
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">🏆</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-gray-900">İlk Hafta</h3>
                  <p className="text-sm text-gray-500">7 günlük seri</p>
                </div>
              </div>
              <p className="text-gray-600">
                &ldquo;İlk haftamı tamamladığımda kendimi çok güçlü hissettim. Küçük adımlar gerçekten işe yarıyor!&rdquo;
              </p>
            </div>

            <div className="bg-white p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl">⭐</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-gray-900">30 Gün</h3>
                  <p className="text-sm text-gray-500">1 aylık seri</p>
                </div>
              </div>
              <p className="text-gray-600">
                &ldquo;Bir ay sonra alışkanlığım artık hayatımın doğal bir parçası oldu. İnanılmaz bir dönüşüm!&rdquo;
              </p>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <div className="text-center mb-16">
            <h2 className="editorial-heading text-4xl text-gray-900 mb-4">
              İpuçları ve Öneriler
            </h2>
            <div className="w-24 h-px bg-gray-300 mx-auto mb-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6">
              <h3 className="font-serif text-lg text-gray-900 mb-3">Küçük Başlayın</h3>
              <p className="text-gray-600 text-sm">
                Günde sadece 2 dakika ayırarak başlayın. Küçük adımlar büyük değişimler yaratır.
              </p>
            </div>

            <div className="bg-white p-6">
              <h3 className="font-serif text-lg text-gray-900 mb-3">Tutarlı Olun</h3>
              <p className="text-gray-600 text-sm">
                Mükemmel olmak yerine tutarlı olmaya odaklanın. Her gün yapmak önemli.
              </p>
            </div>

            <div className="bg-white p-6">
              <h3 className="font-serif text-lg text-gray-900 mb-3">Kendinizi Ödüllendirin</h3>
              <p className="text-gray-600 text-sm">
                Başarılarınızı kutlayın. Her tamamladığınız alışkanlık bir zaferdir.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <div className="text-center mb-16">
            <h2 className="editorial-heading text-4xl text-gray-900 mb-4">
              Motivasyon Zonları
            </h2>
            <div className="w-24 h-px bg-gray-300 mx-auto mb-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-lg">
              <h3 className="font-serif text-xl text-gray-900 mb-4">Başlangıç Seviyesi</h3>
              <p className="text-gray-600 mb-4">
                Yeni alışkanlıklar oluşturmaya başlayın. Her gün küçük adımlar atın.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600">0-7 gün arası</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg">
              <h3 className="font-serif text-xl text-gray-900 mb-4">Gelişim Aşaması</h3>
              <p className="text-gray-600 mb-4">
                Alışkanlığınız oturmaya başlıyor. Tutarlılık anahtar kelime.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-600">8-21 gün arası</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-lg">
              <h3 className="font-serif text-xl text-gray-900 mb-4">Uzman Seviye</h3>
              <p className="text-gray-600 mb-4">
                Alışkanlığınız artık doğal bir rutin. Sürekli gelişim zamanı.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span className="text-sm text-gray-600">22-66 gün arası</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-lg">
              <h3 className="font-serif text-xl text-gray-900 mb-4">Master Seviye</h3>
              <p className="text-gray-600 mb-4">
                Alışkanlığınız tamamen oturdu. Yeni hedefler belirleme zamanı.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-sm text-gray-600">66+ gün</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <div className="text-center mb-16">
            <h2 className="editorial-heading text-4xl text-gray-900 mb-4">
              Haftalık Hedefler
            </h2>
            <div className="w-24 h-px bg-gray-300 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bu hafta için kendinize hedefler belirleyin ve ilerlemenizi takip edin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { day: 'Pazartesi', emoji: '💪', color: 'blue' },
              { day: 'Salı', emoji: '🚀', color: 'green' },
              { day: 'Çarşamba', emoji: '⚡', color: 'purple' },
              { day: 'Perşembe', emoji: '🎯', color: 'orange' },
              { day: 'Cuma', emoji: '🏆', color: 'yellow' },
              { day: 'Cumartesi', emoji: '🌟', color: 'pink' },
              { day: 'Pazar', emoji: '✨', color: 'indigo' }
            ].map((day) => (
              <div key={day.day} className={`bg-${day.color}-50 p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105`}>
                <div className="text-3xl mb-3">{day.emoji}</div>
                <h3 className="font-serif text-lg text-gray-900 mb-2">{day.day}</h3>
                <div className="text-sm text-gray-500">
                  {Math.floor(Math.random() * 5) + 1} alışkanlık
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24">
          <div className="text-center mb-16">
            <h2 className="editorial-heading text-4xl text-gray-900 mb-4">
              Topluluk İstatistikleri
            </h2>
            <div className="w-24 h-px bg-gray-300 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Diğer kullanıcılarla birlikte büyüyün ve ilham alın
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white p-6 text-center">
              <div className="text-3xl font-light text-gray-900 mb-2">1,247</div>
              <div className="text-sm text-gray-500">Aktif Kullanıcı</div>
            </div>
            <div className="bg-white p-6 text-center">
              <div className="text-3xl font-light text-gray-900 mb-2">15,892</div>
              <div className="text-sm text-gray-500">Tamamlanan Alışkanlık</div>
            </div>
            <div className="bg-white p-6 text-center">
              <div className="text-3xl font-light text-gray-900 mb-2">89%</div>
              <div className="text-sm text-gray-500">Başarı Oranı</div>
            </div>
            <div className="bg-white p-6 text-center">
              <div className="text-3xl font-light text-gray-900 mb-2">42</div>
              <div className="text-sm text-gray-500">Ortalama Seri</div>
            </div>
          </div>
        </div>

        {habits.length === 0 && (
          <div className="text-center py-24">
            <div className="mb-8">
              <div className="w-16 h-px bg-gray-300 mx-auto mb-6"></div>
              <h3 className="editorial-subheading text-2xl text-gray-900 mb-4">
                Başlayın
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto font-light">
                İlk alışkanlığınızı ekleyerek yolculuğunuza başlayın
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
