import React, { useEffect, useState } from 'react'

export default function PromptGrid() {
  const [prompts, setPrompts] = useState<any[]>([])
  useEffect(() => {
    fetch('/api/prompts?limit=12').then(r => r.json()).then(setPrompts)
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {prompts.map(p => (
        <article key={p.id} className="p-4 rounded-2xl bg-black/30 border border-white/6 hover:scale-[1.01] transition shadow-neon-sm">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-slate-400 mt-1 line-clamp-2">{p.description}</p>
            </div>
            <div className="text-right text-xs text-slate-400">
              <div>{p.platform}</div>
              <div className="mt-2">{p.difficulty}</div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button className="px-3 py-1 rounded-md bg-white/6">Copy</button>
            <button className="px-3 py-1 rounded-md bg-white/6">Save</button>
            <div className="text-xs text-slate-400 ml-auto">{p.copy_count} copies</div>
          </div>
        </article>
      ))}
    </div>
  )
}
