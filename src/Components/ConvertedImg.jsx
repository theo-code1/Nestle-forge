import FaTrash from "./Icons/Delete"

const ConvertedImg = ({ convertedImage, ImageName, ImageSize, DownloadImg, imgHref, OnClick }) => {
  return (
    <nav className='flex items-center justify-between px-4 py-2 bg-orange-700 rounded-lg w-full'>
      <div className="img-labels flex items-center gap-4">
        <img src={convertedImage} alt="Converted image" className='size-24 rounded-md object-cover'/>
        <div className="img-details h-26 pt-2">
            <h2 className='text-white text-lg'>{ImageName}</h2>
            <h3 className='text-white text-sm'>{ImageSize}</h3>
        </div>
      </div>
      <div className='btns flex items-center justify-center gap-2'>
        <button onclick={OnClick} title='Delete' className='text-xl bg-white text-red-500 hover:text-red-300  hover:brightness-95 transition-all duration-100 ursor-pointer border-2 border-indigo-600 rounded-lg px-6 py-4 ' download={DownloadImg}> <FaTrash /> </button>
          <a href={imgHref} className='text-lg bg-white hover:brightness-90 transition-all duration-100 text-indigo-600 cursor-pointer border-2 border-indigo-600 rounded-lg px-6 py-3' download={DownloadImg}> Download </a>
      </div>
    </nav>
  )
}

export default ConvertedImg