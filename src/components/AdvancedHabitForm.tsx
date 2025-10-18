'use client'

import { useState } from 'react'
import { createHabitWithDetails } from '@/lib/habits'

interface AdvancedHabitFormProps {
  userId: string
  onSuccess: () => void
  onCancel: () => void
}

const categories = [
  'Sağlık',
  'Spor',
  'Öğrenme',
  'İş',
  'Kişisel',
  'Sosyal',
  'Yaratıcılık',
  'Finans',
  'Genel'
]

const difficulties = [
  { value: 'Kolay', label: 'Kolay', points: 1 },
  { value: 'Orta', label: 'Orta', points: 2 },
  { value: 'Zor', label: 'Zor', points: 3 }
]

const frequencies = [
  { value: 'Günlük', label: 'Günlük' },
  { value: 'Haftalık', label: 'Haftalık' },
  { value: 'Aylık', label: 'Aylık' }
]

export default function AdvancedHabitForm({ userId, onSuccess, onCancel }: AdvancedHabitFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Genel')
  const [difficulty, setDifficulty] = useState<'Kolay' | 'Orta' | 'Zor'>('Kolay')
  const [targetFrequency, setTargetFrequency] = useState<'Günlük' | 'Haftalık' | 'Aylık'>('Günlük')
  const [targetCount, setTargetCount] = useState(1)
  const [reminderTime, setReminderTime] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)
    try {
      console.log('Gelişmiş alışkanlık oluşturuluyor:', {
        userId,
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        difficulty,
        targetFrequency,
        targetCount,
        reminderTime: reminderTime || undefined
      })
      
      await createHabitWithDetails(
        userId,
        title.trim(),
        description.trim() || undefined,
        category,
        difficulty,
        targetFrequency,
        targetCount,
        reminderTime || undefined
      )
      onSuccess()
    } catch (error) {
      console.error('Alışkanlık oluşturulurken hata:', error)
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata'
      alert(`Alışkanlık oluşturulamadı: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white border-l-4 border-gray-300 p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alışkanlık Adı *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border-b border-gray-300 focus:border-gray-500 focus:outline-none bg-transparent"
            placeholder="Örn: Her gün 30 dakika kitap okumak"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Açıklama
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border-b border-gray-300 focus:border-gray-500 focus:outline-none bg-transparent resize-none"
            placeholder="Alışkanlık hakkında detaylar..."
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border-b border-gray-300 focus:border-gray-500 focus:outline-none bg-transparent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zorluk Seviyesi
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'Kolay' | 'Orta' | 'Zor')}
              className="w-full px-3 py-2 border-b border-gray-300 focus:border-gray-500 focus:outline-none bg-transparent"
            >
              {difficulties.map((diff) => (
                <option key={diff.value} value={diff.value}>
                  {diff.label} ({diff.points} puan)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hedef Sıklığı
            </label>
            <select
              value={targetFrequency}
              onChange={(e) => setTargetFrequency(e.target.value as 'Günlük' | 'Haftalık' | 'Aylık')}
              className="w-full px-3 py-2 border-b border-gray-300 focus:border-gray-500 focus:outline-none bg-transparent"
            >
              {frequencies.map((freq) => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hedef Sayısı
            </label>
            <input
              type="number"
              value={targetCount}
              onChange={(e) => setTargetCount(parseInt(e.target.value) || 1)}
              min="1"
              max="100"
              className="w-full px-3 py-2 border-b border-gray-300 focus:border-gray-500 focus:outline-none bg-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hatırlatıcı Saati (İsteğe bağlı)
          </label>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="w-full px-3 py-2 border-b border-gray-300 focus:border-gray-500 focus:outline-none bg-transparent"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            className="px-6 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Ekleniyor...' : 'Alışkanlık Ekle'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  )
}
