import { useState } from "react";
import Upload from "./Icons/upload.jsx";

const UpscalerSection = () => {

  const [selectedImg, setSelectedImg] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const [showErr, setShowErr] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleUpscaling = () => {
    if (selectedImg === null) {
      setShowErr("Please select an image to upscale.");
      return;
    }else { 
      setShowErr(''); 
      setIsLoading(true);
      fetchUpscaleImage();
    }
    
    // Example: Log the selected image URL
    console.log("Upscaling image:", selectedImg);
  }
  const fetchUpscaleImage = async () => {
    try {
      const response = await fetch("https://api.example.com/upscale", {
        method: "POST",
        body: JSON.stringify({ image: selectedImg }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upscale image");
      }

      const data = await response.json();
      console.log("Upscaled image data:", data);
      // Handle the upscaled image data
    } catch (error) {
      console.error("Error upscaling image:", error);
    }
  };


  return (
    <section className="flex flex-col items-center gap-4 pt-16">
      <header className="headers flex flex-col gap-4">
        <h1 className="text-4xl  font-medium text-center">
          {" "}
          Start upscaling your image
        </h1>
        <p className="text-[16px]  font-[400]  text-center">
          Enhance image resolution with AI-powered upscaling. Get sharper, clearer images without losing quality.
        </p>
      </header>

      <div 
        className={`drag-drop-container flex flex-col items-center justify-center gap-4 w-1/2 pt-16 pb-12 px-16 mt-12 rounded-xl border-2 border-dashed hover:border-indigo-600 mx-auto  ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer opacity-100'}`}
        onClick={!isLoading ? () => document.getElementById('file').click() : null}
      >
        {!selectedImg && (
          <Upload />)}

        {selectedImg && (
          <img src={selectedImg} alt="Selected" className="w-50 h-50 object-cover rounded-md" />
        )}

        <div className={`select-file flex gap-4 items-center mt-4 ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer opacity-100'}`}>
          <input 
            type="file" 
            id="file" 
            className="hidden" 
            accept="image/*"
            onChange={(e) => {
              const selectedFile = e.target.files[0] ;
              console.log(fileName);
              setFileName(selectedFile.name)
              setSelectedImg(URL.createObjectURL(selectedFile));
              console.log(selectedImg);
              }}
          />
          <span className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:brightness-90 active:brightness-80 transition-all duration-150">
            Choose File
          </span>
          <span id="file-name" className="text-[16px]  text-gray-800">
            {fileName}
          </span>
        </div>

          <p className="text-sm text-gray-500 mt-2">Supported formats: JPG, PNG, WEBP, BMP, TIFF, GIF </p>
      </div>

      {selectedImg === null ?  <span className="text-red-500 text-sm font-[400] mt-2"> {showErr} </span> : '' }

      <button
        type="submit"
        onClick={handleUpscaling}
        className={`submit px-6 py-2.5 rounded-lg text-lg hover:brightness-90 active:brightness-80 transition-all duration-150 ${isLoading ?  'bg-indigo-600 text-white brightness-90 active:brightness-80' : 'bg-indigo-600 text-white '}`}
      >
        {isLoading ? 'Upscaling...' : 'Upscale Image'}
      </button>
    </section>
  );
};

export default UpscalerSection;
