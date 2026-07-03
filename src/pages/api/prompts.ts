import type { NextApiRequest, NextApiResponse } from 'next'
import prompts from '../../../data/prompts.json'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q, platform, category, difficulty, limit } = req.query
  let results = prompts

  if (q && typeof q === 'string') {
    const ql = q.toLowerCase()
    results = results.filter(p => p.title.toLowerCase().includes(ql) || p.prompt.toLowerCase().includes(ql) || (p.tags||[]).join(' ').toLowerCase().includes(ql))
  }
  if (platform && typeof platform === 'string') {
    results = results.filter(p => p.platform.toLowerCase() === platform.toLowerCase())
  }
  if (category && typeof category === 'string') {
    results = results.filter(p => p.category.toLowerCase() === category.toLowerCase())
  }
  if (difficulty && typeof difficulty === 'string') {
    results = results.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase())
  }

  const l = Number(limit || 24)
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120')
  res.status(200).json(results.slice(0, l))
}
