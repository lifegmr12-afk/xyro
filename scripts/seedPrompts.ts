// Seed script to generate 200 sample prompts into data/prompts.json
import { writeFileSync } from 'fs'
import { join } from 'path'

const categories = [
  'ChatGPT','Gemini','Claude','Midjourney','Stable Diffusion','Runway','Veo','Sora','Coding','Marketing','Business','SEO','YouTube','Writing','Education','Productivity','Design','Gaming','Anime','Social Media','Finance','Resume','Interview','Email','Sales','Customer Support'
]
const platforms = ['ChatGPT','Gemini','Claude','Midjourney','Stable Diffusion','Runway','DALL·E']
const difficulties = ['Easy','Medium','Hard']
const authors = ['Ava Stone','Noah Reed','Liam Chen','Emma Rivera','Olivia Park','Mason Taylor','Sophia Kim','Lucas Patel','Isabella Diaz','Ethan Brooks','Mia Nguyen','Amir Khan','Zoe Carter','Kai Suzuki','Harper Lee','Evelyn Moore']
const tagsPool = ['marketing','youtube','ad','script','image','prompt-engineering','seo','summarize','rewrite','code','productivity','growth','ux','design','stable-diffusion']

function rand(arr:any[], i:number){ return arr[i % arr.length] }

const prompts = []
for(let i=1;i<=200;i++){
  const id = `prompt-${String(i).padStart(3,'0')}`
  const category = rand(categories, i*7)
  const platform = rand(platforms, i*5)
  const difficulty = rand(difficulties, i*3)
  const author = rand(authors, i*11)
  const tags = [tagsPool[i%tagsPool.length], tagsPool[(i+3)%tagsPool.length]]
  const title = `${category} — ${['Optimize','Create','Write','Generate','Improve','Translate','Summarize'][i%7]} ${['high-converting','engaging','scalable','concise','detailed','creative','SEO-friendly'][i%7]} ${['ad','video script','email','blog outline','product description','image prompt','marketing plan'][i%7]}`
  const promptText = `You are an expert ${category} assistant. ${['Write','Generate','Create','Improve'][i%4]} a ${['detailed','concise','engaging'][i%3]} ${['YouTube script','marketing email','product description','blog post outline','image prompt','chat conversation'][i%6]} aimed at ${['beginners','experienced users','marketers','developers','designers'][i%5]} that achieves the following goal: ${['increase conversions by 20%','explain complex topics simply','drive newsletter signups','generate high-quality images','improve SEO rankings'][i%5]}. Use tone: ${['professional','casual','fun','persuasive'][i%4]}. Include examples and step-by-step instructions.`
  const example_output = `Example output for ${title}: A concise sample that demonstrates the expected result (short excerpt).`
  const description = `A ${difficulty.toLowerCase()} prompt for ${platform} focused on ${title.split(' ').slice(2,5).join(' ')}. Designed by ${author}.`
  const rating = Number((4 + (i%6)/10).toFixed(1))
  const views = 1000 + i*37
  const copy_count = 200 + i*12
  const dateAdded = new Date(Date.now() - i*86400000).toISOString()

  prompts.push({
    id, title, description, prompt: promptText, platform, tags, difficulty, example_output, rating, views, copy_count, author, dateAdded, category
  })
}

const out = join(process.cwd(),'data','prompts.json')
writeFileSync(out, JSON.stringify(prompts, null, 2))
console.log('Seeded', prompts.length, 'prompts to', out)
