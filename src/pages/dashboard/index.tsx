import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import {
  Copy, Bookmark, Star, TrendingUp, Clock, ChevronRight,
  LayoutDashboard, FolderPlus, Settings, LogOut, Plus, Eye
} from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface FavoritePrompt {
  id: string
  title: string
  platform: string
  rating_avg: number
  prompt_text: string
  prompt_favorites: { created_at: string }[]
}

interface DashboardStats {
  totalFavorites: number
  totalCollections: number
  totalPromptsCreated: number
  totalViews: number
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, profile, signOut, loading } = useAuth()
  const [recentFavorites, setRecentFavorites] = useState<FavoritePrompt[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalFavorites: 0,
    totalCollections: 0,
    totalPromptsCreated: 0,
    totalViews: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !user) return

    async function fetchDashboardData() {
      setIsLoading(true)
      try {
        const userId = user!.id

        // Fetch favorites with prompts
        const { data: favorites } = await supabase
          .from('prompt_favorites')
          .select('created_at, prompts(id, title, platform, rating_avg, prompt_text)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(6)

        if (favorites) {
          const formatted = favorites
            .filter((f: any) => f.prompts)
            .map((f: any) => ({
              ...f.prompts,
              prompt_favorites: [{ created_at: f.created_at }],
            }))
          setRecentFavorites(formatted)
        }

        // Fetch collections
        const { data: colls } = await supabase
          .from('collections')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false })
          .limit(6)

        if (colls) setCollections(colls)

        // Fetch stats
        const { count: favCount } = await supabase
          .from('prompt_favorites')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)

        const { count: collCount } = await supabase
          .from('collections')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)

        const { count: promptCount } = await supabase
          .from('prompts')
          .select('*', { count: 'exact', head: true })
          .eq('author_id', userId)

        setStats({
          totalFavorites: favCount || 0,
          totalCollections: collCount || 0,
          totalPromptsCreated: promptCount || 0,
          totalViews: 0,
        })
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [user, mounted])

  const copyPrompt = async (prompt: FavoritePrompt) => {
    try {
      await navigator.clipboard.writeText(prompt.prompt_text)
      toast.success('Prompt copied to clipboard')
    } catch {
      toast.error('Failed to copy prompt')
    }
  }

  // Redirect to signin if not authenticated (client-side only)
  useEffect(() => {
    if (!mounted) return
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router, mounted])

  // Show loading during SSR or while checking auth
  if (!mounted || loading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Dashboard | PromptVerse AI</title>
      </Head>

      <main className="min-h-screen pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
                {/* Profile card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-lg font-medium">{profile.username?.charAt(0)?.toUpperCase() || 'U'}</span>
                    </div>
                    <div>
                      <p className="font-medium">{profile.username}</p>
                      <p className="text-xs text-slate-500">{profile.email}</p>
                    </div>
                  </div>
                  {profile.is_premium && (
                    <span className="inline-block px-3 py-1 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 text-xs text-primary-light">
                      Pro Member
                    </span>
                  )}
                </div>

                {/* Nav */}
                <nav className="space-y-2">
                  {[
                    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                    { href: '/dashboard/collections', icon: Bookmark, label: 'Collections' },
                    { href: '/dashboard/prompts', icon: Copy, label: 'My Prompts' },
                    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        router.pathname === item.href
                          ? 'bg-primary/20 text-primary-light'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </nav>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
                <p className="text-slate-400 mb-8">Welcome back, {profile.username}</p>
              </motion.div>

              {/* Stats cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Favorites', value: stats.totalFavorites, icon: Bookmark, color: 'text-pink-400' },
                  { label: 'Collections', value: stats.totalCollections, icon: FolderPlus, color: 'text-blue-400' },
                  { label: 'Prompts Created', value: stats.totalPromptsCreated, icon: Copy, color: 'text-green-400' },
                  { label: 'Views', value: stats.totalViews, icon: Eye, color: 'text-yellow-400' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/5"
                  >
                    <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Link
                  href="/generator"
                  className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 hover:border-primary/40 transition-all"
                >
                  <div className="p-3 rounded-xl bg-primary/20">
                    <Plus className="w-6 h-6 text-primary-light" />
                  </div>
                  <div>
                    <p className="font-medium">Create Prompt</p>
                    <p className="text-sm text-slate-400">Use our AI generator</p>
                  </div>
                </Link>
                <Link
                  href="/explore"
                  className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="p-3 rounded-xl bg-white/10">
                    <TrendingUp className="w-6 h-6 text-slate-300" />
                  </div>
                  <div>
                    <p className="font-medium">Browse Prompts</p>
                    <p className="text-sm text-slate-400">Explore our library</p>
                  </div>
                </Link>
              </div>

              {/* Favorites */}
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Your Favorites</h2>
                  <Link

                    href="/dashboard/favorites"
                    className="text-sm text-primary-light hover:text-accent flex items-center gap-1"
                  >
                    View all <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="p-4 rounded-xl bg-white/5">
                          <div className="h-4 bg-slate-800 rounded w-3/4 mb-2" />
                          <div className="h-3 bg-slate-800 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentFavorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentFavorites.map((prompt) => (
                      <motion.div
                        key={prompt.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <Link href={`/prompt/${prompt.id}`} className="font-medium hover:text-primary-light transition-colors">
                            {prompt.title}
                          </Link>
                          <button
                            onClick={() => copyPrompt(prompt)}
                            className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>{prompt.platform}</span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            {prompt.rating_avg?.toFixed(1) || '0.0'}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 rounded-2xl bg-white/5 border border-white/5">
                    <Bookmark className="w-8 h-8 mx-auto text-slate-600 mb-3" />
                    <p className="text-slate-400">No favorites yet</p>
                    <Link href="/explore" className="text-sm text-primary-light hover:text-accent mt-2 inline-block">
                      Browse prompts
                    </Link>
                  </div>
                )}
              </section>

              {/* Collections */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Your Collections</h2>
                  <Link
                    href="/dashboard/collections/new"
                    className="text-sm text-primary-light hover:text-accent flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> New collection
                  </Link>
                </div>

                {collections.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {collections.map((coll) => (
                      <Link
                        key={coll.id}
                        href={`/dashboard/collections/${coll.id}`}
                        className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-primary/20">
                            <Bookmark className="w-4 h-4 text-primary-light" />
                          </div>
                          <div>
                            <p className="font-medium">{coll.name}</p>
                            <p className="text-xs text-slate-500">
                              {coll.prompts_count} prompts
                            </p>
                          </div>
                        </div>
                        {coll.description && (
                          <p className="text-sm text-slate-400 line-clamp-2">
                            {coll.description}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 rounded-2xl bg-white/5 border border-white/5">
                    <FolderPlus className="w-8 h-8 mx-auto text-slate-600 mb-3" />
                    <p className="text-slate-400">Create collections to organize your prompts</p>
                    <Link
                      href="/dashboard/collections/new"
                      className="inline-flex items-center gap-1 text-sm text-primary-light hover:text-accent mt-2"
                    >
                      <Plus className="w-4 h-4" /> Create collection
                    </Link>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
