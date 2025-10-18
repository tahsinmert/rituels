# Mikro Alışkanlık Takipçisi

Günlük alışkanlıklarını takip etmek için basit bir web uygulaması.

## Ne İşe Yarar?

- Alışkanlık ekleyebilirsin
- Tamamladığın alışkanlıkları işaretleyebilirsin  
- Alışkanlıkları silebilirsin
- Güzel bir tasarımla hepsini görebilirsin

## Nasıl Çalıştırılır?

### 1. Projeyi indir
```bash
git clone <repo-url>
cd mikro-aliskanlik-takipcisi
```

### 2. Paketleri yükle
```bash
npm install
```

### 3. Supabase ayarla
1. Supabase.com'a git
2. Yeni proje oluştur
3. SQL Editor'da `supabase-schema.sql` dosyasındaki tüm komutları çalıştır

### 4. .env.local dosyası oluştur
```
NEXT_PUBLIC_SUPABASE_URL=senin_supabase_url_in
NEXT_PUBLIC_SUPABASE_ANON_KEY=senin_supabase_key_in
```

### 5. Çalıştır
```bash
npm run dev
```

http://localhost:3000 adresine git.

## Kullanılan Teknolojiler

- Next.js 14
- Supabase
- Tailwind CSS
- TypeScript

## Nasıl Kullanılır?

1. Kayıt ol veya giriş yap
2. ➕ butonuna bas, yeni alışkanlık ekle
3. ✅ butonuna bas, tamamlandı olarak işaretle
4. ❌ butonuna bas, sil

## Dosya Yapısı

```
src/
├── app/
│   ├── page.tsx          # Ana sayfa
│   └── profile/          # Profil sayfası
├── components/
│   ├── HabitCard.tsx     # Alışkanlık kartı
│   ├── HabitForm.tsx     # Yeni alışkanlık formu
│   └── AuthForm.tsx      # Giriş formu
└── lib/
    ├── supabaseClient.ts # Supabase bağlantısı
    └── habits.ts         # Veritabanı işlemleri
```

## Geliştirici

Tahsin Mert Mutlu tarafından kodlanmıştır.

[LinkedIn Profili](https://www.linkedin.com/in/tahsinmertmutlu/)