import { useState } from "react";
import FaTrash from "./Icons/Delete.jsx"
import ToArrow from "./Icons/ToArrow.jsx";
import DropDown from "./Icons/DropDown.jsx";
import DocIcon from "./Icons/DocIcon.jsx";
import { downloadBlob } from "../utils/api";

const ConvertedImg = ({ ImageName, ImageSize, DownloadImg, handleDelete, selectedImgDetails, isConverted, handleConverting, selectedImg, setConvertToFormat, convertToFormat, isLoading, imageId, openDropdownId, setOpenDropdownId, convertedBlob }) => {

  const formatCategories = {
    Image: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff', 'ico', 'avif'],
  };
  const [hoveredCategory, setHoveredCategory] = useState(
    Object.keys(formatCategories)[0]
  );
  
  const isDropdownOpen = openDropdownId === imageId;
  

  return (
      <nav className='w-full md:w-3/4 lg:w-[26dvw] md:mx-auto lg:mx-0 flex flex-col gap-12 items-center justify-between px-5 py-4 bg-white dark:bg-black border border-black/40 dark:border-white/20 rounded-md shadow-[0_2px_15px_0_#0000001a]'>
        <div className="first-column flex justify-between w-full items-center">

          <div className="img-labels flex items-center gap-4">
            <div className="doc-icon-container">
              <DocIcon className={'w-8 h-8 text-black dark:text-white/90'} />
            </div>
            <div className="img-details w-fit">
                <h2 className='text-black dark:text-white/90 text-[16px] font-medium'>{ImageName.length > 16 ? ImageName.substring(0, 16) + '...' + selectedImgDetails.format.toLowerCase() : ImageName}</h2>
                <h3 className='text-[16px] text-[#545454]'>{ImageSize}</h3>
            </div>
          </div>

          <div className='delete-button'>
            <button onClick={handleDelete} title='Delete' className='text-xl bg-white dark:bg-black text-red-500  hover:shadow-[0_2px_15px_0_#0000001a] dark:hover:shadow-[0_2px_15px_0_#ffffff1a] transition-all duration-100 cursor-pointer border-2 border-black/20 dark:border-white/20 rounded-md p-2 '> <FaTrash /> </button>
          </div>
        </div>

        <div className="second-column relative w-full flex justify-between items-center gap-4">

          {selectedImg && (
              <>
                <div className="select-formats h-fit flex items-center gap-1 z-30">
                  <button
                    type="button"
                    className="text-black dark:text-white/90 text-[16px] font-medium border-black/20 dark:border-white/20 border-2 px-5.5 py-2 rounded-md"
                  >
                    {selectedImgDetails.format}
                  </button>
                  <ToArrow className={'text-black dark:text-white/80'}/>
                  <div className="relative ">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(isDropdownOpen ? null : imageId);
                      }}
                      type="button"
                      className={`text-black dark:text-white/90 text-[16px] font-medium pl-5 ${!convertToFormat ? 'pr-3.5' : 'pr-5'} py-2 rounded-md border-2 border-black/20 dark:border-white/20 flex gap-4 items-center hover:shadow-[0_2px_15px_0_#0000001a] active:bg-black/5 cursor-pointer transition-all duration-100`}
                    >
                      {convertToFormat ? convertToFormat.toUpperCase() : "To"}
                      {!convertToFormat && <DropDown />}
                    </button>
                  </div>
                </div>

                {isDropdownOpen && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-12 mt-2 w-96 bg-white dark:bg-black/90 rounded-lg shadow-lg border border-gray-200 dark:border-black z-50 overflow-visible">
                    <div className="flex">
                      {/* Categories List */}
                      <div className="w-1/3 border-r border-gray-200 bg-gray-50 dark:bg-black dark:border-white/40">
                        {Object.keys(formatCategories).map((category) => (
                          <div
                            key={category}
                            className={`px-4 py-3 text-sm font-medium cursor-pointer transition-colors ${
                              hoveredCategory === category
                                ? "text-[#3582FD] dark:text-[#3582FD]/80 font-semibold"
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
                                      ? "bg-[#3582FD] dark:bg-[#3582FD]/80 text-white font-medium"
                                      : "text-gray-800 hover:bg-[#3582FD]/10 dark:text-white/90 dark:hover:bg-white/20"
                                  }
                                  ${isCurrentFormat ? 'text-black bg-gray-200 hover:bg-gray-200 dark:bg-white/30 dark:text-white/60 cursor-not-allowed ' : '' } `}
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
              <button onClick={handleConverting} className={`text-lg bg-[#3582FD] dark:bg-[#3582FD]/80 hover:brightness-95 text-white transition-all duration-100 cursor-pointer rounded-lg py-2 px-2 md:px-6 `}> {isLoading ? 'converting...' : 'Convert'} </button>
                )}
              {isConverted && convertedBlob && (
                <button
                  onClick={() => downloadBlob(convertedBlob, DownloadImg)}
                  className="text-lg bg-[#3582FD] text-white hover:brightness-95 transition-all duration-100 cursor-pointer rounded-lg px-6 py-3"
                >
                  Download
                </button>
              )}
              {isConverted && !convertedBlob && (
                <span className="text-red-500 text-sm">Download unavailable</span>
              )}
            </div>
        </div>
      </nav>
  )
}

export default ConvertedImg