'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  MessageSquare, Sparkles, Brain, Palette, Video, Code, TrendingUp,
  Briefcase, Search, Youtube, PenTool, GraduationCap, Clock, Layout,
  Gamepad2, Tv, Share2, DollarSign, FileText, MessageCircle, Mail,
  ShoppingBag, Headphones, ChevronRight, Star
} from 'lucide-react'
import { Category } from '@/lib/database.types'
import { supabase } from '@/lib/supabase'

const categoryIcons: Record<string, React.ElementType> = {
  'chatgpt': MessageSquare,
  'gemini': Sparkles,
  'claude': Brain,
  'deepseek': Brain,
  'grok': Sparkles,
  'midjourney': Palette,
  'flux': Palette,
  'stable-diffusion': Palette,
  'dalle': Palette,
  'runway': Video,
  'veo': Video,
  'sora': Video,
  'coding': Code,
  'marketing': TrendingUp,
  'business': Briefcase,
  'seo': Search,
  'youtube': Youtube,
  'writing': PenTool,
  'education': GraduationCap,
  'productivity': Clock,
  'design': Layout,
  'gaming': Gamepad2,
  'anime': Tv,
  'social-media': Share2,
  'excel': FileText,
  'finance': DollarSign,
  'resume': FileText,
  'interview': MessageCircle,
  'email': Mail,
  'sales': ShoppingBag,
  'customer-support': Headphones,
}

const defaultCategories = [
  { name: 'ChatGPT', slug: 'chatgpt', icon: 'chatgpt' },
  { name: 'Gemini', slug: 'gemini', icon: 'gemini' },
  { name: 'Claude', slug: 'claude', icon: 'claude' },
  { name: 'Midjourney', slug: 'midjourney', icon: 'midjourney' },
  { name: 'Flux', slug: 'flux', icon: 'flux' },
  { name: 'Stable Diffusion', slug: 'stable-diffusion', icon: 'stable-diffusion' },
  { name: 'Coding', slug: 'coding', icon: 'coding' },
  { name: 'Marketing', slug: 'marketing', icon: 'marketing' },
  { name: 'YouTube', slug: 'youtube', icon: 'youtube' },
  { name: 'Writing', slug: 'writing', icon: 'writing' },
  { name: 'Business', slug: 'business', icon: 'business' },
  { name: 'Design', slug: 'design', icon: 'design' },
]

interface CategoriesProps {
  showAll?: boolean
  limit?: number
}

export default function Categories({ showAll = false, limit = 12 }: CategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true })
          .limit(showAll ? 100 : limit)

        if (!error && data) {
          setCategories(data)
        } else {
          // Use default categories if fetch fails
          setCategories(defaultCategories.slice(0, limit).map((c, i) => ({
            ...c,
            id: `default-${i}`,
            description: '',
            icon: null,
            prompt_count: Math.floor(Math.random() * 500) + 100,
            display_order: i,
            created_at: new Date().toISOString()
          })) as Category[])
        }
      } catch {
        // Use default categories on error
        setCategories(defaultCategories.slice(0, limit).map((c, i) => ({
          ...c,
          id: `default-${i}`,
          description: '',
          icon: null,
          prompt_count: Math.floor(Math.random() * 500) + 100,
          display_order: i,
          created_at: new Date().toISOString()
        })) as Category[])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [limit, showAll])

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-slate-800 mb-4" />
              <div className="h-4 bg-slate-800 rounded w-20 mb-2" />
              <div className="h-3 bg-slate-800 rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((category, i) => {
        const Icon = categoryIcons[category.slug] || Sparkles
        const count = category.prompt_count || Math.floor(Math.random() * 500) + 100

        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={`/explore?category=${category.slug}`}
              className="group block p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-primary-light group-hover:text-accent transition-colors" />
                </div>
                <h3 className="mt-3 font-medium text-sm group-hover:text-white transition-colors">
                  {category.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {count.toLocaleString()} prompts
                </p>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}

// Featured categories section with detailed cards
export function FeaturedCategories() {
  const featured = [
    {
      name: 'ChatGPT',
      slug: 'chatgpt',
      description: 'Powerful prompts for ChatGPT to enhance productivity, creativity, and problem-solving.',
      icon: MessageSquare,
      color: 'from-green-500/20 to-emerald-500/20',
    },
    {
      name: 'Midjourney',
      slug: 'midjourney',
      description: 'Stunning image generation prompts for creating beautiful AI artwork.',
      icon: Palette,
      color: 'from-purple-500/20 to-pink-500/20',
    },
    {
      name: 'Claude',
      slug: 'claude',
      description: 'Advanced prompts for Claude to help with analysis, writing, and research.',
      icon: Brain,
      color: 'from-orange-500/20 to-amber-500/20',
    },
    {
      name: 'Marketing',
      slug: 'marketing',
      description: 'Templates for ad copy, email campaigns, and growth strategies.',
      icon: TrendingUp,
      color: 'from-blue-500/20 to-cyan-500/20',
    },
  ]

  return (
    <section className="py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Popular Categories</h2>
          <p className="text-slate-400 mt-1">Explore prompts across different AI platforms and use cases</p>
        </div>
        <Link
          href="/explore/categories"
          className="hidden sm:flex items-center gap-1 text-sm text-primary-light hover:text-accent transition-colors"
        >
          View all categories
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {featured.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              href={`/explore?category=${cat.slug}`}
              className="group block p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <cat.icon className="w-7 h-7 text-primary-light" />
                </div>

                <h3 className="mt-4 font-semibold text-lg group-hover:text-white transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                  {cat.description}
                </p>

                <div className="mt-4 flex items-center gap-1 text-sm text-primary-light group-hover:text-accent transition-colors">
                  Explore prompts
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
