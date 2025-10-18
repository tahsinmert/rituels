'use client'

import { useState } from 'react'
import { createHabit } from '@/lib/habits'

interface HabitFormProps {
  userId: string
  onHabitAdded: () => void
}

export default function HabitForm({ userId, onHabitAdded }: HabitFormProps) {
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      return
    }

    setIsLoading(true)
    try {
      await createHabit(userId, title.trim())
      setTitle('')
      setIsOpen(false)
      onHabitAdded()
    } catch (error) {
      console.error('Alışkanlık oluşturulurken hata:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="
          w-full h-32 border-l-4 border-dashed border-gray-300 pl-8 pr-6 py-8
          flex items-center justify-center gap-4
          hover:border-gray-400 hover:bg-gray-50
          transition-all duration-300 group
        "
      >
        <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:border-gray-400">
          <span className="text-lg text-gray-400 group-hover:text-gray-600">+</span>
        </div>
        <span className="text-lg font-light text-gray-500 group-hover:text-gray-700">
          Yeni Alışkanlık
        </span>
      </button>
    )
  }

  return (
    <div className="bg-white border-l-4 border-gray-300 pl-8 pr-6 py-8">
      <h3 className="editorial-heading text-2xl mb-8 text-gray-900">
        Yeni Alışkanlık
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Alışkanlık başlığını yazın..."
            className="
              w-full px-0 py-3 border-0 border-b border-gray-300 bg-transparent
              focus:ring-0 focus:border-gray-900 focus:outline-none
              text-lg placeholder-gray-400 font-light
              transition-all duration-200
            "
            disabled={isLoading}
            autoFocus
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            className="
              bg-gray-900 text-white py-3 px-8
              font-light hover:bg-gray-800 disabled:opacity-50
              transition-colors duration-200 flex items-center justify-center gap-2
            "
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Ekleniyor...
              </>
            ) : (
              'Ekle'
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              setTitle('')
            }}
            disabled={isLoading}
            className="
              py-3 px-6 text-gray-500 hover:text-gray-700
              font-light disabled:opacity-50
              transition-colors duration-200
            "
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  )
}
