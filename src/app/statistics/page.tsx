'use client'

import { useState, useEffect } from 'react'
import { getCurrentUser } from '@/lib/supabaseClient'
import { getHabitStats, getUserAchievements } from '@/lib/habits'
import { User } from '@supabase/supabase-js'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface HabitStats {
  totalHabits: number
  activeHabits: number
  completedToday: number
  totalPoints: number
  totalStreak: number
  bestStreak: number
  categories: string[]
  difficulties: {
    Kolay: number
    Orta: number
    Zor: number
  }
}

export default function Statistics() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<HabitStats | null>(null)
  const [achievements, setAchievements] = useState<{ id: string; achievement_name: string; description?: string; earned_at: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const handleSignOut = () => {
    setUser(null)
    setStats(null)
    setAchievements([])
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          
          const [statsData, achievementsData] = await Promise.all([
            getHabitStats(currentUser.id),
            getUserAchievements(currentUser.id).catch(() => [])
          ])
          
          setStats(statsData)
          setAchievements(achievementsData)
        }
      } catch (error) {
        console.error('Veri yüklenirken hata:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSignOut={handleSignOut} />
        <main className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Yükleniyor...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSignOut={handleSignOut} />
        <main className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-serif text-gray-900 mb-4">Giriş Yapın</h1>
            <p className="text-gray-600">İstatistikleri görüntülemek için giriş yapmanız gerekiyor.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSignOut={handleSignOut} />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-serif text-gray-900 mb-4">İstatistikler</h1>
          <div className="w-16 h-px bg-gray-300"></div>
        </div>

        {stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 border-l-4 border-gray-300">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Toplam Alışkanlık</h3>
                <p className="text-3xl font-serif text-gray-900">{stats.totalHabits}</p>
              </div>
              
              <div className="bg-white p-6 border-l-4 border-green-300">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Aktif Alışkanlık</h3>
                <p className="text-3xl font-serif text-gray-900">{stats.activeHabits}</p>
              </div>
              
              <div className="bg-white p-6 border-l-4 border-blue-300">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Bugün Tamamlanan</h3>
                <p className="text-3xl font-serif text-gray-900">{stats.completedToday}</p>
              </div>
              
              <div className="bg-white p-6 border-l-4 border-purple-300">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Toplam Puan</h3>
                <p className="text-3xl font-serif text-gray-900">{stats.totalPoints}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6">
                <h3 className="text-xl font-serif text-gray-900 mb-6">Seri İstatistikleri</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Mevcut Toplam Seri</span>
                    <span className="text-2xl font-serif text-gray-900">{stats.totalStreak} gün</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">En İyi Seri</span>
                    <span className="text-2xl font-serif text-gray-900">{stats.bestStreak} gün</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6">
                <h3 className="text-xl font-serif text-gray-900 mb-6">Kategoriler</h3>
                <div className="space-y-2">
                  {stats.categories.map((category) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-gray-600">{category}</span>
                      <span className="text-sm text-gray-500">1 alışkanlık</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6">
              <h3 className="text-xl font-serif text-gray-900 mb-6">Zorluk Dağılımı</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-serif text-green-600 mb-2">{stats.difficulties.Kolay}</div>
                  <div className="text-sm text-gray-500">Kolay</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif text-yellow-600 mb-2">{stats.difficulties.Orta}</div>
                  <div className="text-sm text-gray-500">Orta</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif text-red-600 mb-2">{stats.difficulties.Zor}</div>
                  <div className="text-sm text-gray-500">Zor</div>
                </div>
              </div>
            </div>

            {achievements.length > 0 && (
              <div className="bg-white p-6">
                <h3 className="text-xl font-serif text-gray-900 mb-6">Başarılar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="border border-gray-200 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🏆</span>
                        <h4 className="font-medium text-gray-900">{achievement.achievement_name}</h4>
                      </div>
                      {achievement.description && (
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(achievement.earned_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
