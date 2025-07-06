import React from 'react'
import Delete from './Icons/Delete'

const CompressFile = ({ 
  ImageName, 
  ImageSize, 
  selectedImgDetails, 
  isLoading, 
  isCompressed, 
  handleDelete, 
  handleCompressing,
  compressedImg,
  originalImg
}) => {

  return (
    <nav className='flex items-center justify-between px-4 py-2 bg-white border border-black rounded-md w-full'>
        <div className="img-labels flex items-center gap-4">
          {/* Original Image */}
          <div className="original-image">
            <img src={originalImg} alt="Original image" className='size-24 rounded-md object-cover'/>
            <p className="text-xs text-gray-500 mt-1">Original</p>
          </div>
          
          {/* Compressed Image - show when compressed */}
          {isCompressed && compressedImg && (
            <div className="compressed-image">
              <img src={compressedImg} alt="Compressed image" className='size-24 rounded-md object-cover'/>
              <p className="text-xs text-gray-500 mt-1">Compressed</p>
            </div>
          )}
          
          <div className="img-details h-26 pt-2 text-black">
              <h2 className='text-lg'>{ImageName && ImageName.length > 16 ? ImageName.substring(0, 16) + '...' + selectedImgDetails?.format : ImageName}</h2>
              <h3 className='text-sm'>{ImageSize}</h3>
              {isCompressed && selectedImgDetails?.compressionRatio && (
                <h4 className='text-xs text-green-600'>Compressed by {selectedImgDetails.compressionRatio}</h4>
              )}
          </div>
        </div>
        <div className='btns flex items-center justify-center gap-2'>
          <button onClick={handleDelete} title='Delete' className='text-xl bg-white text-red-500 hover:bg-red-500 hover:text-white transition-all duration-100 cursor-pointer border-2 border-red-500 rounded-lg px-6 py-4 '> <Delete /> </button>
            {isCompressed && compressedImg && (
              <a href={compressedImg} className='text-lg bg-indigo-600 text-white hover:text-indigo-600 hover:bg-white transition-all duration-100 cursor-pointer border-2 border-indigo-600 rounded-lg px-6 py-3' download={`compressed_${ImageName}`}> Download </a>
            )}
            {!isCompressed && (
              <button onClick={handleCompressing} className='text-lg text-indigo-600 bg-white hover:bg-indigo-600 hover:text-white transition-all duration-100 cursor-pointer border-2 border-indigo-600 rounded-lg px-6 py-3'> {isLoading ? 'compressing...' : 'Compress'} </button>
            )}
        </div>
      </nav>
  )
}

export default CompressFile