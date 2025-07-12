import { useState } from "react";
import FaTrash from "./Icons/Delete"
import ToArrow from "./Icons/toArrow.jsx";
import Dropdown from "./Icons/dropdown.jsx";
import DocIcon from "./Icons/DocIcon.jsx";

const ConvertedImg = ({ ImageName, ImageSize, DownloadImg, imgHref, handleDelete, selectedImgDetails, isConverted, handleConverting, selectedImg, setConvertToFormat, convertToFormat, isLoading, imageId, openDropdownId, setOpenDropdownId }) => {

  const formatCategories = {
    Image: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff', 'ico', 'avif'],
  };
  const [hoveredCategory, setHoveredCategory] = useState(
    Object.keys(formatCategories)[0]
  );
  
  const isDropdownOpen = openDropdownId === imageId;
  

  return (
      <nav className='w-[26dvw] flex flex-col gap-12 items-center justify-between px-5 py-4 bg-white border border-black/40 rounded-md shadow-[0_2px_15px_0_#0000001a]'>
        <div className="first-column flex justify-between w-full items-center">

          <div className="img-labels flex items-center gap-4">
            <div className="doc-icon-container">
              <DocIcon className={'w-8 h-8 text-black'} />
            </div>
            <div className="img-details w-fit">
                <h2 className='text-[16px] font-medium'>{ImageName.length > 16 ? ImageName.substring(0, 16) + '...' + selectedImgDetails.format.toLowerCase() : ImageName}</h2>
                <h3 className='text-[16px] text-[#545454]'>{ImageSize}</h3>
            </div>
          </div>

          <div className='delete-button'>
            <button onClick={handleDelete} title='Delete' className='text-xl bg-white text-red-500  hover:shadow-[0_2px_15px_0_#0000001a] transition-all duration-100 cursor-pointer border-2 border-black/20 rounded-md p-2 '> <FaTrash /> </button>
          </div>
        </div>

        <div className="second-column relative w-full flex justify-between items-center gap-4">

          {selectedImg && (
              <>
                <div className="select-formats h-fit flex items-center gap-1   z-30">
                  <button
                    type="button"
                    className="text-[16px] font-medium border-black/20 border-2 px-5.5 py-2 rounded-md"
                  >
                    {selectedImgDetails.format}
                  </button>
                  <ToArrow className={'text-black '}/>
                  <div className="relative ">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(isDropdownOpen ? null : imageId);
                      }}
                      type="button"
                      className={`text-[16px] font-medium pl-5 ${!convertToFormat ? 'pr-3.5' : 'pr-5'} py-2 rounded-md border-2 border-black/20 flex gap-4 items-center hover:shadow-[0_2px_15px_0_#0000001a] active:bg-black/5 cursor-pointer transition-all duration-100`}
                    >
                      {convertToFormat ? convertToFormat.toUpperCase() : "To"}
                      {!convertToFormat && <Dropdown />}
                    </button>
                  </div>
                </div>

                {isDropdownOpen && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-12 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-visible">
                    <div className="flex">
                      {/* Categories List */}
                      <div className="w-1/3 border-r border-gray-200 bg-gray-50">
                        {Object.keys(formatCategories).map((category) => (
                          <div
                            key={category}
                            className={`px-4 py-3 text-sm font-medium cursor-pointer transition-colors ${
                              hoveredCategory === category
                                ? "bg-white text-[#3582FD] font-semibold"
                                : "text-gray-800 hover:bg-gray-100"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setHoveredCategory(category);
                            }}
                          >
                            {category}
                          </div>
                        ))}
                      </div>

                      {/* Formats List */}
                      <div className="w-2/3 p-2">
                        <div className="grid grid-cols-2 gap-1">
                          {hoveredCategory &&
                            formatCategories[hoveredCategory]?.map((format) => {
                              const isCurrentFormat = format.toLowerCase() === selectedImgDetails.format.toLowerCase();
                              return (
                                <button
                                  key={format}
                                  className={`w-full px-4 py-2.5 text-sm text-left rounded-md transition-colors ${
                                    convertToFormat === format
                                      ? "bg-[#3582FD] text-white font-medium"
                                      : "text-gray-800 hover:bg-[#3582FD]/10"
                                  }
                                  ${isCurrentFormat ? 'text-black bg-gray-200 hover:bg-gray-200 cursor-not-allowed ' : '' } `}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setConvertToFormat(format);
                                    setOpenDropdownId(null);
                                  }}
                                  disabled={isCurrentFormat}
                                >
                                  {format.toUpperCase()}
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div className="convert-download flex-shrink-0">

            {convertToFormat && !isConverted && (
              <button onClick={handleConverting} className='text-lg bg-[#3582FD] hover:brightness-95 text-white transition-all duration-100 cursor-pointer rounded-lg px-6 py-2'> {isLoading ? 'converting...' : 'Convert'} </button>
                )}
              {isConverted && imgHref && ( <a href={`http://localhost:5001/download/${encodeURIComponent(DownloadImg)}`} className='text-lg bg-[#3582FD] text-white hover:brightness-95 transition-all duration-100 cursor-pointer rounded-lg px-6 py-3' download={DownloadImg}> Download </a> )}
            </div>
        </div>
      </nav>
  )
}

export default ConvertedImg