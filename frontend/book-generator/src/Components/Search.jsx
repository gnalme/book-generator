import { Shuffle } from "lucide-react";

export default function Search({seed, lang, likes, reviews, setSeed, setLang, setLikes, setReviews, langs}) {
  function generateSeed() {
    return Math.floor(Math.random() * 1_000_000_000).toString();
  }
    return (
        <div className="flex justify-center mb-[20px] gap-[50px]">
          <div className='flex flex-col w-2/12'>
            <label htmlFor="lang" className='mb-[2px] text-[14px]'>Language</label>
            <select value={lang} onChange={e => setLang(e.target.value)} className="border p-[10px] rounded-[3px]" id='lang'>
              {langs.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <div className="flex flex-col w-2/12">
            <label htmlFor="lang" className='mb-[2px] text-[14px]'>Seed</label>
            <form>
              <input value={seed} onChange={e => setSeed(e.target.value)} className="border p-[10px] rand" placeholder="Seed" />
              <button
                type="button"
                onClick={() => setSeed(generateSeed())}
                className="randBut"
              >
                <Shuffle size={15} />
              </button>
            </form>
          </div>
          <div className="flex flex-col w-4/12">
            <label htmlFor="lang" className='mb-[2px] text-[14px]'>Likes</label>
            <input type="range" min="0" max="5" step="0.1" value={likes} onChange={e => setLikes(parseFloat(e.target.value))} className="mt-[10px]"/>
          </div>
          <div className="flex flex-col w-1/12">
            <label htmlFor="lang" className='mb-[2px] text-[14px]'>Reviews</label>
            <input type="number" step="0.1" min="0" max="10" value={reviews} onChange={e => setReviews(parseFloat(e.target.value))} className="border p-[10px] rounded-[3px]" />
          </div>
          
        </div>
    )
}