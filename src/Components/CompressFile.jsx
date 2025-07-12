import React from 'react'
import Delete from './Icons/Delete'
import DocIcon from './Icons/DocIcon';

// Helper function to format file sizes
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const CompressFile = ({ 
  ImageName, 
  ImageSize, 
  selectedImgDetails, 
  isLoading, 
  isCompressed, 
  handleDelete, 
  handleCompressing,
  compressedImg,
}) => {

  return (
    <nav className='w-screen md:w-[30vw] flex items-center justify-between px-5 py-4 bg-white border border-black/40 rounded-md shadow-[0_2px_15px_0_#0000001a]'>
        <div className="img-details flex gap-2 items-center">
          <DocIcon className={'w-8 h-8 text-black'} />
          <div className="headers min-w-fit">
              <h2 className='text-[16px] font-medium  hidden md:flex'>{ImageName && ImageName.length > 16 ? ImageName.substring(0, 16) + '...' + selectedImgDetails?.format : ImageName}</h2>
              <h2 className='text-[16px] font-medium flex md:hidden'>{ImageName && ImageName.length > 16 ? ImageName.substring(0, 8) + '...' + selectedImgDetails?.format : ImageName}</h2>
              <h3 className='text-[16px] text-[#545454]'>{ImageSize}</h3>
          </div>
              {isCompressed && selectedImgDetails?.compressionRatio && (
                <div className='text-xs'>
                  <p className='text-green-600'>Compressed by {Math.round(selectedImgDetails.compressionRatio)}%</p>
                  {selectedImgDetails.originalSize && selectedImgDetails.compressedSize && (
                    <p className='text-gray-500'>
                      {formatFileSize(selectedImgDetails.originalSize)} → {formatFileSize(selectedImgDetails.compressedSize)}
                    </p>
                  )}
                </div>
              )}
          </div>
        <div className='btns flex items-center justify-center gap-2'>
          <button onClick={handleDelete} title='Delete' className='text-2xl bg-white text-red-500 hover:shadow-[0_0_15px_0_#0000001a] transition-all duration-100 cursor-pointer border-2 border-black/20 rounded-md px-3 py-3 '> <Delete /> </button>
            {isCompressed && compressedImg && (
              <button 
                className='text-lg bg-[#3582FD] text-white hover:brightness-95 transition-all duration-100 cursor-pointer rounded-lg px-6 py-3'
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    let url = compressedImg;
                    let filename = `compressed_${ImageName}`;
                    
                    // If it's a blob URL, use it directly
                    if (!compressedImg.startsWith('blob:')) {
                      // For regular URLs, fetch the file first
                      const response = await fetch(compressedImg, {
                        headers: {
                          'Cache-Control': 'no-cache',
                          'Pragma': 'no-cache'
                        },
                        credentials: 'include' // Include cookies if needed
                      });
                      
                      if (!response.ok) throw new Error('Failed to fetch file');
                      
                      const blob = await response.blob();
                      url = window.URL.createObjectURL(blob);
                      
                      // Try to get the filename from content-disposition header
                      const contentDisposition = response.headers.get('content-disposition');
                      if (contentDisposition) {
                        const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                        if (fileNameMatch && fileNameMatch[1]) {
                          filename = fileNameMatch[1].replace(/['"]/g, '');
                        }
                      }
                    }
                    
                    // Create a temporary link and trigger download
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = filename;
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    link.click();
                    
                    // Clean up
                    setTimeout(() => {
                      document.body.removeChild(link);
                      if (url.startsWith('blob:')) {
                        window.URL.revokeObjectURL(url);
                      }
                    }, 100);
                    
                  } catch (error) {
                    console.error('Download error:', error);
                    // Fallback to opening in new tab if download fails
                    window.open(compressedImg, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                Download
              </button>
            )}
            {!isCompressed && (
              <button onClick={handleCompressing} className='text-lg bg-[#3582FD] hover:brightness-95 text-white transition-all duration-100 cursor-pointer rounded-lg px-6 py-3'> {isLoading ? 'compressing...' : 'Compress'} </button>
            )}
        </div>
      </nav>
  )
}

export default CompressFile