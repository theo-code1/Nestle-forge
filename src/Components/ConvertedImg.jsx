import FaTrash from "./Icons/Delete"

const ConvertedImg = ({ convertedImage, ImageName, ImageSize, DownloadImg, imgHref, OnClick }) => {
  return (
    <nav className='flex items-center justify-between px-4 py-2 bg-white border border-black rounded-md w-full'>
      <div className="img-labels flex items-center gap-4">
        <img src={convertedImage} alt="Converted image" className='size-24 rounded-md object-cover'/>
        <div className="img-details h-26 pt-2 text-black">
            <h2 className='text-lg'>{ImageName}</h2>
            <h3 className='text-sm'>{ImageSize}</h3>
        </div>
      </div>
      <div className='btns flex items-center justify-center gap-2'>
        <button onclick={OnClick} title='Delete' className='text-xl bg-white text-red-500 hover:bg-red-500 hover:text-white transition-all duration-100 cursor-pointer border-2 border-red-500 rounded-lg px-6 py-4 ' download={DownloadImg}> <FaTrash /> </button>
          <a href={imgHref} className='text-lg text-indigo-600 bg-white hover:bg-indigo-600 hover:text-white transition-all duration-100 cursor-pointer border-2 border-indigo-600 rounded-lg px-6 py-3' download={DownloadImg}> Download </a>
      </div>
    </nav>
  )
}

export default ConvertedImg