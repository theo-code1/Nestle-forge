import { useState } from "react";
import FaTrash from "./Icons/Delete"
import ToArrow from "./Icons/toArrow.jsx";
import Dropdown from "./Icons/dropdown.jsx";

const ConvertedImg = ({ convertedImage, ImageName, ImageSize, DownloadImg, imgHref, handleDelete, selectedImgDetails, isConverted, handleConverting, selectedImg, setConvertToFormat, convertToFormat, isLoading, imageId, openDropdownId, setOpenDropdownId }) => {

  const formatCategories = {
    Image: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff', 'ico', 'avif'],
  };
  const [hoveredCategory, setHoveredCategory] = useState(
    Object.keys(formatCategories)[0]
  );
  
  const isDropdownOpen = openDropdownId === imageId;
  

  return (
      <nav className='flex items-center justify-between px-4 py-2 bg-white border border-black rounded-md w-full'>
        <div className="img-labels flex items-center gap-4">
          <img src={convertedImage} alt="Converted image" className='size-24 rounded-md object-cover'/>
          <div className="img-details h-26 pt-2 text-black">
              <h2 className='text-lg'>{ImageName.length > 16 ? ImageName.substring(0, 16) + '...' + selectedImgDetails.format : ImageName}</h2>
              <h3 className='text-sm'>{ImageSize}</h3>
          </div>
        </div>

        {selectedImg && (
              <>
                <div className="select-formats flex items-center gap-4 mt-4 z-30">
                  <button
                    type="button"
                    className="text-lg font-medium border-indigo-700 border px-4 py-2 rounded-lg"
                  >
                    {selectedImgDetails.format}
                  </button>
                  <ToArrow />
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(isDropdownOpen ? null : imageId);
                      }}
                      type="button"
                      className="text-lg font-medium border-indigo-700 border pl-4 pr-2 py-2 rounded-lg flex items-center hover:bg-black/5 cursor-pointer transition-all duration-100"
                    >
                      {convertToFormat.toUpperCase() || "to..."}
                      <Dropdown
                        className={`transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {isDropdownOpen && (
                  <div className="absolute left-1/3 -top-40 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
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
                                }`}
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

        <div className='btns flex items-center justify-center gap-2'>
          <button onClick={handleDelete} title='Delete' className='text-xl bg-white text-red-500 hover:bg-red-500 hover:text-white transition-all duration-100 cursor-pointer border-2 border-red-500 rounded-lg px-6 py-4 '> <FaTrash /> </button>
            {isConverted && imgHref  && (
              <a href={imgHref} className='text-lg bg-indigo-600 text-white hover:text-indigo-600 hover:bg-white transition-all duration-100 cursor-pointer border-2 border-indigo-600 rounded-lg px-6 py-3' download={DownloadImg}> Download </a>
            )}
            {convertToFormat && !isConverted && (
              <button onClick={handleConverting} className='text-lg text-indigo-600 bg-white hover:bg-indigo-600 hover:text-white transition-all duration-100 cursor-pointer border-2 border-indigo-600 rounded-lg px-6 py-3'> {isLoading ? 'converting...' : 'Convert'} </button>
            )}
        </div>
      </nav>
  )
}

export default ConvertedImg