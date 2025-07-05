import { useState, useEffect } from "react";
import Upload from "./Icons/Upload.jsx";
import { convertImage } from "../utils/api";
import ConvertedImg from "./ConvertedImg.jsx";
// import FaTrash from "./Icons/Delete.jsx";



export default function ConverterSection() {
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedImgDetails, setSelectedImgDetails] = useState({
    name: "No file selected",
    format: "No format selected",
    size: "",
  });
  const [isConverted, setIsConverted] = useState(false)
  const [showErr, setShowErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [droppedFiles, setDroppedFiles] = useState([]);
  const [allUploadedImages, setAllUploadedImages] = useState([]);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      droppedFiles.forEach(file => {
        URL.revokeObjectURL(file.url);
      });
    };
  }, [droppedFiles]);



  const handleDelete = (url) => {
    setUploadedFiles((prev) => {
      const filtered = prev.filter((file) => file.url !== url);
      // Clean up object URL
      const removed = prev.find((file) => file.url === url);
      if (removed) URL.revokeObjectURL(removed.url);
      return filtered;
    });
  };

  // const handleSelectDroppedFile = (droppedFile) => {
  //   handleFileSelect(droppedFile.file);
  //   // Don't clear droppedFiles - let user manage them manually
  // };

  // const handleRemoveDroppedFile = (id) => {
  //   setDroppedFiles((prev) => {
  //     const filtered = prev.filter((file) => file.id !== id);
  //     // Clean up object URL
  //     const removed = prev.find((file) => file.id === id);
  //     if (removed) URL.revokeObjectURL(removed.url);
  //     return filtered;
  //   });
  // };

  const updateImageFormat = (imageId, format) => {
    setAllUploadedImages(prev => 
      prev.map(img => 
        img.id === imageId 
          ? { ...img, convertToFormat: format }
          : img
      )
    );
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    const fileFormat = file.type.split("/")[1].toUpperCase();
    const imageUrl = URL.createObjectURL(file);
    const imageDetails = {
      name: file.name,
      format: fileFormat,
      size: (file.size / 1024).toFixed(2) + " KB",
    };
    
    setSelectedImgDetails(imageDetails);
    setSelectedImg(imageUrl);
    setIsConverted(false); // Reset conversion status for new image

    // Add to all uploaded images
    setAllUploadedImages(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      url: imageUrl,
      details: imageDetails,
      file: file,
      convertToFormat: ""
    }]);

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
    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    
    if (imageFiles.length === 0) {
      setShowErr("Please select valid image files.");
      return;
    }

    // Handle all files (single or multiple) by adding them directly to allUploadedImages
    imageFiles.forEach(file => {
      const fileFormat = file.type.split("/")[1].toUpperCase();
      const imageUrl = URL.createObjectURL(file);
      const imageDetails = {
        name: file.name,
        format: fileFormat,
        size: (file.size / 1024).toFixed(2) + " KB",
      };
      
      setAllUploadedImages(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        url: imageUrl,
        details: imageDetails,
        file: file,
        convertToFormat: ""
      }]);
    });

    setShowErr("");
  };

  const handleConverting = async (imageId) => {
    // Reset any previous errors and states
    setShowErr("");
    setIsLoading(true);

    // Find the image to convert
    const imageToConvert = allUploadedImages.find(img => img.id === imageId);
    if (!imageToConvert) {
      setShowErr("Image not found.");
      setIsLoading(false);
      return;
    }

    // Check if same format
    if (
      imageToConvert.details.format.toLowerCase() === imageToConvert.convertToFormat.toLowerCase()
    ) {
      setShowErr("Please select a different format to convert.");
      setIsLoading(false);
      return;
    }

    try {
      // Validate inputs
      if (!imageToConvert.convertToFormat) {
        throw new Error("Please select a target format.");
      }

      console.log(
        "Starting conversion for file:",
        imageToConvert.details.name,
        "to format:",
        imageToConvert.convertToFormat
      );

      const blob = await convertImage(imageToConvert.file, imageToConvert.convertToFormat);

      console.log("Received blob:", {
        size: blob.size,
        type: blob.type,
      });

      if (!blob || blob.size === 0) {
        throw new Error("Received empty file from server");
      }

      // Create a filename for the download
      const originalName = imageToConvert.details.name.split(".").slice(0, -1).join(".");
      const filename = `${originalName}_converted.${imageToConvert.convertToFormat.toLowerCase()}`;

      console.log("Initiating download for:", filename);

      // Store the converted file URL in the image object
      const convertedUrl = URL.createObjectURL(blob);
      setAllUploadedImages(prev => 
        prev.map(img => 
          img.id === imageId 
            ? { 
                ...img, 
                convertedUrl: convertedUrl,
                convertedName: filename,
                convertedSize: (blob.size / 1024).toFixed(2) + " KB",
                isConverted: true
              }
            : img
        )
      );
      console.log("Conversion completed");
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
      setIsConverted(true)
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
          <Upload />

          <div className={`select-file flex gap-4 items-center mt-4 `}>
            <input
              type="file"
              id="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);
                const imageFiles = files.filter(file => file.type.startsWith("image/"));
                
                if (imageFiles.length === 0) {
                  setShowErr("Please select valid image files.");
                  return;
                }

                // Handle all files (single or multiple) by adding them directly to allUploadedImages
                imageFiles.forEach(file => {
                  const fileFormat = file.type.split("/")[1].toUpperCase();
                  const imageUrl = URL.createObjectURL(file);
                  const imageDetails = {
                    name: file.name,
                    format: fileFormat,
                    size: (file.size / 1024).toFixed(2) + " KB",
                  };
                  
                  setAllUploadedImages(prev => [...prev, {
                    id: Math.random().toString(36).substr(2, 9),
                    url: imageUrl,
                    details: imageDetails,
                    file: file,
                    convertToFormat: ""
                  }]);
                });

                setShowErr("");
              }}
            />
            <span className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:brightness-90 active:brightness-80 transition-all duration-150">
              Upload Image
            </span>
            {/* <span id="file-name" className="text-[16px]  text-gray-800">
              {truncateFileName(selectedImgDetails.name)}
            </span> */}
          </div>
          
        </div>


      </div>
      
      {showErr && (
        <span className="text-red-500 text-sm font-[400] mt-2">{showErr}</span>
      )}

      {allUploadedImages.length > 0 && (
        <div className="w-full flex flex-col max-w-4xl gap-6 mt-10">
          {allUploadedImages.map((image) => (
            <div
              key={image.id}
              className="relative group bg-white rounded-lg shadow-md flex flex-col items-center"
            >
              <ConvertedImg
                isConverted={image.isConverted || false}
                isLoading={isLoading}
                selectedImgDetails={image.details}
                selectedImg={image.url}
                setConvertToFormat={(format) => updateImageFormat(image.id, format)}
                convertToFormat={image.convertToFormat}
                handleConverting={() => handleConverting(image.id)}
                convertedImage={image.url}
                ImageName={image.details.name}
                ImageSize={image.details.size}
                imgHref={image.convertedUrl || ""}
                DownloadImg={image.convertedName || ""}
                handleDelete={() => {
                  // Remove this image from the list
                  setAllUploadedImages(prev => prev.filter(img => img.id !== image.id));
                  // Clean up the object URLs
                  URL.revokeObjectURL(image.url);
                  if (image.convertedUrl) {
                    URL.revokeObjectURL(image.convertedUrl);
                  }
                }}
              />
            </div>
          ))}
        </div>
      )}


    </section>
  );
}
