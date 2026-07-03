import Head from 'next/head'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Zap, ArrowRight, Copy, RefreshCw, Wand2,
  Send, Trash2, Save, Check, ChevronDown
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

const goals = [
  'Brainstorm ideas', 'Write content', 'Create product description', 'Generate code',
  'Marketing copy', 'Email template', 'Blog article', 'Social media post',
  'Video script', 'Ad copy', 'SEO content', 'Customer support response',
]

const tones = ['Professional', 'Casual', 'Friendly', 'Formal', 'Exciting', 'Persuasive', 'Educational', 'Urgent']

const platforms = [
  'ChatGPT', 'Gemini', 'Claude', 'Midjourney', 'DALL·E', 'Stable Diffusion',
  'Runway', 'Sora', 'Veo', 'DeepSeek', 'Grok', 'Copilot',
]

const lengths = ['Short', 'Medium', 'Long', 'Detailed']

export default function GeneratorPage() {
  const { user } = useAuth()
  const [mode, setMode] = useState<'generate' | 'improve'>('generate')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState('')

  const [formData, setFormData] = useState({
    goal: '',
    platform: 'ChatGPT',
    tone: 'Professional',
    length: 'Medium',
    audience: '',
    requirements: '',
    existingPrompt: '',
  })

  const handleGenerate = async () => {
    setIsLoading(true)
    setGeneratedPrompt('')

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      let prompt = ''

      if (mode === 'generate') {
        prompt = generatePromptWithForm(formData)
      } else {
        prompt = improvePrompt(formData.existingPrompt)
      }

      setGeneratedPrompt(prompt)
    } catch (error) {
      toast.error('Failed to generate prompt')
    } finally {
      setIsLoading(false)
    }
  }

  const generatePromptWithForm = (data: typeof formData) => {
    const { goal, platform, tone, length, audience, requirements } = data

    const templates = [
      `You are an expert ${platform} assistant specializing in ${goal}.`,
      `Your task is to ${goal.toLowerCase()} with a ${tone.toLowerCase()} tone.`,
      audience ? `Target audience: ${audience}.` : '',
      `Length: ${length.toLowerCase()} response required.`,
      requirements ? `Additional requirements: ${requirements}` : '',
    ].filter(Boolean)

    const examples = {
      'Brainstorm ideas': 'Provide at least 10 creative ideas, each with a brief description.',
      'Write content': 'Include an engaging hook, body content with clear structure, and a strong conclusion.',
      'Create product description': 'Highlight key features, benefits, and include a call-to-action.',
      'Generate code': 'Write clean, well-commented code with error handling.',
      'Marketing copy': 'Use persuasive language, highlight unique selling points, create urgency.',
      'Email template': 'Include subject line, greeting, body, and professional sign-off.',
      'Blog article': 'Structure with introduction, subheadings, conclusion, and SEO optimization.',
      'Social media post': 'Create engaging content with relevant hashtags and clear message.',
      'Video script': 'Include hook, main content segments, and call-to-action.',
      'Ad copy': 'Focus on benefits, create urgency, include clear call-to-action.',
      'SEO content': 'Naturally incorporate keywords, use proper heading structure.',
      'Customer support response': 'Be empathetic, provide clear solution, offer additional help.',
    }

    const example = examples[goal as keyof typeof examples] || 'Provide detailed, actionable output.'

    return `${templates.join('\n')}\n\n${example}\n\nOutput format: Structure your response clearly with sections.` +
           "\n\nIf you need more context, ask clarifying questions before starting."
  }

  const improvePrompt = (existingPrompt: string) => {
    if (!existingPrompt.trim()) {
      return ''
    }

    return `You are an expert prompt engineer. The following prompt has been poorly written. Please rewrite it to be more effective:

Original Prompt:
"${existingPrompt}"

Improve this prompt by:
1. Adding clear context and role definition
2. Specifying the exact output format
3. Including relevant constraints
4. Providing concrete examples when appropriate
5. Structuring the prompt logically

Improved Prompt:
[Your improved version here]`
  }

  const copyPrompt = async () => {
    if (!generatedPrompt) return
    try {
      await navigator.clipboard.writeText(generatedPrompt)
      setCopied(true)
      toast.success('Prompt copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <>
      <Head>
        <title>AI Prompt Generator | PromptVerse AI</title>
        <meta name="description" content="Generate and improve AI prompts with our intelligent assistant" />
      </Head>

      <main className="min-h-screen pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-white/10 mb-6">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-primary-light">AI-Powered</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">AI Prompt Generator</h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Create perfect prompts for any AI platform. Just describe what you need and let our assistant do the rest.
            </p>
          </motion.div>

          {/* Mode selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10">
              <button
                onClick={() => setMode('generate')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  mode === 'generate'
                    ? 'bg-gradient-to-r from-primary to-accent text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4 inline mr-2" />
                Generate New
              </button>
              <button
                onClick={() => setMode('improve')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  mode === 'improve'
                    ? 'bg-gradient-to-r from-primary to-accent text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Wand2 className="w-4 h-4 inline mr-2" />
                Improve Existing
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input side */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {mode === 'generate' ? (
                <>
                  {/* Goal */}
                  <div>
                    <label className="block text-sm font-medium mb-2">What do you want to accomplish?</label>
                    <select
                      value={formData.goal}
                      onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                      className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50"
                    >
                      <option value="">Select a goal...</option>
                      {goals.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  {/* Platform */}
                  <div>
                    <label className="block text-sm font-medium mb-2">AI Platform</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {platforms.slice(0, 8).map((p) => (
                        <button
                          key={p}
                          onClick={() => setFormData(prev => ({ ...prev, platform: p }))}
                          className={`p-3 rounded-xl text-sm font-medium transition-all ${
                            formData.platform === p
                              ? 'bg-primary/20 border-primary/30 text-primary-light border'
                              : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tone */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Tone</label>
                    <div className="flex flex-wrap gap-2">
                      {tones.map((t) => (
                        <button
                          key={t}
                          onClick={() => setFormData(prev => ({ ...prev, tone: t }))}
                          className={`px-4 py-2 rounded-lg text-sm transition-all ${
                            formData.tone === t
                              ? 'bg-accent/20 border-accent/30 text-accent-light border'
                              : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Length */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Response Length</label>
                    <div className="flex gap-2">
                      {lengths.map((l) => (
                        <button
                          key={l}
                          onClick={() => setFormData(prev => ({ ...prev, length: l }))}
                          className={`flex-1 p-3 rounded-xl text-sm font-medium transition-all ${
                            formData.length === l
                              ? 'bg-primary/20 border-primary/30 text-primary-light border'
                              : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Audience */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Audience (optional)</label>
                    <input
                      type="text"
                      value={formData.audience}
                      onChange={(e) => setFormData(prev => ({ ...prev, audience: e.target.value }))}
                      placeholder="e.g., software developers, marketing professionals"
                      className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
                    />
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Additional Requirements (optional)</label>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                      placeholder="Any specific requirements or constraints..."
                      className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 resize-none"
                      rows={3}
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2">Paste your existing prompt</label>
                  <textarea
                    value={formData.existingPrompt}
                    onChange={(e) => setFormData(prev => ({ ...prev, existingPrompt: e.target.value }))}
                    placeholder="Paste the prompt you want to improve..."
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 resize-none"
                    rows={12}
                  />
                </div>
              )}

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={isLoading || (mode === 'improve' && !formData.existingPrompt.trim())}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 transition-all"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Prompt
                  </>
                )}
              </button>
            </motion.div>

            {/* Output side */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:pl-8"
            >
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Generated Prompt</h3>
                  {generatedPrompt && (
                    <div className="flex gap-2">
                      <button
                        onClick={copyPrompt}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-all"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-green-400" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-white/5"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <RefreshCw className="w-6 h-6 text-primary-light animate-spin" />
                        <span className="text-slate-400">Generating your prompt...</span>
                      </div>
                    </motion.div>
                  ) : generatedPrompt ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 shadow-glass"
                    >
                      <pre className="whitespace-pre-wrap text-slate-200 leading-relaxed font-mono text-sm">
                        {generatedPrompt}
                      </pre>

                      {/* Actions */}
                      <div className="mt-6 pt-6 border-t border-white/10 flex gap-3">
                        <button
                          onClick={handleGenerate}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Regenerate
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary/20 border border-primary/30 text-primary-light hover:bg-primary/30 transition-all">
                          <Save className="w-4 h-4" />
                          Save to Favorites
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-8 rounded-2xl bg-white/5 border border-white/5 text-center"
                    >
                      <Sparkles className="w-8 h-8 mx-auto mb-4 text-slate-600" />
                      <p className="text-slate-400 mb-2">Your generated prompt will appear here</p>
                      <p className="text-sm text-slate-500">
                        Fill in the form and click "Generate Prompt" to create your prompt
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  )
}
