'use client'

import { useState, useEffect } from 'react'
import { getCurrentUser } from '@/lib/supabaseClient'
import { getHabits, Habit } from '@/lib/habits'
import { User } from '@supabase/supabase-js'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const [habits, setHabits] = useState<Habit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        
        if (currentUser) {
          const userHabits = await getHabits(currentUser.id)
          setHabits(userHabits)
        }
      } catch (error) {
        console.error('Kullanıcı verileri yüklenirken hata:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [])

  const handleSignOut = () => {
    setUser(null)
    setHabits([])
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="editorial-heading text-2xl text-gray-900 mb-4">Giriş Gerekli</h1>
          <p className="text-gray-600">Profil sayfasını görüntülemek için giriş yapın</p>
        </div>
      </div>
    )
  }

  const completedHabits = habits.filter(h => h.is_done).length
  const totalHabits = habits.length
  const completionRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0

  const getStreakDays = () => {
    const today = new Date()
    let streak = 0
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dayHabits = habits.filter(h => {
        const habitDate = new Date(h.created_at)
        return habitDate.toDateString() === checkDate.toDateString() && h.is_done
      })
      if (dayHabits.length > 0) {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  const getLongestStreak = () => {
    let maxStreak = 0
    let currentStreak = 0
    const sortedHabits = habits.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    
    for (const habit of sortedHabits) {
      if (habit.is_done) {
        currentStreak++
        maxStreak = Math.max(maxStreak, currentStreak)
      } else {
        currentStreak = 0
      }
    }
    return maxStreak
  }

  const getWeeklyStats = () => {
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - 7)
    
    const weekHabits = habits.filter(h => {
      const habitDate = new Date(h.created_at)
      return habitDate >= weekStart && h.is_done
    })
    
    return weekHabits.length
  }

  const getMonthlyStats = () => {
    const today = new Date()
    const monthStart = new Date(today)
    monthStart.setDate(today.getDate() - 30)
    
    const monthHabits = habits.filter(h => {
      const habitDate = new Date(h.created_at)
      return habitDate >= monthStart && h.is_done
    })
    
    return monthHabits.length
  }

  const tabs = [
    { id: 'overview', label: 'Genel Bakış' },
    { id: 'stats', label: 'İstatistikler' },
    { id: 'achievements', label: 'Başarılar' },
    { id: 'settings', label: 'Ayarlar' }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header onSignOut={handleSignOut} />
      
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-20">
          <h1 className="editorial-heading text-6xl text-gray-900 mb-6 leading-none">
            Profil
          </h1>
          <div className="w-24 h-px bg-gray-900 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 font-light max-w-xl mx-auto leading-relaxed">
            Kişisel alışkanlık yolculuğunuz ve istatistikleriniz
          </p>
        </div>

        <div className="bg-white border-l-4 border-gray-300 pl-8 pr-6 py-8 mb-16">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="editorial-subheading text-3xl text-gray-900 mb-2">
                {user.email}
              </h2>
              <p className="text-gray-500 font-light">
                {new Date(user.created_at).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} tarihinden beri
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-light text-gray-900 mb-1">{completionRate}%</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Başarı Oranı</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-6 font-light transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border-l-4 border-green-500 pl-8 pr-6 py-8">
              <div className="text-4xl font-light text-gray-900 mb-2">{getStreakDays()}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide mb-4">Günlük Streak</div>
              <p className="text-gray-600 font-light">Ardışık günlerde tamamlanan alışkanlık sayısı</p>
            </div>

            <div className="bg-white border-l-4 border-blue-500 pl-8 pr-6 py-8">
              <div className="text-4xl font-light text-gray-900 mb-2">{getLongestStreak()}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide mb-4">En Uzun Streak</div>
              <p className="text-gray-600 font-light">Tek seferde en uzun devam eden alışkanlık</p>
            </div>

            <div className="bg-white border-l-4 border-purple-500 pl-8 pr-6 py-8">
              <div className="text-4xl font-light text-gray-900 mb-2">{totalHabits}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide mb-4">Toplam Alışkanlık</div>
              <p className="text-gray-600 font-light">Oluşturulan toplam alışkanlık sayısı</p>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border-l-4 border-gray-300 pl-8 pr-6 py-8">
                <h3 className="editorial-subheading text-2xl text-gray-900 mb-6">Haftalık İstatistikler</h3>
                <div className="text-4xl font-light text-gray-900 mb-2">{getWeeklyStats()}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Bu Hafta Tamamlanan</div>
              </div>

              <div className="bg-white border-l-4 border-gray-300 pl-8 pr-6 py-8">
                <h3 className="editorial-subheading text-2xl text-gray-900 mb-6">Aylık İstatistikler</h3>
                <div className="text-4xl font-light text-gray-900 mb-2">{getMonthlyStats()}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Bu Ay Tamamlanan</div>
              </div>
            </div>

            <div className="bg-white border-l-4 border-gray-300 pl-8 pr-6 py-8">
              <h3 className="editorial-subheading text-2xl text-gray-900 mb-6">Alışkanlık Dağılımı</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Tamamlanan</span>
                    <span className="text-gray-900 font-medium">{completedHabits}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Beklemede</span>
                    <span className="text-gray-900 font-medium">{totalHabits - completedHabits}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-400 h-2 rounded-full" 
                      style={{ width: `${100 - completionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white border-l-4 border-yellow-500 pl-8 pr-6 py-8">
              <div className="text-2xl mb-4">🏆</div>
              <h3 className="editorial-subheading text-xl text-gray-900 mb-2">İlk Adım</h3>
              <p className="text-gray-600 font-light text-sm">İlk alışkanlığınızı oluşturun</p>
              <div className="mt-4">
                {totalHabits > 0 ? (
                  <span className="text-green-600 text-sm font-medium">✓ Tamamlandı</span>
                ) : (
                  <span className="text-gray-400 text-sm">Beklemede</span>
                )}
              </div>
            </div>

            <div className="bg-white border-l-4 border-green-500 pl-8 pr-6 py-8">
              <div className="text-2xl mb-4">🔥</div>
              <h3 className="editorial-subheading text-xl text-gray-900 mb-2">Streak Master</h3>
              <p className="text-gray-600 font-light text-sm">7 gün üst üste alışkanlık tamamlayın</p>
              <div className="mt-4">
                {getStreakDays() >= 7 ? (
                  <span className="text-green-600 text-sm font-medium">✓ Tamamlandı</span>
                ) : (
                  <span className="text-gray-400 text-sm">{getStreakDays()}/7</span>
                )}
              </div>
            </div>

            <div className="bg-white border-l-4 border-blue-500 pl-8 pr-6 py-8">
              <div className="text-2xl mb-4">💯</div>
              <h3 className="editorial-subheading text-xl text-gray-900 mb-2">Mükemmellik</h3>
              <p className="text-gray-600 font-light text-sm">%100 başarı oranına ulaşın</p>
              <div className="mt-4">
                {completionRate === 100 ? (
                  <span className="text-green-600 text-sm font-medium">✓ Tamamlandı</span>
                ) : (
                  <span className="text-gray-400 text-sm">{completionRate}%</span>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <div className="bg-white border-l-4 border-gray-300 pl-8 pr-6 py-8">
              <h3 className="editorial-subheading text-2xl text-gray-900 mb-8">Hesap Ayarları</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-0 py-3 border-0 border-b border-gray-300 bg-transparent
                             text-lg text-gray-500 font-light"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Üyelik Tarihi</label>
                  <input
                    type="text"
                    value={new Date(user.created_at).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    disabled
                    className="w-full px-0 py-3 border-0 border-b border-gray-300 bg-transparent
                             text-lg text-gray-500 font-light"
                  />
                </div>

                <div className="pt-6">
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 text-white py-3 px-8 font-light hover:bg-red-700
                             transition-colors duration-200"
                  >
                    Çıkış Yap
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
