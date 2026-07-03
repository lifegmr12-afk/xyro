import Head from 'next/head'
import Hero from '../components/Hero'
import SearchBar from '../components/SearchBar'
import PromptGrid from '../components/PromptGrid'
import Categories from '../components/Categories'

export default function Home() {
  return (
    <>
      <Head>
        <title>PromptVerse AI — Discover, Create & Share Powerful AI Prompts</title>
        <meta name="description" content="PromptVerse AI: The largest premium library of AI prompts for ChatGPT, Gemini, Midjourney and more. Search 100,000+ prompts." />
        <meta name="og:title" content="PromptVerse AI" />
      </Head>

      <main className="min-h-screen bg-[#050505] text-gray-100">
        <Hero />

        <section className="max-w-[1200px] mx-auto px-6 -mt-16">
          <SearchBar />
          <Categories />
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Featured Prompts</h2>
            <PromptGrid />
          </section>
        </section>
      </main>
    </>
  )
}
