import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-600">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/4">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-br from-purple-600 to-blue-400 shadow-neon-sm">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15 8L21 9L16 13L17 19L12 16L7 19L8 13L3 9L9 8L12 2Z" fill="white"/></svg>
            </div>
            <div>
              <div className="font-bold">PromptVerse AI</div>
              <div className="text-xs text-slate-300 -mt-1">Discover, Create & Share Powerful AI Prompts</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a href="#" className="hover:text-white">Explore</a>
            <a href="#" className="hover:text-white">Collections</a>
            <a href="#" className="hover:text-white">Pricing</a>
            <a href="#" className="hover:text-white">Blog</a>
          </nav>
        </div>
      </header>
      {children}
      <footer className="mt-24">
        <div className="max-w-[1200px] mx-auto px-6 py-8 text-sm text-slate-400">© {new Date().getFullYear()} PromptVerse AI — All rights reserved.</div>
      </footer>
    </div>
  )
}
