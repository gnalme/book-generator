import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './index.css';
import BookHead from './Components/BookHead';
import Search from './Components/Search';
import ClosedCard from './Components/ClosedCard';
import { ThumbsUp } from 'lucide-react';

const langs = [
  { label: 'English (USA)', value: 'en' },
  { label: 'German (Germany)', value: 'de' },
  { label: 'Japanese (Japan)', value: 'ja' },
  { label: 'Russian (Russia)', value: 'ru' }
];


function BookCover({ text }) {
  const canvasId = `canvas-${(text || 'book').slice(0, 10)}`;

  useEffect(() => {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    const safeText = text || 'No title';
const lines = safeText.split(/\s+/).reduce((acc, word) => {
      const lastLine = acc[acc.length - 1];
      if ((lastLine + ' ' + word).length < 30) acc[acc.length - 1] += ' ' + word;
      else acc.push(word);
      return acc;
    }, ['']);
    lines.forEach((line, i) => {
      ctx.fillText(line.trim(), canvas.width / 2, 40 + i * 20);
    });
  }, [canvasId, text]);

  return <canvas id={canvasId} width={200} height={120} className="border" />;
}

export default function App() {
  const [lang, setLang] = useState('en');
  const [seed, setSeed] = useState('1234567');
  const [likes, setLikes] = useState(3.5);
  const [reviews, setReviews] = useState(2.5);
  const [page, setPage] = useState(1);
  const [books, setBooks] = useState([]);
  const [openCardId, setOpenCardId] = useState(null);

  useEffect(() => {
    setPage(1);
    fetchBooks(1, true);
  }, [lang, seed, likes, reviews]);

  const toggleCard = (id) => {
  setOpenCardId(prev => (prev === id ? null : id));
};

 const fetchBooks = async (pg, replace = false) => {
  try {
    const res = await fetch(`/api/books?seed=${seed}&page=${pg}&lang=${lang}&likes=${likes}&reviews=${reviews}`);
    
    if (!res.ok) {
      console.error(`HTTP Error: ${res.status}`);
      return;
    }

    const data = await res.json();
    
    if (replace) setBooks(data);
    else setBooks(prev => [...prev, ...data]);
  } catch (err) {
    console.error('Failed to fetch books:', err);
  }
};


  const fetchMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBooks(nextPage);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Book Generator</h1>
      <Search seed={seed} lang={lang} likes={likes} reviews={reviews}
        setSeed={setSeed} setLang={setLang}
        setLikes={setLikes} setReviews={setReviews} langs={langs}/>
      <BookHead />

      <InfiniteScroll 
        dataLength={books.length}
        next={fetchMore}
        hasMore={true}
        loader={<h4>Loading...</h4>}>
  {books.map(book => {
  const isOpen = openCardId === book.index;
  const isClosed = true;

  return (
    <div
      key={book.index}
      onClick={() => toggleCard(book.index)}
      className="cursor-pointer bg-white rounded-2xl shadow p-4 transition-all duration-300 hover:shadow-lg"
    >
    
      {!isOpen ? (
        <ClosedCard key={book.i} book={{ ...book}} isClosed={true}/>
      ) : (
        <div>
          <ClosedCard key={book.i} book={{ ...book}} isClosed={false} />
          
        <div className="flex md:flex-row gap-[25px]">
          <div className="flex flex-col items-center ml-[30px] mt-[30px]">
            <BookCover text={book.coverText} />
            <div className="mt-2 text-sm text-pink-600 like"><h3 className='mz'>{book.likes ?? 0}</h3>  <ThumbsUp size={20} color="#ffffff" strokeWidth={2} /></div>
          </div>

          {/* Правая часть: описание */}
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">{book.title}</h2>
            <p className="text-gray-700 mb-2">{book.authors.join(', ')}</p>
            <p className="text-gray-500 mb-2">Publisher: {book.publisher}</p>

            <div className="mt-4">
              <h3 className="font-semibold text-sm mb-1">Reviews:</h3>
              <div className="mt-2 space-y-1">
                {book.reviews.map((comment, i) => (
                  <div key={i} className="bg-gray-100 p-2 rounded">
                    <p className="text-sm comm">{comment.text}</p>
                    <p className="text-sm font-semibold reviwer">— {comment.reviewer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
})}
</InfiniteScroll>

    </div>
  );
}
