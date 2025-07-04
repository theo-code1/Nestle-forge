import { useState } from "react";
import Upload from "./Icons/Upload.jsx";
import ToArrow from "./Icons/toArrow.jsx";
import Dropdown from "./Icons/dropdown.jsx";
import { convertImage, vectorizeImage } from "../utils/api";
import ConvertedImg from "./ConvertedImg.jsx";
// import FaTrash from "./Icons/Delete.jsx";

const formatCategories = {
  Image: ["PNG", "JPEG", "WEBP", "BMP", "GIF", "ICO"],
  Document: ["PDF", "DOC", "DOCX"],
  Vector: ["SVG", "EPS", "AI"],
};

export default function ConverterSection() {
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedImgDetails, setSelectedImgDetails] = useState({
    name: "No file selected",
    format: "No format selected",
    size: "",
  });
  const [convertToFormat, setConvertToFormat] = useState("");
  const [openMenuFormats, setOpenMenuFormats] = useState(false);
  const [showErr, setShowErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(
    Object.keys(formatCategories)[0]
  );
  const [isConverted, setIsConverted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [droppedFiles, setDroppedfiles] = useState();

  const truncateFileName = (name, length = 20) => {
    if (name.length <= length) return name;
    const extension = name.split(".").pop();
    return name.slice(0, length - extension.length - 3) + "..." + extension;
  };

  const resetFileInput = () => {
    const fileInput = document.getElementById("file");
    if (fileInput) {
      fileInput.value = ""; // This resets the file input
    }
  };

  const resetState = () => {
    setSelectedImg(null);
    setSelectedImgDetails({
      name: "No file selected",
      format: "No format selected",
      size: "",
    });
  };

  const handleDelete = (url) => {
    setUploadedFiles((prev) => {
      const filtered = prev.filter((file) => file.url !== url);
      // Clean up object URL
      const removed = prev.find((file) => file.url === url);
      if (removed) URL.revokeObjectURL(removed.url);
      return filtered;
    });
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    const fileFormat = file.type.split("/")[1].toUpperCase();
    setSelectedImgDetails({
      name: file.name,
      format: fileFormat,
      size: (file.size / 1024).toFixed(2) + " KB",
    });
    setSelectedImg(URL.createObjectURL(file));

    // Set the file input value for consistency
    const fileInput = document.getElementById("file");
    if (fileInput) {
      // Create a new FileList-like object
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        handleFileSelect(file);
      } else {
        setShowErr("Please select a valid image file.");
      }
    }
  };

  const handleConverting = async () => {
    // Reset any previous errors and states
    setShowErr("");
    setIsLoading(true);

    // Check if same format
    if (
      selectedImgDetails.format.toLowerCase() === convertToFormat.toLowerCase()
    ) {
      setShowErr("Please select a different format to convert.");
      setIsLoading(false);
      return;
    }

    try {
      // Validate inputs
      if (!selectedImg) {
        throw new Error("Please select an image to convert.");
      }

      if (!convertToFormat) {
        throw new Error("Please select a target format.");
      }

      // Get a fresh reference to the file
      const fileInput = document.getElementById("file");
      if (!fileInput?.files?.length) {
        throw new Error("No file selected");
      }

      const file = fileInput.files[0];

      console.log(
        "Starting conversion for file:",
        file.name,
        "to format:",
        convertToFormat
      );

      let blob;
      if (convertToFormat.toLowerCase() === "svg") {
        blob = await vectorizeImage(file);
      } else {
        blob = await convertImage(file, convertToFormat);
      }

      console.log("Received blob:", {
        size: blob.size,
        type: blob.type,
      });

      if (!blob || blob.size === 0) {
        throw new Error("Received empty file from server");
      }

      // Create a filename for the download
      const originalName = file.name.split(".").slice(0, -1).join(".");
      const filename = `${originalName}_converted.${convertToFormat.toLowerCase()}`;

      console.log("Initiating download for:", filename);

      // Use the downloadBlob utility function
      const url = URL.createObjectURL(blob);
      setUploadedFiles((prev) => [
        ...prev,
        {
          url,
          name: filename,
          size: (blob.size / 1024).toFixed(2) + " KB",
          format: convertToFormat.toUpperCase(),
        },
      ]);
      console.log("Download initiated");
      setIsConverted(true);
      // resetFileInput();
      // resetState();
    } catch (error) {
      console.error("Conversion error:", error);
      let errorMessage = "An error occurred during conversion";

      if (error.message) {
        if (error.message.includes("NetworkError")) {
          errorMessage = "Failed to connect to the server. Please try again.";
        } else if (error.message.includes("404")) {
          errorMessage = "Server endpoint not found. Please try again later.";
        } else {
          errorMessage = error.message;
        }
      }

      setShowErr(errorMessage);
    } finally {
      setIsLoading(false);
      // resetFileInput();
      // resetState();
    }
  };

  return (
    <section className="flex flex-col items-center gap-8 py-16 overflow-y-auto overflow-x-hidden max-h-[90dvh]">
      <div className="heading flex flex-col items-center gap-4">
        <h1 className="text-4xl font-medium text-center">
          Convert your images to any Format you want
        </h1>
        <p className="text-[16px]  font-[400]  text-center">
          Easily change your images into any popular format.Fast, simple, and
          lossless <br /> conversion for all your needs.
        </p>
      </div>

      <div className="files-management relative w-full flex items-start">
        <div
          className={`drag-drop-container z-10 flex flex-col items-center justify-center gap-4 w-1/2 pt-16 pb-12 px-16 mt-12 rounded-xl border-2 border-dashed mx-auto ${
            isLoading
              ? "cursor-not-allowed opacity-70"
              : "cursor-pointer opacity-100"
          }
          ${isLoading ? 'hover:border-black' : 'hover:border-indigo-600'}`}
          onClick={
            !isLoading ? () => document.getElementById("file").click() : null
          }
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {!selectedImg && <Upload />}

          {selectedImg && (
            <img
              src={selectedImg}
              alt="Selected"
              className="w-50 h-50 object-cover rounded-md"
            />
          )}

          <div className={`select-file flex gap-4 items-center mt-4 `}>
            <input
              type="file"
              id="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const selectedFile = e.target.files[0];
                handleFileSelect(selectedFile);
              }}
            />
            <span className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:brightness-90 active:brightness-80 transition-all duration-150">
              Upload Image
            </span>
            <span id="file-name" className="text-[16px]  text-gray-800">
              {truncateFileName(selectedImgDetails.name)}
            </span>
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
                      setOpenMenuFormats(!openMenuFormats);
                    }}
                    type="button"
                    className="text-lg font-medium border-indigo-700 border pl-4 pr-2 py-2 rounded-lg flex items-center hover:bg-black/5 cursor-pointer transition-all duration-100"
                  >
                    {convertToFormat || "to..."}
                    <Dropdown
                      className={`transition-transform duration-200 ${
                        openMenuFormats ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              {openMenuFormats && (
                <div className="absolute mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
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
                              setOpenMenuFormats(false);
                            }}
                          >
                            {format}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {droppedFiles > 1 && (
          <div className="dropped-files absolute right-1 top-24 border max-w-2/9 w-fit h-fit px-4 py-2 flex gap-2 flex-wrap">
            {droppedFiles}
          </div>
        )}
      </div>
      
      {showErr && (
        <span className="text-red-500 text-sm font-[400] mt-2">{showErr}</span>
      )}

      {/* {!isConverted  && ( */}
      <button
        type="button"
        onClick={handleConverting}
        className={`submit px-6 py-2.5 rounded-lg text-lg bg-indigo-600 text-white hover:brightness-90 active:brightness-80 transition-all duration-150 ${
          isLoading
            ? "brightness-80 hover:brightness-80 active:brightness-80 cursor-not-allowed"
            : ""
        } `}
      >
        {" "}
        {isLoading ? "Converting..." : "Convert Image"}
      </button>
      {/* )} */}

      {uploadedFiles.length > 0 && (
        <div className="w-full flex flex-col max-w-4xl gap-6 mt-10">
          {uploadedFiles.map((file) => (
            <div
              key={file.url}
              className="relative group bg-white rounded-lg shadow-md flex flex-col items-center "
            >
              <ConvertedImg
                convertedImage={selectedImg}
                ImageName={file.name}
                ImageSize={file.size}
                imgHref={file.url}
                DownloadImg={file.name}
                OnClick={() => handleDelete(file.url)}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
// convertedImage={file.url}
// ImageName={file.name}
// ImageSize={file.size}
// imgHref={file.url}
// DownloadImg={file.name}
// OnClick={() => handleDelete(file.url)}
