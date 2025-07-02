import { useEffect, useState } from "react";
import Upload from "./Icons/upload.jsx";

const UpscalerSection = () => {

  const [selectedImg, setSelectedImg] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const [showErr, setShowErr] = useState('');

  const handleUpscaling = () => {
    // Handle the upscaling logic here
    if (!selectedImg) {
      setShowErr("Please select an image to upscale.");
      return;
    }else { setShowErr(''); }
    
    // Example: Log the selected image URL
    console.log("Upscaling image:", selectedImg);
  }

  // useEffect(() => {

  //   // Check if an image is selected
  //   if(!selectedImg){
  //     setShowErr( "Please select an image to upscale.")
  //     // console.error(showErr);
  //     return;
  //   } else{
  //     setShowErr('')
  //   }
  // }, [selectedImg]);

  return (
    <section className="flex flex-col items-center gap-4 pt-16">
      <header className="headers flex flex-col gap-4">
        <h1 className="text-4xl  font-medium text-center">
          {" "}
          Start upscaling your image
        </h1>
        <p className="text-[16px]  font-[400]  text-center">
          upscale, enhance, optimize, and transform. Totally free to use, no subscriptions or hidden fees.
        </p>
      </header>

      <div 
        className="drag-drop-container flex flex-col items-center justify-center gap-4 w-1/2 pt-16 pb-12 px-16 mt-12 rounded-xl border-2 border-dashed hover:border-indigo-600 mx-auto cursor-pointer"
        onClick={() => document.getElementById('file').click()}
      >
        {!selectedImg && (
          <Upload />)}

        {selectedImg && (
          <img src={selectedImg} alt="Selected" className="w-40 h-40 object-cover rounded-lg" />
        )}

        <div className="select-file flex gap-4 items-center mt-4">
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

      <span className="text-red-500 text-sm font-[400] mt-2"> {showErr} </span> 

      <button
        type="submit"
        onClick={handleUpscaling}
        className="submit px-6 py-2.5 rounded-lg text-lg bg-indigo-600 text-white hover:brightness-90 active:brightness-80 transition-all duration-150"
      >
        upscale image
      </button>
    </section>
  );
};

export default UpscalerSection;
