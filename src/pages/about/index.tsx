import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Users, Zap, Globe, Heart, ArrowRight } from 'lucide-react'

const team = [
  { name: 'Sarah Chen', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
  { name: 'Marcus Johnson', role: 'CTO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
  { name: 'Emily Rodriguez', role: 'Head of Product', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400' },
  { name: 'David Kim', role: 'Lead Developer', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
]

const stats = [
  { label: 'Prompts', value: '100,000+' },
  { label: 'Users', value: '500,000+' },
  { label: 'Countries', value: '120+' },
  { label: 'Copies Made', value: '1M+' },
]

const values = [
  {
    icon: Sparkles,
    title: 'Innovation',
    description: 'We constantly push the boundaries of what AI can do for prompt engineering.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We believe in the power of shared knowledge and collaborative growth.',
  },
  {
    icon: Globe,
    title: 'Accessibility',
    description: 'Making AI tools accessible to everyone, regardless of technical background.',
  },
  {
    icon: Heart,
    title: 'Quality',
    description: 'Every prompt on our platform goes through quality checks to ensure value.',
  },
]

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us | PromptVerse AI</title>
        <meta name="description" content="Learn about PromptVerse AI's mission to democratize AI prompt engineering" />
      </Head>

      <main className="min-h-screen pb-16">
        {/* Hero */}
        <section className="pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                Empowering everyone to unlock the full potential of AI
              </h1>
              <p className="text-lg text-slate-400">
                PromptVerse AI was founded with a simple mission: make AI accessible to everyone through better prompts. We believe that the right prompt can transform an ordinary AI interaction into something extraordinary.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-white/5 border border-white/5"
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    PromptVerse AI started in 2024 when our founder, Sarah Chen, noticed a problem: while AI tools like ChatGPT and Midjourney were becoming incredibly powerful, most people weren't getting the best results from them.
                  </p>
                  <p>
                    The issue wasn't the technology — it was the prompts. A well-crafted prompt could mean the difference between a mediocre response and an exceptional one.
                  </p>
                  <p>
                    Today, PromptVerse AI hosts over 100,000 prompts created by our community of AI enthusiasts, marketers, developers, and creators. We've helped millions of people get better results from AI tools.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca8849a6?w=800"
                    alt="Team collaboration"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-slate-400">The principles that guide everything we do</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/5"
                >
                  <value.icon className="w-8 h-8 text-primary-light mb-4" />
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-slate-400">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-slate-400">The people behind PromptVerse AI</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-white/10 mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-slate-500">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Join our mission</h2>
            <p className="text-slate-400 mb-8">
              Whether you're an AI expert or just getting started, there's a place for you in our community.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                Explore Prompts
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-xl bg-white/10 border border-white/10 font-medium hover:bg-white/20 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
