'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Sparkles, ArrowRight, Zap, TrendingUp, Users, Copy, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/router'

const platforms = [
  'ChatGPT', 'Gemini', 'Claude', 'Midjourney', 'DeepSeek', 'Grok', 'Flux', 'Stable Diffusion'
]

const trendingSearches = [
  'YouTube script', 'Marketing email', 'Product description', 'Blog outline', 'Code review'
]

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <section className="relative overflow-hidden">
      {/* Animated background mesh */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-mesh" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-radial from-primary/20 to-transparent blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-radial from-accent/15 to-transparent blur-[80px]"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.25, 0.35, 0.25],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Hero content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-white/10 mb-6"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
                The #1 AI Prompt Library
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
            >
              Search{' '}
              <span className="bg-gradient-to-r from-primary-light via-white to-accent bg-clip-text text-transparent animate-gradient-x">
                100,000+
              </span>
              {' '}AI Prompts
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-lg text-slate-300 max-w-xl leading-relaxed"
            >
              The largest collection of prompts for ChatGPT, Gemini, Claude, Midjourney, Flux, Veo, Sora, Runway, and more.
              Discover, create and share premium prompts built by experts.
            </motion.p>

            {/* Platform badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 flex flex-wrap gap-2"
            >
              {platforms.slice(0, 6).map((platform, i) => (
                <span
                  key={platform}
                  className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400 hover:border-primary/30 hover:text-white transition-colors cursor-default"
                >
                  {platform}
                </span>
              ))}
              <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400">
                +{platforms.length - 6} more
              </span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                href="/explore"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-accent font-semibold text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <Sparkles className="w-5 h-5" />
                Explore Prompts
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/generator"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 font-semibold hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <Zap className="w-5 h-5 text-accent" />
                AI Generator
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 grid grid-cols-4 gap-6"
            >
              {[
                { value: '100K+', label: 'Prompts', icon: Copy },
                { value: '50+', label: 'Categories', icon: TrendingUp },
                { value: '500K+', label: 'Users', icon: Users },
                { value: '1M+', label: 'Copies', icon: Zap },
              ].map((stat, i) => (
                <div key={i} className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right column - Search card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative"
          >
            <div className="relative p-8 rounded-3xl bg-black/40 border border-white/5 shadow-2xl backdrop-blur-xl">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-tl-3xl" />
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-accent/20 to-transparent rounded-br-3xl" />

              <div className="relative">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary-light" />
                  Instant AI Search
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Try seamless search across platforms, categories, and more.
                </p>

                {/* Search input */}
                <form onSubmit={handleSearch} className="mt-6">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search prompts, e.g. 'YouTube video script'"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gradient-to-r from-primary to-accent opacity-0 group-focus-within:opacity-100 transition-opacity"
                    >
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </form>

                {/* Trending searches */}
                <div className="mt-6">
                  <p className="text-xs text-slate-500 mb-3">Trending searches</p>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => setSearchQuery(term)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400 hover:bg-white/10 hover:text-white hover:border-primary/30 transition-all duration-200"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick links */}
                <div className="mt-8 space-y-3">
                  {[
                    { label: 'ChatGPT Prompts', href: '/explore?platform=chatgpt', count: '12.5K' },
                    { label: 'Midjourney Prompts', href: '/explore?platform=midjourney', count: '8.2K' },
                    { label: 'Marketing Prompts', href: '/explore?category=marketing', count: '5.1K' },
                  ].map((link, i) => (
                    <Link
                      key={i}
                      href={link.href}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
                    >
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                        {link.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">{link.count}</span>
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating decorative elements */}
            <motion.div
              className="absolute -top-8 -right-8 w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 blur-xl"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-gradient-to-br from-accent/30 to-primary/20 blur-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
