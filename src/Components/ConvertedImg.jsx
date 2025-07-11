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
      <nav className='w-[26dvw] flex flex-col gap-8 items-center justify-between px-5 py-4 bg-white border border-black/40 rounded-md '>
        <div className="first-column flex justify-between w-full">

          <div className="img-labels flex items-center gap-6">
            <DocIcon className={'scale-150 origin-left text-black'} />
            <div className="img-details w-fit">
                <h2 className='text-[16px] font-medium'>{ImageName.length > 16 ? ImageName.substring(0, 16) + '...' + selectedImgDetails.format.toLowerCase() : ImageName}</h2>
                <h3 className='text-[16px] text-[#545454]'>{ImageSize}</h3>
            </div>
          </div>

          <div className='delete-button '>
            <button onClick={handleDelete} title='Delete' className='text-xl bg-white text-red-500  hover:shadow-[0_2px_10px_0_#0000001a] transition-all duration-100 cursor-pointer border-2 border-black/20 rounded-md p-2 '> <FaTrash /> </button>
              
              
          </div>
        </div>

        <div className="second-column w-full flex justify-between ">

          {selectedImg && (
              <>
                <div className="select-formats h-fit flex items-center gap-0 z-30">
                  <button
                    type="button"
                    className="text-[16px] font-medium border-black/20 border-2 px-5 py-[6px] rounded-md"
                  >
                    {selectedImgDetails.format}
                  </button>
                  <ToArrow className={'text-black '}/>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(isDropdownOpen ? null : imageId);
                      }}
                      type="button"
                      className="text-[16px] px-5 py-[6px] rounded-md border-2 border-black/20 flex items-center hover:shadow-[0_2px_10px_0_#0000001a] active:bg-black/5 cursor-pointer transition-all duration-100"
                    >
                      {convertToFormat.toUpperCase() || "To"}
                      <Dropdown
                        className={`transition-transform duration-200 `}
                      />
                    </button>
                  </div>
                </div>

                {isDropdownOpen && (
                  <div className="absolute left-1/3 -top-48 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                    <div className="flex">
                      {/* Categories List */}
                      <div className="w-1/3 border-r border-gray-200 bg-gray-50">
                        {Object.keys(formatCategories).map((category) => (
                          <div
                            key={category}
                            className={`px-4 py-3 text-sm font-medium cursor-pointer transition-colors ${
                              hoveredCategory === category
                                ? "bg-white text-indigo-700 font-semibold"
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
                            formatCategories[hoveredCategory]?.map((format) => (
                              <button
                                key={format}
                                className={`w-full px-4 py-2.5 text-sm text-left rounded-md transition-colors ${
                                  convertToFormat === format
                                    ? "bg-indigo-600 text-white font-medium"
                                    : "text-gray-800 hover:bg-indigo-50"
                                }
                                ${selectedImgDetails.format === format ? 'bg-indigo-50 cursor-not-allowed' : '' } `}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConvertToFormat(format);
                                  setOpenDropdownId(null);
                                }}
                              >
                                {format.toUpperCase()}
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div className="convert-download">

            {convertToFormat && !isConverted && (
              <button onClick={handleConverting} className='text-lg bg-[#3582FD] hover:brightness-95 text-white transition-all duration-100 cursor-pointer rounded-lg px-6 py-3'> {isLoading ? 'converting...' : 'Convert'} </button>
                )}
              {isConverted && imgHref && ( <a href={`http://localhost:5001/download/${encodeURIComponent(DownloadImg)}`} className='text-lg bg-indigo-600 text-white hover:text-indigo-600 hover:bg-white transition-all duration-100 cursor-pointer border-2 border-indigo-600 rounded-lg px-6 py-3' download={DownloadImg}> Download </a> )}
            </div>
        </div>
      </nav>
  )
}

export default ConvertedImg