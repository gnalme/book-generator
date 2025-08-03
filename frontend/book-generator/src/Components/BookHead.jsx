export default function BookHead() {
    return (
        <div className='flex justify-between font-semibold text-left cursor-default p-[10px] head'>
          <div className="w-1/24 text-center">#</div>
          <div className="w-2/12 ">ISBN</div>
          <div className="w-3/12">Title</div>
          <div className="w-3/12 ">Author</div>
          <div className="w-3/12 ">Publisher</div>
      </div>
    )
}