'use client'

import { useState } from 'react'
import { Habit, completeHabit, deleteHabit } from '@/lib/habits'

interface AdvancedHabitCardProps {
  habit: Habit
  onUpdate: () => void
}

const difficultyColors = {
  Kolay: 'bg-green-100 text-green-800',
  Orta: 'bg-yellow-100 text-yellow-800',
  Zor: 'bg-red-100 text-red-800'
}

const categoryIcons = {
  Sağlık: '🏥',
  Spor: '💪',
  Öğrenme: '📚',
  İş: '💼',
  Kişisel: '👤',
  Sosyal: '👥',
  Yaratıcılık: '🎨',
  Finans: '💰',
  Genel: '⭐'
}

export default function AdvancedHabitCard({ habit, onUpdate }: AdvancedHabitCardProps) {
  const [isCompleting, setIsCompleting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const handleComplete = async () => {
    setIsCompleting(true)
    try {
      await completeHabit(habit.id, habit.user_id)
      onUpdate()
    } catch (error) {
      console.error('Alışkanlık tamamlanırken hata:', error)
    } finally {
      setIsCompleting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bu alışkanlığı silmek istediğinizden emin misiniz?')) return
    
    setIsDeleting(true)
    try {
      await deleteHabit(habit.id)
      onUpdate()
    } catch (error) {
      console.error('Alışkanlık silinirken hata:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getProgressPercentage = () => {
    if (habit.target_count === 0) return 0
    return Math.min((habit.current_count / habit.target_count) * 100, 100)
  }

  return (
    <div className="bg-white border-l-4 border-gray-200 hover:border-gray-400 transition-all duration-200 group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">
                {categoryIcons[habit.category as keyof typeof categoryIcons] || '⭐'}
              </span>
              <h3 className="text-xl font-serif text-gray-900">
                {habit.title}
              </h3>
            </div>
            
            {habit.description && (
              <p className="text-gray-600 text-sm mb-3">
                {habit.description}
              </p>
            )}

            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${difficultyColors[habit.difficulty]}`}>
                {habit.difficulty}
              </span>
              <span className="text-xs text-gray-500">
                {habit.points} puan
              </span>
              <span className="text-xs text-gray-500">
                {habit.target_frequency}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Detayları göster"
            >
              {showDetails ? '👁️‍🗨️' : '👁️'}
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
              title="Sil"
            >
              {isDeleting ? '⏳' : '❌'}
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Seri:</span>
                <span className="ml-2 font-medium">{habit.streak_count} gün</span>
              </div>
              <div>
                <span className="text-gray-500">En İyi Seri:</span>
                <span className="ml-2 font-medium">{habit.best_streak} gün</span>
              </div>
              <div>
                <span className="text-gray-500">Hedef:</span>
                <span className="ml-2 font-medium">{habit.target_count} {habit.target_frequency.toLowerCase()}</span>
              </div>
              <div>
                <span className="text-gray-500">Tamamlanan:</span>
                <span className="ml-2 font-medium">{habit.current_count}</span>
              </div>
            </div>
            
            {habit.reminder_time && (
              <div className="mt-2 text-sm text-gray-500">
                <span>⏰ Hatırlatıcı: {habit.reminder_time}</span>
              </div>
            )}
          </div>
        )}

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>İlerleme</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gray-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {formatDate(habit.created_at)}
          </div>
          
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isCompleting ? 'Tamamlanıyor...' : '✅ Tamamla'}
          </button>
        </div>
      </div>
    </div>
  )
}
