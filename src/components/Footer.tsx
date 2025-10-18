'use client'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center">
          <div className="w-16 h-px bg-gray-300 mx-auto mb-6"></div>
          <p className="text-sm text-gray-500 font-light">
            Mikro Alışkanlık Takipçisi
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Tahsin Mert Mutlu tarafından kodlanmıştır
          </p>
          <a 
            href="https://www.linkedin.com/in/tahsinmertmutlu/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors mt-1 inline-block"
          >
            LinkedIn Profili
          </a>
        </div>
      </div>
    </footer>
  )
}
