import { useState } from "react";
import Upload from "./Icons/upload.jsx";

const UpscalerSection = () => {

  const [selectedImg, setSelectedImg] = useState(null);

  return (
    <section className="flex flex-col items-center gap-8 pt-16">
      <header className="headers flex flex-col gap-2">
        <h1 className="text-4xl font-roboto font-medium text-center">
          {" "}
          Start upscaling your image
        </h1>
        <p className="text-[16px] font-roboto font-medium text-center">
          Upload your image and start upscaling
        </p>
      </header>

      <div 
        className="drag-drop-container flex flex-col items-center justify-center w-2/5 py-8 px-16 mt-16 rounded-xl border-2 border-dashed hover:border-indigo-600 mx-auto cursor-pointer"
        onClick={() => document.getElementById('file').click()}
      >
        <Upload />
        <div className="select-file flex gap-4 items-center mt-4">
          <input 
            type="file" 
            id="file" 
            className="hidden" 
            accept="image/*"
            onChange={(e) => {
              const fileName = e.target.files[0]?.name || 'No file selected';
              document.getElementById('file-name').textContent = fileName;
              }}
          />
          <span className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:brightness-90 active:brightness-80 transition-all duration-150">
            Choose File
          </span>
          <span id="file-name" className="text-[16px] font-roboto text-gray-600">
            No file selected
          </span>
        </div>
      </div>
      <button
        type="submit"
        className="submit px-6 py-3 rounded-lg text-lg bg-indigo-600 text-white hover:brightness-90 active:brightness-80 transition-all duration-150"
      >
        upscale image
      </button>
    </section>
  );
};

export default UpscalerSection;
