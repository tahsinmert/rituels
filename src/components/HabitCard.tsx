'use client'

import { Habit, toggleHabit, deleteHabit } from '@/lib/habits'
import { useState } from 'react'

interface HabitCardProps {
  habit: Habit
  onUpdate: () => void
}

export default function HabitCard({ habit, onUpdate }: HabitCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      await toggleHabit(habit.id, !habit.is_done)
      onUpdate()
    } catch (error) {
      console.error('Alışkanlık güncellenirken hata:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bu alışkanlığı silmek istediğinizden emin misiniz?')) {
      return
    }

    setIsLoading(true)
    try {
      await deleteHabit(habit.id)
      onUpdate()
    } catch (error) {
      console.error('Alışkanlık silinirken hata:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className={`
      group relative bg-white border-l-4 border-gray-200 pl-8 pr-6 py-8
      hover:border-gray-400 transition-all duration-300
      ${habit.is_done ? 'border-l-green-500 opacity-60' : 'border-l-gray-300'}
    `}>
      {/* Başlık - Dergi tarzı tipografi */}
      <h3 className={`
        editorial-heading text-3xl mb-6 leading-tight
        ${habit.is_done ? 'line-through text-gray-400' : 'text-gray-900'}
      `}>
        {habit.title}
      </h3>

      {/* Tarih - Minimal */}
      <p className="text-sm text-gray-400 mb-8 font-light tracking-wide">
        {formatDate(habit.created_at)}
      </p>

      {/* Durum göstergesi - Minimal */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className={`
            w-2 h-2 rounded-full mr-3
            ${habit.is_done ? 'bg-green-500' : 'bg-gray-300'}
          `}></div>
          <span className={`
            text-xs font-medium uppercase tracking-wider
            ${habit.is_done ? 'text-green-600' : 'text-gray-500'}
          `}>
            {habit.is_done ? 'Tamamlandı' : 'Beklemede'}
          </span>
        </div>

        {/* Aksiyon butonları - Minimal */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-xs
              transition-all duration-200 disabled:opacity-50
              ${habit.is_done 
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                : 'bg-green-100 text-green-600 hover:bg-green-200'
              }
            `}
            title={habit.is_done ? 'Geri Al' : 'Tamamla'}
          >
            {habit.is_done ? '↩' : '✓'}
          </button>

          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs
                     bg-red-100 text-red-600 hover:bg-red-200
                     transition-all duration-200 disabled:opacity-50"
            title="Sil"
          >
            ×
          </button>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}
