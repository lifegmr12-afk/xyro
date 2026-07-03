import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import SearchBar from '@/components/SearchBar'
import PromptGrid from '@/components/PromptGrid'
import Categories from '@/components/Categories'
import { supabase } from '@/lib/supabase'
import { PromptWithCategory, Category } from '@/lib/database.types'

export default function ExplorePage() {
  const router = useRouter()
  const { q, category, platform, difficulty, sort } = router.query

  const [categories, setCategories] = useState<Category[]>([])
  const [prompts, setPrompts] = useState<PromptWithCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(0)
  const pageSize = 24

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })

    if (data) setCategories(data as Category[])
  }, [])

  const fetchPrompts = useCallback(async () => {
    setIsLoading(true)
    try {
      let query = supabase
        .from('prompts')
        .select('*, categories(*)', { count: 'exact' })
        .eq('is_published', true)
        .range(page * pageSize, (page + 1) * pageSize - 1)

      if (q && typeof q === 'string') {
        query = query.or(`title.ilike.%${q}%,prompt_text.ilike.%${q}%`)
      }
      if (category && typeof category === 'string') {
        query = query.eq('categories.slug', category)
      }
      if (platform && typeof platform === 'string') {
        query = query.ilike('platform', platform)
      }
      if (difficulty && typeof difficulty === 'string') {
        query = query.eq('difficulty', difficulty)
      }

      if (sort === 'newest') {
        query = query.order('created_at', { ascending: false })
      } else if (sort === 'rating') {
        query = query.order('rating_avg', { ascending: false })
      } else if (sort === 'popular') {
        query = query.order('views_count', { ascending: false })
      } else if (sort === 'copied') {
        query = query.order('copies_count', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error, count } = await query

      if (!error && data) {
        setPrompts(data as PromptWithCategory[])
        setTotalCount(count || 0)
      }
    } catch (err) {
      console.error('Error fetching prompts:', err)
    } finally {
      setIsLoading(false)
    }
  }, [q, category, platform, difficulty, sort, page])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchPrompts()
  }, [fetchPrompts])

  const selectedCategory = categories.find(c => c.slug === category)

  return (
    <>
      <Head>
        <title>
          {q
            ? `Search results for "${q}" | PromptVerse AI`
            : selectedCategory
            ? `${selectedCategory.name} Prompts | PromptVerse AI`
            : 'Explore AI Prompts | PromptVerse AI'}
        </title>
        <meta
          name="description"
          content={q
            ? `Search results for "${q}" - Browse thousands of AI prompts on PromptVerse`
            : selectedCategory
            ? `Discover the best ${selectedCategory.name} prompts for AI platforms`
            : 'Explore the largest collection of AI prompts for ChatGPT, Gemini, Claude and more'}
        />
      </Head>

      <main className="min-h-screen pb-16">
        {/* Header */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                {q
                  ? `Search results for "${q}"`
                  : selectedCategory
                  ? `${selectedCategory.name} Prompts`
                  : 'Explore AI Prompts'}
              </h1>
              <p className="text-slate-400 mb-8">
                {totalCount > 0 ? `${totalCount.toLocaleString()} prompts found` : 'Explore our collection'}
              </p>
              <SearchBar showFilters className="max-w-3xl" />
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-slate-400">Categories</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => router.push('/explore')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        !category
                          ? 'bg-primary/20 text-primary-light'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      All Prompts
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => router.push(`/explore?category=${cat.slug}`)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          category === cat.slug
                            ? 'bg-primary/20 text-primary-light'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {cat.name}
                        <span className="text-xs ml-1 text-slate-600">
                          ({cat.prompt_count || 0})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-slate-400">Sort By</h3>
                  <div className="space-y-1">
                    {[
                      { value: 'newest', label: 'Newest' },
                      { value: 'popular', label: 'Most Popular' },
                      { value: 'rating', label: 'Highest Rated' },
                      { value: 'copied', label: 'Most Copied' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => router.push({ query: { ...router.query, sort: opt.value } })}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          sort === opt.value
                            ? 'bg-accent/20 text-accent-light'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1">
              {/* Active filters */}
              {(platform || difficulty) && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-sm text-slate-500">Active filters:</span>
                  {platform && (
                    <span className="px-3 py-1 rounded-lg bg-primary/20 text-primary-light text-sm flex items-center gap-2">
                      {platform}
                      <button onClick={() => {
                        const query = { ...router.query }
                        delete query.platform
                        router.push({ query })
                      }} className="hover:text-white">×</button>
                    </span>
                  )}
                  {difficulty && (
                    <span className="px-3 py-1 rounded-lg bg-accent/20 text-accent-light text-sm flex items-center gap-2">
                      {difficulty}
                      <button onClick={() => {
                        const query = { ...router.query }
                        delete query.difficulty
                        router.push({ query })
                      }} className="hover:text-white">×</button>
                    </span>
                  )}
                  <button
                    onClick={() => router.push('/explore')}
                    className="text-sm text-slate-400 hover:text-white"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Results */}
              <PromptGrid limit={pageSize} category={category as string} platform={platform as string} />

              {/* Pagination placeholder */}
              {totalCount > pageSize && (
                <div className="mt-12 flex justify-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-slate-400">
                    Page {page + 1} of {Math.ceil(totalCount / pageSize)}
                  </span>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={(page + 1) * pageSize >= totalCount}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
