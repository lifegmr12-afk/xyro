import React from 'react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent to-transparent">
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-full" style={{background: 'radial-gradient(ellipse at 20% 10%, rgba(96,165,250,0.06), transparent 10%), radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.04), transparent 15%)'}}></div>
      </div>
      <div className="max-w-[1200px] mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-5xl font-extrabold leading-tight">Search 100,000+ AI Prompts</h1>
            <p className="mt-4 text-slate-300 max-w-lg">The largest collection of prompts for ChatGPT, Gemini, Claude, Midjourney, Stable Diffusion, Runway and more. Discover, create and share premium prompts built by experts.</p>
            <div className="mt-6 flex gap-3">
              <a className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-400 shadow-neon-sm hover:scale-[1.01] transition transform" href="#">Explore Prompts</a>
              <a className="px-6 py-3 rounded-lg border border-white/8 hover:bg-white/4 transition" href="#">Get Started</a>
            </div>
            <div className="mt-8 flex gap-8 text-sm text-slate-400">
              <div>
                <div className="text-2xl font-semibold">100,000+</div>
                <div className="text-xs">Prompts</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">50+</div>
                <div className="text-xs">Categories</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">500K+</div>
                <div className="text-xs">Users</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="p-6 rounded-2xl bg-black/40 border border-white/6 shadow-neon-sm backdrop-blur-md">
              <h3 className="font-semibold">Instant AI Search</h3>
              <p className="text-sm text-slate-300 mt-2">Try seamless search across platforms, categories, and more.</p>
              <div className="mt-4">
                <input className="w-full p-3 rounded-lg bg-white/5 border border-white/6 placeholder:text-slate-400" placeholder="Search prompts, e.g. 'YouTube video script'" />
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-gradient-to-br from-purple-700/40 to-blue-400/30 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
