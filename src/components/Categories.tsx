import React from 'react'

const categories = [
  'ChatGPT','Gemini','Claude','Midjourney','Stable Diffusion','Runway','Veo','Sora','Coding','Marketing','Business','SEO','YouTube','Writing','Education','Productivity','Design','Gaming','Anime','Social Media','Finance','Resume','Interview','Email','Sales','Customer Support'
]

export default function Categories(){
  return (
    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.slice(0,12).map((c) => (
        <div key={c} className="p-4 rounded-xl bg-black/30 border border-white/6 hover:translate-y-[-4px] transition">
          <div className="font-medium">{c}</div>
          <div className="text-xs text-slate-400 mt-1">Prompts</div>
        </div>
      ))}
    </div>
  )
}
