# Kurulum Rehberi

## 1. Supabase'e Git
1. [supabase.com](https://supabase.com) adresine git
2. Hesap oluştur veya giriş yap
3. "New Project" butonuna bas
4. Proje adını yaz (örn: "mikro-aliskanlik")
5. Şifre oluştur ve "Create new project" bas

## 2. Veritabanını Hazırla
1. Sol menüden "SQL Editor" seç
2. `supabase-schema.sql` dosyasını aç
3. Tüm kodu kopyala
4. SQL Editor'a yapıştır
5. "Run" butonuna bas

## 3. Proje Ayarları
1. Sol menüden "Settings" > "API" seç
2. "Project URL" ve "anon public" key'i kopyala
3. Projende `.env.local` dosyası oluştur:
```
NEXT_PUBLIC_SUPABASE_URL=buraya_url_yapıştır
NEXT_PUBLIC_SUPABASE_ANON_KEY=buraya_key_yapıştır
```

## 4. Çalıştır
```bash
npm run dev
```

http://localhost:3000 adresine git ve kullanmaya başla!

## Sorun Çıkarsa
- SQL hataları alıyorsan: Supabase'de "Table Editor" > "habits" tablosunu kontrol et
- Giriş yapamıyorsan: Supabase'de "Authentication" > "Users" kısmına bak
- Sayfa açılmıyorsan: Terminal'de hata mesajlarını kontrol et