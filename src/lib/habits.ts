import { supabase } from './supabaseClient'

export interface Habit {
  id: string
  user_id: string
  title: string
  description?: string
  category: string
  difficulty: 'Kolay' | 'Orta' | 'Zor'
  points: number
  is_done: boolean
  streak_count: number
  best_streak: number
  target_frequency: 'Günlük' | 'Haftalık' | 'Aylık'
  target_count: number
  current_count: number
  reminder_time?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface HabitCompletion {
  id: string
  habit_id: string
  user_id: string
  completed_at: string
  notes?: string
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_type: string
  achievement_name: string
  description?: string
  earned_at: string
}


export const getHabits = async (userId: string): Promise<Habit[]> => {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Alışkanlıklar getirilirken hata:', error)
    throw error
  }

  return data || []
}

export const createHabit = async (userId: string, title: string): Promise<Habit> => {
  const { data, error } = await supabase
    .from('habits')
    .insert([
      {
        user_id: userId,
        title,
        is_done: false,
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Alışkanlık oluşturulurken hata:', error)
    throw error
  }

  return data
}

export const toggleHabit = async (habitId: string, isDone: boolean): Promise<Habit> => {
  const { data, error } = await supabase
    .from('habits')
    .update({ is_done: isDone })
    .eq('id', habitId)
    .select()
    .single()

  if (error) {
    console.error('Alışkanlık güncellenirken hata:', error)
    throw error
  }

  return data
}

export const deleteHabit = async (habitId: string): Promise<void> => {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId)

  if (error) {
    console.error('Alışkanlık silinirken hata:', error)
    throw error
  }
}

export const createHabitWithDetails = async (
  userId: string,
  title: string,
  description?: string,
  category: string = 'Genel',
  difficulty: 'Kolay' | 'Orta' | 'Zor' = 'Kolay',
  targetFrequency: 'Günlük' | 'Haftalık' | 'Aylık' = 'Günlük',
  targetCount: number = 1,
  reminderTime?: string
) => {
  try {
    const points = difficulty === 'Kolay' ? 1 : difficulty === 'Orta' ? 2 : 3
    
    const habitData = {
      user_id: userId,
      title,
      description,
      category,
      difficulty,
      points,
      target_frequency: targetFrequency,
      target_count: targetCount,
      reminder_time: reminderTime
    }

    console.log('Alışkanlık oluşturuluyor:', habitData)
    
    const { data, error } = await supabase
      .from('habits')
      .insert(habitData)
      .select()
      .single()

    if (error) {
      console.error('Alışkanlık oluşturulurken hata:', error)
      console.error('Hata detayları:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      
      // Eğer category sütunu yoksa, eski createHabit fonksiyonunu kullan
      if (error.message.includes('category')) {
        console.log('Category sütunu bulunamadı, eski createHabit kullanılıyor')
        return await createHabit(userId, title)
      }
      
      throw new Error(`Alışkanlık oluşturulamadı: ${error.message}`)
    }

    console.log('Alışkanlık başarıyla oluşturuldu:', data)
    return data
  } catch (error) {
    console.error('createHabitWithDetails hatası:', error)
    throw error
  }
}

export const completeHabit = async (habitId: string, userId: string, notes?: string) => {
  const { data: habit, error: habitError } = await supabase
    .from('habits')
    .select('*')
    .eq('id', habitId)
    .single()

  if (habitError) {
    throw new Error(`Alışkanlık bulunamadı: ${habitError.message}`)
  }

  const { error: completionError } = await supabase
    .from('habit_completions')
    .insert({
      habit_id: habitId,
      user_id: userId,
      notes
    })

  if (completionError) {
    throw new Error(`Tamamlama kaydedilirken hata oluştu: ${completionError.message}`)
  }

  const newStreak = habit.streak_count + 1
  const newBestStreak = Math.max(habit.best_streak, newStreak)
  const newCurrentCount = habit.current_count + 1

  const { error: updateError } = await supabase
    .from('habits')
    .update({
      streak_count: newStreak,
      best_streak: newBestStreak,
      current_count: newCurrentCount,
      updated_at: new Date().toISOString()
    })
    .eq('id', habitId)

  if (updateError) {
    throw new Error(`Alışkanlık güncellenirken hata oluştu: ${updateError.message}`)
  }

  return { newStreak, newBestStreak }
}

export const getHabitCompletions = async (habitId: string) => {
  const { data, error } = await supabase
    .from('habit_completions')
    .select('*')
    .eq('habit_id', habitId)
    .order('completed_at', { ascending: false })

  if (error) {
    throw new Error(`Tamamlamalar getirilirken hata oluştu: ${error.message}`)
  }

  return data
}

export const getUserAchievements = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false })

  if (error) {
    console.error('Başarılar getirilirken hata:', error)
    return []
  }

  return data || []
}

export const addAchievement = async (
  userId: string,
  achievementType: string,
  achievementName: string,
  description?: string
) => {
  const { data, error } = await supabase
    .from('user_achievements')
    .insert({
      user_id: userId,
      achievement_type: achievementType,
      achievement_name: achievementName,
      description
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Başarı eklenirken hata oluştu: ${error.message}`)
  }

  return data
}


export const getHabitsByCategory = async (userId: string, category: string) => {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .eq('category', category)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Kategori alışkanlıkları getirilirken hata oluştu: ${error.message}`)
  }

  return data
}

export const getHabitStats = async (userId: string) => {
  const { data: habits, error: habitsError } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)

  if (habitsError) {
    throw new Error(`Alışkanlık istatistikleri getirilirken hata oluştu: ${habitsError.message}`)
  }

  const totalHabits = habits.length
  const activeHabits = habits.filter(h => h.is_active).length
  const completedToday = habits.filter(h => h.is_done).length
  const totalPoints = habits.reduce((sum, h) => sum + h.points, 0)
  const totalStreak = habits.reduce((sum, h) => sum + h.streak_count, 0)
  const bestStreak = Math.max(...habits.map(h => h.best_streak), 0)

  const categories = [...new Set(habits.map(h => h.category))]
  const difficulties = {
    Kolay: habits.filter(h => h.difficulty === 'Kolay').length,
    Orta: habits.filter(h => h.difficulty === 'Orta').length,
    Zor: habits.filter(h => h.difficulty === 'Zor').length
  }

  return {
    totalHabits,
    activeHabits,
    completedToday,
    totalPoints,
    totalStreak,
    bestStreak,
    categories,
    difficulties
  }
}