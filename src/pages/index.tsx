import Head from 'next/head'
import Hero from '@/components/Hero'
import Categories, { FeaturedCategories } from '@/components/Categories'
import PromptGrid from '@/components/PromptGrid'
import { motion } from 'framer-motion'
import { Sparkles, Zap, TrendingUp, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>PromptVerse AI — Discover, Create & Share Powerful AI Prompts</title>
        <meta name="description" content="PromptVerse AI: The largest premium library of AI prompts for ChatGPT, Gemini, Claude, Midjourney and more. Search 100,000+ prompts." />
        <meta property="og:title" content="PromptVerse AI — The #1 AI Prompt Library" />
        <meta property="og:description" content="The largest collection of prompts for ChatGPT, Gemini, Claude, Midjourney, Flux, Veo, Sora, Runway and more." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PromptVerse AI — The #1 AI Prompt Library" />
        <meta name="twitter:description" content="The largest collection of prompts for ChatGPT, Gemini, Claude, Midjourney and more." />
      </Head>

      <main className="min-h-screen">
        <Hero />

        {/* Featured Categories Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <FeaturedCategories />
        </section>

        {/* Featured Prompts */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Featured Prompts</h2>
              <p className="text-slate-400 mt-1">Hand-picked by our team for exceptional quality</p>
            </div>
            <Link
              href="/explore?featured=true"
              className="hidden sm:flex items-center gap-1 text-sm text-primary-light hover:text-accent transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <PromptGrid featured limit={6} />
        </section>

        {/* All Prompts Grid with Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Browse by Category</h2>
              <p className="text-slate-400 mt-1">Explore prompts across different AI platforms and use cases</p>
            </div>
            <Link
              href="/explore/categories"
              className="hidden sm:flex items-center gap-1 text-sm text-primary-light hover:text-accent transition-colors"
            >
              All categories
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <Categories limit={12} />

          {/* Recent Prompts */}
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Latest Prompts</h2>
                <p className="text-slate-400 mt-1">Fresh prompts added by our community</p>
              </div>
              <Link
                href="/explore?sort=newest"
                className="hidden sm:flex items-center gap-1 text-sm text-primary-light hover:text-accent transition-colors"
              >
                Browse all
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <PromptGrid limit={6} />
          </div>
        </section>

        {/* AI Generator Feature */}
        <section className="relative overflow-hidden py-24">
          <div className="absolute inset-0 bg-mesh" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-white/10 mb-6">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-primary-light">AI-Powered</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  Generate & Improve Prompts with AI
                </h2>
                <p className="text-lg text-slate-300 mb-6">
                  Not sure how to craft the perfect prompt? Let our AI assistant help you create effective prompts for any use case.
                </p>
                <div className="space-y-4 mb-8">
                  {[
                    'Describe your goal and get a tailored prompt',
                    'Paste existing prompts to improve them',
                    'Choose tone, style, and complexity',
                    'Get instant suggestions and variations',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles className="w-3 h-3 text-primary-light" />
                      </div>
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/generator"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-accent font-semibold text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300"
                >
                  <Zap className="w-5 h-5" />
                  Try AI Generator
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 shadow-2xl">
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-sm text-slate-400 mb-2">Your goal</p>
                      <p className="text-white">Create a YouTube video script about AI productivity</p>
                    </div>
                    <div className="flex justify-center">
                      <div className="p-2 rounded-full bg-primary/20">
                        <Zap className="w-5 h-5 text-primary-light" />
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                      <p className="text-sm text-primary-light mb-2 font-medium">Generated Prompt</p>
                      <p className="text-white text-sm leading-relaxed">
                        "You are an expert YouTube content creator specializing in AI and productivity. Write a comprehensive script for a 10-minute video explaining..."
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary/20 blur-3xl" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { label: 'Total Prompts', value: '100,000+', icon: Sparkles },
              { label: 'Prompts Copied', value: '1M+', icon: TrendingUp },
              { label: 'Active Users', value: '500K+', icon: Users },
              { label: 'Categories', value: '50+', icon: Zap },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white/5 border border-white/5"
              >
                <stat.icon className="w-8 h-8 mx-auto text-primary-light mb-4" />
                <div className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold mb-6"
            >
              Ready to supercharge your AI prompts?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-300 mb-8"
            >
              Join thousands of creators, developers, and businesses using PromptVerse AI to unlock the full potential of AI.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                href="/auth/signup"
                className="px-8 py-4 rounded-2xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                href="/explore"
                className="px-8 py-4 rounded-2xl bg-white/10 border border-white/20 font-semibold hover:bg-white/20 transition-colors"
              >
                Browse Prompts
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  )
}
