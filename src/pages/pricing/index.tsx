import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Sparkles, Zap, Building2, Crown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    icon: Sparkles,
    features: [
      'Browse all prompts',
      'Copy unlimited prompts',
      'Save 10 favorites',
      'Basic search',
      'Community access',
    ],
    notIncluded: [
      'AI Prompt Generator',
      'Create collections',
      'Priority support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: 12,
    description: 'For power users and creators',
    icon: Crown,
    features: [
      'Everything in Free',
      'Unlimited favorites',
      'Unlimited collections',
      'AI Prompt Generator',
      'AI Prompt Improver',
      'Advanced search & filters',
      'Export prompts',
      'Priority support',
      'Early access to features',
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 49,
    description: 'For teams and organizations',
    icon: Building2,
    features: [
      'Everything in Pro',
      'Up to 50 team members',
      'Team collaboration',
      'Private prompt library',
      'API access',
      'SSO integration',
      'Admin dashboard',
      'Custom categories',
      'Dedicated support',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

export default function PricingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const handleSelectPlan = (plan: typeof plans[0]) => {
    if (!user) {
      router.push('/auth/signup')
    } else if (plan.name === 'Enterprise') {
      router.push('/contact')
    } else {
      router.push(`/checkout?plan=${plan.name.toLowerCase()}`)
    }
  }

  return (
    <>
      <Head>
        <title>Pricing | PromptVerse AI</title>
        <meta name="description" content="Choose the plan that fits your needs" />
      </Head>

      <main className="min-h-screen pb-16">
        {/* Hero */}
        <section className="pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                Simple, transparent pricing
              </h1>
              <p className="text-slate-400 max-w-2xl mx-auto mb-8">
                Unlock the full potential of AI prompts with our Pro plan. No hidden fees, cancel anytime.
              </p>

              {/* Billing toggle */}
              <div className="inline-flex items-center gap-4 p-1 rounded-xl bg-white/5 border border-white/10">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                    billingPeriod === 'monthly'
                      ? 'bg-primary text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                    billingPeriod === 'yearly'
                      ? 'bg-primary text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Yearly
                  <span className="ml-2 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                    Save 20%
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Plans */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-8 rounded-2xl border ${
                  plan.popular
                    ? 'bg-gradient-to-br from-primary/10 to-accent/5 border-primary/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-xs font-medium text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 rounded-xl ${
                    plan.popular ? 'bg-primary/20' : 'bg-white/10'
                  }`}>
                    <plan.icon className={`w-6 h-6 ${
                      plan.popular ? 'text-primary-light' : 'text-slate-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{plan.name}</h3>
                    <p className="text-xs text-slate-500">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    ${billingPeriod === 'yearly' ? plan.price * 0.8 : plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-slate-400">/month</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded?.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="w-5 h-5 flex-shrink-0 opacity-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3 rounded-xl font-medium transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:shadow-primary/25'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {[
              { q: 'Can I cancel my subscription anytime?', a: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.' },
              { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal.' },
              { q: 'Is there a free trial?', a: 'Yes! Pro plan includes a 7-day free trial. No credit card required to start.' },
              { q: 'Can I upgrade or downgrade my plan?', a: 'Yes, you can change your plan at any time. Billing adjustments will be prorated.' },
              { q: 'Do you offer refunds?', a: 'We offer a 30-day money-back guarantee. Contact our support team for assistance.' },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <h4 className="font-medium mb-2">{faq.q}</h4>
                <p className="text-sm text-slate-400">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 text-center">
            <Zap className="w-10 h-10 mx-auto mb-4 text-accent" />
            <h2 className="text-2xl font-bold mb-2">Ready to get started?</h2>
            <p className="text-slate-400 mb-6">
              Join thousands of users already using PromptVerse AI to supercharge their workflows.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/explore"
                className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 font-medium hover:bg-white/20 transition-all"
              >
                Browse Prompts
              </Link>
              <Link
                href="/auth/signup"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent font-medium text-white hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
