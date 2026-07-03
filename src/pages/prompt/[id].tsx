import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Copy, Bookmark, Share2, Star, Eye, Clock, ChevronRight,
  Zap, Lock, Check, Flag, ThumbsUp, MessageSquare, Send, ArrowLeft
} from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Prompt, PromptComment, Profile } from '@/lib/database.types'
import { useAuth } from '@/contexts/AuthContext'

interface PromptWithDetails extends Prompt {
  categories?: { name: string; slug: string } | null
}

export default function PromptDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const { user, profile } = useAuth()

  const [prompt, setPrompt] = useState<PromptWithDetails | null>(null)
  const [comments, setComments] = useState<(PromptComment & { profiles: Pick<Profile, 'username' | 'avatar_url'> | null })[]>([])
  const [userRating, setUserRating] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [relatedPrompts, setRelatedPrompts] = useState<Prompt[]>([])

  const fetchPrompt = useCallback(async () => {
    if (!id) return

    setIsLoading(true)
    try {
      // Fetch prompt
      const { data: promptData, error } = await supabase
        .from('prompts')
        .select('*, categories(name, slug)')
        .eq('id', id)
        .maybeSingle()

      if (!error && promptData) {
        setPrompt(promptData as PromptWithDetails)

        // Increment view count
        await supabase
          .from('prompts')
          .update({ views_count: (promptData.views_count || 0) + 1 })
          .eq('id', id)

        // Fetch related prompts
        const { data: related } = await supabase
          .from('prompts')
          .select('*')
          .eq('platform', promptData.platform as string)
          .neq('id', id)
          .limit(4)

        if (related) setRelatedPrompts(related as Prompt[])

        // Fetch comments
        const { data: commentsData } = await supabase
          .from('prompt_comments')
          .select('*, profiles(username, avatar_url)')
          .eq('prompt_id', id)
          .order('created_at', { ascending: false })

        if (commentsData) setComments(commentsData as typeof comments)
      }
    } catch (err) {
      console.error('Error fetching prompt:', err)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchPrompt()
  }, [fetchPrompt])

  // Check if user has rated or favorited
  useEffect(() => {
    if (!user || !id) return

    async function checkUserActions() {
      const userId = user!.id
      const { data: rating } = await supabase
        .from('prompt_ratings')
        .select('rating')
        .eq('prompt_id', id)
        .eq('user_id', userId)
        .maybeSingle()

      if (rating) setUserRating(rating.rating)

      const { data: fav } = await supabase
        .from('prompt_favorites')
        .select('id')
        .eq('prompt_id', id)
        .eq('user_id', userId)
        .maybeSingle()

      if (fav) setIsFavorited(true)
    }

    checkUserActions()
  }, [user, id])

  const copyPrompt = async () => {
    if (!prompt) return

    try {
      await navigator.clipboard.writeText(prompt.prompt_text)
      setCopied(true)
      toast.success('Prompt copied to clipboard')

      await supabase
        .from('prompts')
        .update({ copies_count: prompt.copies_count + 1 })
        .eq('id', prompt.id)

      setPrompt({ ...prompt, copies_count: prompt.copies_count + 1 })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy prompt')
    }
  }

  const toggleFavorite = async () => {
    if (!prompt || !user) {
      toast.error('Sign in to save prompts')
      return
    }

    const userId = user!.id
    try {
      if (isFavorited) {
        await supabase
          .from('prompt_favorites')
          .delete()
          .match({ prompt_id: prompt.id, user_id: userId })

        await supabase
          .from('prompts')
          .update({ favorites_count: Math.max(0, prompt.favorites_count - 1) })
          .eq('id', prompt.id)

        setPrompt({ ...prompt, favorites_count: Math.max(0, prompt.favorites_count - 1) })
        setIsFavorited(false)
        toast.success('Removed from favorites')
      } else {
        await supabase
          .from('prompt_favorites')
          .insert({ prompt_id: prompt.id, user_id: userId })

        await supabase
          .from('prompts')
          .update({ favorites_count: prompt.favorites_count + 1 })
          .eq('id', prompt.id)

        setPrompt({ ...prompt, favorites_count: prompt.favorites_count + 1 })
        setIsFavorited(true)
        toast.success('Added to favorites')
      }
    } catch {
      toast.error('Failed to update favorite')
    }
  }

  const ratePrompt = async (rating: number) => {
    if (!prompt || !user) {
      toast.error('Sign in to rate prompts')
      return
    }

    try {
      await supabase
        .from('prompt_ratings')
        .upsert({ prompt_id: prompt.id, user_id: user!.id, rating }, { onConflict: 'prompt_id,user_id' })

      setUserRating(rating)
      toast.success('Rating submitted')
    } catch {
      toast.error('Failed to submit rating')
    }
  }

  const submitComment = async () => {
    if (!prompt || !user || !newComment.trim()) {
      return
    }

    try {
      const { data, error } = await supabase
        .from('prompt_comments')
        .insert({
          prompt_id: prompt.id,
          user_id: user!.id,
          content: newComment.trim()
        })
        .select('*, profiles(username, avatar_url)')
        .single()

      if (!error && data) {
        setComments([data, ...comments])
        setNewComment('')
        toast.success('Comment added')

        await supabase
          .from('prompts')
          .update({ comments_count: prompt.comments_count + 1 })
          .eq('id', prompt.id)
      }
    } catch {
      toast.error('Failed to add comment')
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Hard': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Prompt not found</h1>
          <Link href="/explore" className="text-primary-light hover:text-accent">
            Browse all prompts
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{prompt.title} | PromptVerse AI</title>
        <meta name="description" content={prompt.description} />
        <meta property="og:title" content={prompt.title} />
        <meta property="og:description" content={prompt.description} />
        <meta property="og:type" content="article" />
      </Head>

      <main className="min-h-screen pb-16">
        {/* Breadcrumb */}
        <div className="bg-black/30 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm text-slate-400">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/explore" className="hover:text-white transition-colors">Explore</Link>
              {prompt.categories && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <Link
                    href={`/explore?category=${prompt.categories.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {prompt.categories.name}
                  </Link>
                </>
              )}
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{prompt.title.slice(0, 30)}...</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      {prompt.is_premium && (
                        <span className="px-2 py-1 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-xs font-medium text-primary-light flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Premium
                        </span>
                      )}
                      {prompt.is_featured && (
                        <span className="px-2 py-1 rounded-lg bg-accent/20 border border-accent/30 text-xs font-medium text-accent-light">
                          Featured
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getDifficultyColor(prompt.difficulty)}`}>
                        {prompt.difficulty}
                      </span>
                    </div>
                    <h1 className="text-3xl font-bold">{prompt.title}</h1>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-white">{prompt.rating_avg?.toFixed(1) || '0.0'}</span>
                    <span>({prompt.rating_count})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{prompt.views_count.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Copy className="w-4 h-4" />
                    <span>{prompt.copies_count.toLocaleString()} copies</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bookmark className="w-4 h-4" />
                    <span>{prompt.favorites_count.toLocaleString()} favorites</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(prompt.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary-light text-sm">
                    {prompt.platform}
                  </span>
                  {prompt.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-xl bg-white/5 text-slate-400 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="prose prose-invert max-w-none"
              >
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-slate-300">{prompt.description}</p>
              </motion.div>

              {/* Prompt */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold mb-3">Prompt</h2>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                  <pre className="whitespace-pre-wrap text-slate-200 text-lg leading-relaxed font-mono">
                    {prompt.prompt_text}
                  </pre>
                </div>
              </motion.div>

              {/* Example Output */}
              {prompt.example_output && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-3">Example Output</h2>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent border border-accent/20">
                    <p className="text-slate-300">{prompt.example_output}</p>
                  </div>
                </motion.div>
              )}

              {/* Comments */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Comments ({comments.length})</h2>
                </div>

                {/* Add comment */}
                {user ? (
                  <div className="mb-6">
                    <div className="flex gap-3">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 resize-none"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={submitComment}
                        disabled={!newComment.trim()}
                        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-medium disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        Post Comment
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 text-center text-slate-400">
                    <Link href="/auth/signin" className="text-primary-light hover:text-accent">
                      Sign in
                    </Link>{' '}
                    to leave a comment
                  </div>
                )}

                {/* Comments list */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-accent/50" />
                          <span className="font-medium">{comment.profiles?.username || 'Anonymous'}</span>
                          <span className="text-xs text-slate-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-300">{comment.content}</p>
                    </div>
                  ))}

                  {comments.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No comments yet. Be the first to comment!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-24 space-y-4"
              >
                {/* Copy button */}
                <button
                  onClick={copyPrompt}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy Prompt
                    </>
                  )}
                </button>

                {/* Other actions */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={toggleFavorite}
                    className={`p-3 rounded-xl border transition-all ${
                      isFavorited
                        ? 'bg-primary/20 border-primary/30 text-primary-light'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 mx-auto ${isFavorited ? 'fill-current' : ''}`} />
                    <span className="text-xs mt-1 block">Save</span>
                  </button>
                  <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                    <Share2 className="w-5 h-5 mx-auto" />
                    <span className="text-xs mt-1 block">Share</span>
                  </button>
                  <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
                    <Flag className="w-5 h-5 mx-auto" />
                    <span className="text-xs mt-1 block">Report</span>
                  </button>
                </div>

                {/* Rating */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-slate-400 mb-3">Rate this prompt</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => ratePrompt(star)}
                        className={`p-2 rounded-lg transition-all ${
                          userRating >= star
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-yellow-400'
                        }`}
                      >
                        <Star className={`w-6 h-6 ${userRating >= star ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Author */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                  <p className="text-sm text-slate-400 mb-3">Created by</p>
                  <Link
                    href={`/user/${prompt.author_id || 'unknown'}`}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-lg font-medium">{prompt.author_name?.charAt(0)?.toUpperCase() || '?'}</span>
                    </div>
                    <div>
                      <p className="font-medium">{prompt.author_name}</p>
                      <p className="text-xs text-slate-500">{prompt.views_count} prompts</p>
                    </div>
                  </Link>
                </div>

                {/* Related prompts */}
                {relatedPrompts.length > 0 && (
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                    <h3 className="text-sm font-semibold mb-4">Related Prompts</h3>
                    <div className="space-y-3">
                      {relatedPrompts.slice(0, 4).map((p) => (
                        <Link
                          key={p.id}
                          href={`/prompt/${p.id}`}
                          className="block p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <p className="text-sm font-medium truncate">{p.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{p.platform}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </aside>
          </div>
        </div>
      </main>
    </>
  )
}
