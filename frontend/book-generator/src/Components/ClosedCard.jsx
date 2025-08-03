import { ChevronUp, ChevronDown } from 'lucide-react';

export default function ClosedCard({book, isClosed}) {
    return (
        <div className="flex justify-between text-left p-[20px] overflow-y-auto grow max-h-[calc(100vh-160px)] card" id={!isClosed ? 'up' : 'down'}>
          <div className="w-1/24 flex font-black index">{isClosed
            ? <ChevronDown size={20} strokeWidth={1.75}/>
            : <ChevronUp size={20} strokeWidth={1.75}/>}
          {book.index}</div>
          <div className="w-2/12 text-gray-600">{book.isbn}</div>
          <div className="w-3/12 font-semibold">{book.title}</div>
          <div className="w-3/12 text-gray-600 truncate">{book.authors.join(', ')}</div>
          <div className="w-3/12 text-gray-400 truncate">{book.publisher}</div>
        </div>
    )
}