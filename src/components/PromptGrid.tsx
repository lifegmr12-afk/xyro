'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Copy, Bookmark, Share2, Star, Eye, Clock, ChevronRight,
  Zap, Lock, MoreHorizontal, Check
} from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { PromptWithCategory } from '@/lib/database.types'
import { useAuth } from '@/contexts/AuthContext'

interface PromptGridProps {
  limit?: number
  category?: string
  platform?: string
  featured?: boolean
  showFilters?: boolean
}

export default function PromptGrid({
  limit = 12,
  category,
  platform,
  featured = false,
  showFilters = false
}: PromptGridProps) {
  const { user } = useAuth()
  const [prompts, setPrompts] = useState<PromptWithCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const fetchPrompts = useCallback(async () => {
    setIsLoading(true)
    try {
      let query = supabase
        .from('prompts')
        .select('*, categories(*)')
        .eq('is_published', true)

      if (category) {
        query = query.eq('categories.slug', category)
      }
      if (platform) {
        query = query.ilike('platform', platform)
      }
      if (featured) {
        query = query.eq('is_featured', true)
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(limit)

      if (!error && data) {
        setPrompts(data as PromptWithCategory[])
      } else {
        setPrompts([])
      }
    } catch {
      setPrompts([])
    } finally {
      setIsLoading(false)
    }
  }, [limit, category, platform, featured])

  useEffect(() => {
    fetchPrompts()
  }, [fetchPrompts])

  useEffect(() => {
    if (!user) return

    async function fetchFavorites() {
      const { data } = await supabase
        .from('prompt_favorites')
        .select('prompt_id')
        .eq('user_id', user!.id)

      if (data) {
        setFavorites(new Set(data.map((f: { prompt_id: string }) => f.prompt_id)))
      }
    }

    fetchFavorites()
  }, [user])

  const copyPrompt = async (prompt: PromptWithCategory) => {
    try {
      await navigator.clipboard.writeText(prompt.prompt_text)
      setCopiedId(prompt.id)
      toast.success('Prompt copied to clipboard')

      await supabase
        .from('prompts')
        .update({ copies_count: prompt.copies_count + 1 })
        .eq('id', prompt.id)

      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      toast.error('Failed to copy prompt')
    }
  }

  const toggleFavorite = async (prompt: PromptWithCategory) => {
    if (!user) {
      toast.error('Sign in to save prompts')
      return
    }

    try {
      if (favorites.has(prompt.id)) {
        await supabase
          .from('prompt_favorites')
          .delete()
          .match({ prompt_id: prompt.id, user_id: user.id })

        setFavorites(prev => {
          const next = new Set(prev)
          next.delete(prompt.id)
          return next
        })

        await supabase
          .from('prompts')
          .update({ favorites_count: Math.max(0, prompt.favorites_count - 1) })
          .eq('id', prompt.id)

        toast.success('Removed from favorites')
      } else {
        await supabase
          .from('prompt_favorites')
          .insert({ prompt_id: prompt.id, user_id: user.id })

        setFavorites(prev => new Set(prev).add(prompt.id))

        await supabase
          .from('prompts')
          .update({ favorites_count: prompt.favorites_count + 1 })
          .eq('id', prompt.id)

        toast.success('Added to favorites')
      }
    } catch {
      toast.error('Failed to update favorite')
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Hard':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="h-4 bg-slate-800 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                </div>
                <div className="h-6 w-16 bg-slate-800 rounded" />
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-slate-800 rounded w-full" />
                <div className="h-3 bg-slate-800 rounded w-2/3" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-slate-800 rounded" />
                <div className="h-8 w-20 bg-slate-800 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (prompts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <Zap className="w-8 h-8 text-slate-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No prompts found</h3>
        <p className="text-slate-400 mb-6">Try adjusting your search or filters</p>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          Browse all prompts
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {prompts.map((prompt, i) => (
        <motion.article
          key={prompt.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 hover:border-white/10 hover:bg-white/8 transition-all duration-300"
        >
          {prompt.is_premium && (
            <div className="absolute top-4 right-4">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
                <Lock className="w-3 h-3 text-primary-light" />
              </div>
            </div>
          )}

          {prompt.is_featured && (
            <div className="absolute -top-2 -right-2">
              <div className="px-2 py-1 rounded-lg bg-gradient-to-r from-primary to-accent text-xs font-medium">
                Featured
              </div>
            </div>
          )}

          <div className="flex items-start justify-between gap-3 mb-3">
            <Link
              href={`/prompt/${prompt.id}`}
              className="flex-1 min-w-0"
            >
              <h3 className="font-semibold text-lg truncate group-hover:text-primary-light transition-colors">
                {prompt.title}
              </h3>
            </Link>
            <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getDifficultyColor(prompt.difficulty)}`}>
              {prompt.difficulty}
            </span>
          </div>

          <p className="text-sm text-slate-400 line-clamp-2 mb-4">
            {prompt.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className="px-2 py-1 rounded-md bg-primary/10 text-xs text-primary-light">
              {prompt.platform}
            </span>
            {prompt.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 rounded-md bg-white/5 text-xs text-slate-500"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span>{prompt.rating_avg?.toFixed(1) || '0.0'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{prompt.views_count?.toLocaleString() || '0'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Copy className="w-3.5 h-3.5" />
              <span>{prompt.copies_count?.toLocaleString() || '0'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyPrompt(prompt)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-primary/80 to-accent/80 hover:from-primary hover:to-accent text-sm font-medium text-white transition-all duration-200"
            >
              {copiedId === prompt.id ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Prompt
                </>
              )}
            </button>
            <button
              onClick={() => toggleFavorite(prompt)}
              className={`p-2.5 rounded-xl border transition-all duration-200 ${
                favorites.has(prompt.id)
                  ? 'bg-primary/20 border-primary/30 text-primary-light'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${favorites.has(prompt.id) ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all duration-200">
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/50 to-accent/50" />
              <span className="text-xs text-slate-500">{prompt.author_name}</span>
            </div>
            <span className="text-xs text-slate-600 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(prompt.created_at).toLocaleDateString()}
            </span>
          </div>
        </motion.article>
      ))}
    </div>
  )
}
