'use client'

import React, { useState, useCallback, useEffect, ChangeEvent } from 'react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, X, Filter, ChevronDown, Sparkles, Clock, TrendingUp
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Prompt } from '@/lib/database.types'

interface SearchBarProps {
  isExpanded?: boolean
  autoFocus?: boolean
  onSearch?: (query: string) => void
  showFilters?: boolean
  className?: string
}

const platforms = ['ChatGPT', 'Gemini', 'Claude', 'Midjourney', 'DeepSeek', 'Flux', 'Stable Diffusion', 'DALL·E', 'Runway', 'Veo', 'Sora', 'Grok']
const difficulties = ['Easy', 'Medium', 'Hard']
const sortOptions = ['Relevance', 'Newest', 'Most Popular', 'Highest Rated', 'Most Copied']

export default function SearchBar({
  isExpanded = true,
  autoFocus = false,
  onSearch,
  showFilters = false,
  className = ''
}: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(router.query.q as string || '')
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false)
  const [suggestions, setSuggestions] = useState<Prompt[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'YouTube script', 'Marketing email', 'Blog outline', 'Product description'
  ])
  const [isLoading, setIsLoading] = useState(false)

  const [filters, setFilters] = useState({
    platform: router.query.platform as string || '',
    difficulty: router.query.difficulty as string || '',
    sort: router.query.sort as string || 'Relevance',
  })

  useEffect(() => {
    if (router.query.q) {
      setQuery(router.query.q as string)
    }
    if (router.query.platform) {
      setFilters(prev => ({ ...prev, platform: router.query.platform as string }))
    }
  }, [router.query])

  // Debounced search for suggestions
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      const { data } = await supabase
        .from('prompts')
        .select('id, title, platform, difficulty')
        .or(`title.ilike.%${searchQuery}%,prompt_text.ilike.%${searchQuery}%`)
        .limit(5)

      if (data) {
        setSuggestions(data as Prompt[])
      }
    } catch {
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (showSuggestions) {
        fetchSuggestions(query)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, showSuggestions, fetchSuggestions])

  const handleSearch = () => {
    if (!query.trim()) return

    const params = new URLSearchParams()
    params.set('q', query.trim())
    if (filters.platform) params.set('platform', filters.platform)
    if (filters.difficulty) params.set('difficulty', filters.difficulty)
    if (filters.sort !== 'Relevance') params.set('sort', filters.sort)

    if (onSearch) {
      onSearch(query)
    } else {
      router.push(`/explore?${params.toString()}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
      setShowSuggestions(false)
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setShowSuggestions(true)
  }

  const handleSuggestionClick = (suggestion: Prompt) => {
    router.push(`/prompt/${suggestion.id}`)
    setShowSuggestions(false)
  }

  const clearFilters = () => {
    setFilters({ platform: '', difficulty: '', sort: 'Relevance' })
    const params = new URLSearchParams(router.query as Record<string, string>)
    params.delete('platform')
    params.delete('difficulty')
    params.delete('sort')
    router.push({ pathname: router.pathname, query: Object.fromEntries(params) })
  }

  const hasActiveFilters = filters.platform || filters.difficulty

  return (
    <div className={`relative ${className}`}>
      {/* Main search bar */}
      <div className="relative">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onBlurCapture={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search prompts, e.g. 'YouTube video script', 'Marketing email'..."
            autoFocus={autoFocus}
            className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-300 ${
              isExpanded ? '' : 'py-3'
            }`}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-14 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-accent font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Search
          </button>
        </div>
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && query.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Suggestions header */}
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Suggestions</span>
              {isLoading && (
                <span className="text-xs text-slate-500">Searching...</span>
              )}
            </div>

            {/* Suggestions list */}
            <div className="divide-y divide-white/5">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                  >
                    <Sparkles className="w-4 h-4 text-primary-light flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{suggestion.title}</p>
                      <p className="text-xs text-slate-500">{suggestion.platform} · {suggestion.difficulty}</p>
                    </div>
                  </button>
                ))
              ) : (
                !isLoading && (
                  <div className="px-4 py-6 text-center text-sm text-slate-500">
                    No suggestions found. Press Enter to search.
                  </div>
                )
              )}
            </div>

            {/* Recent searches */}
            {recentSearches.length > 0 && !query && (
              <div className="border-t border-white/5">
                <div className="px-4 py-2 text-xs text-slate-500 flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  Recent searches
                </div>
                {recentSearches.map((search, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(search)}
                    className="w-full px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 text-left transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            )}

            {/* Trending */}
            <div className="p-4 bg-white/5 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-xs text-slate-400">
                Tip: Use filters to narrow down results
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex flex-wrap items-center gap-3"
        >
          <button
            onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filters</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFiltersDropdown ? 'rotate-180' : ''}`} />
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear filters
            </button>
          )}

          {/* Active filter tags */}
          {filters.platform && (
            <span className="px-3 py-1 rounded-lg bg-primary/20 text-primary-light text-sm">
              {filters.platform}
            </span>
          )}
          {filters.difficulty && (
            <span className="px-3 py-1 rounded-lg bg-accent/20 text-accent-light text-sm">
              {filters.difficulty}
            </span>
          )}

          {/* Filters dropdown */}
          <AnimatePresence>
            {showFiltersDropdown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-full left-0 mt-2 p-6 z-50 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-80"
              >
                {/* Platform filter */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Platform</label>
                  <div className="flex flex-wrap gap-2">
                    {platforms.map((platform) => (
                      <button
                        key={platform}
                        onClick={() => setFilters(prev => ({
                          ...prev,
                          platform: prev.platform === platform ? '' : platform
                        }))}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          filters.platform === platform
                            ? 'bg-primary text-white'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty filter */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Difficulty</label>
                  <div className="flex gap-2">
                    {difficulties.map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setFilters(prev => ({
                          ...prev,
                          difficulty: prev.difficulty === diff ? '' : diff
                        }))}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          filters.difficulty === diff
                            ? 'bg-accent text-white'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Sort by</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    handleSearch()
                    setShowFiltersDropdown(false)
                  }}
                  className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-primary to-accent font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  Apply Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
