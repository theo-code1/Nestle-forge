import React, { useState, useRef } from "react";
import Delete from "./Icons/Delete";
import Upload from "./Icons/Upload";
import { removeBackground } from "../utils/api";

const BgRemoverSection = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // File object
  const [processedImage, setProcessedImage] = useState(null); // URL for processed image
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [animationBefore, setAnimationBefore] = useState(false);
  const [showErr, setShowErr] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImagePreview(URL.createObjectURL(file));
      setSelectedImage(file);
      setProcessedImage(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImagePreview(URL.createObjectURL(file));
      setSelectedImage(file);
      setProcessedImage(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveBg = async () => {
    if (!selectedImage) return;
    setLoading(true);
    try {
      const result = await removeBackground(selectedImage);
      setProcessedImage(result.url);
      setAnimationBefore(true);
    } catch (err) {
      setShowErr("Image resolution is not good");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImagePreview(null);
    setSelectedImage(null);
    setProcessedImage(null);
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "bg-removed.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="flex flex-col items-center gap-2 py-14 overflow-y-auto overflow-x-hidden h-screen">
      <div className="headers flex flex-col gap-4">
        <h1 className="text-4xl text-black text-center font-medium">
          Instant Background Removal
        </h1>
        <p className="text-[16px] text-center">
          Automatically erase backgrounds from any image. Get clean, transparent
          cutouts in
          <br />
          just seconds.
        </p>
      </div>
      <div
        className={`drag-drop-container relative z-10 flex flex-col items-center justify-center gap-4 w-1/2 ${imagePreview ? "border-2 border-transparent  border-solid" : "border-2 pt-10 pb-10 px-16 hover:border-indigo-600  border-dashed"} mt-16 rounded-xl mx-auto cursor-pointer`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={!imagePreview ? handleClick : undefined}
      >
        <input
          type="file"
          id="file"
          className="hidden"
          accept="image/*"
          multiple={false}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {imagePreview ? (
          <div className="before-after relative flex flex-col items-center justify-center w-full h-full">
            <div
              className={`${animationBefore && processedImage ? "img-layer overflow-hidden" : ""} relative w-full max-h-[50dvh] flex items-center justify-center`}
              // onAnimationEnd={() => setAnimationBefore(false)}
            >
              <img
                src={imagePreview}
                alt="Uploaded Preview"
                className={`min-w-fit max-h-[50dvh] object-cover shadow select-none rounded-lg`}
              />
            </div>

            {processedImage && (
              <img
                src={processedImage}
                alt="Result Preview"
                className="absolute left-1/2 top-0 -translate-x-1/2 min-w-fit min-h-full object-cover shadow select-none rounded-lg"
              />
            )}
          </div>
        ) : (
          <>
            <div className="text-center flex flex-col items-center gap-4 mb-2">
              <Upload
                size={`6rem`}
                className="p-4 bg-[#67A1FE]/60 rounded-full"
              />
              <div className="drag-info">
                <h3 className="text-xl font-medium text-gray-800 ">
                  Drop your images here
                </h3>
                <p className="text-gray-600 text-sm mb- ">
                  or click to browse files
                </p>
              </div>
              <p className="text-xs text-gray-500">
                Supports: PNG, JPG, JPEG, GIF, BMP, WEBP, TIFF, ICO, AVIF
              </p>
            </div>
            <span className="bg-[#3582FD] text-white px-4 py-2 mt-2 rounded-xl hover:brightness-90 active:brightness-80 transition-all duration-150">
              Upload Image
            </span>
          </>
        )}
      </div>

      {showErr !== "" && imagePreview && (
        <span className="text-red-500 text-sm mt-4">{showErr}</span>
      )}

      <div className="buttons flex items-center justify-center gap-4 mt-16 mx-auto">
        {!processedImage && imagePreview && (
          <>
            <button
              type="button"
              className={`order-2 px-6 py-3 text-lg bg-[#3582FD] text-white rounded-lg disabled:bg-[#3582FD]/70 disabled:cursor-not-allowed`}
              onClick={handleRemoveBg}
              disabled={loading}
            >
              {loading ? "Processing..." : "Remove Background"}
            </button>
          </>
        )}
        {imagePreview && (
          <button
            className="order-1 text-3xl bg-white text-red-500 cursor-pointer border-2 border-black/20 px-3 py-2 hover:shadow-[0_2px_15px_0_#0000001a] rounded-lg transition-all duration-100"
            onClick={handleRemoveImage}
          >
            <Delete />
          </button>
        )}

        {processedImage && (
          <button
            type="button"
            className="order-3 px-6 py-3 text-lg bg-[#3582FD] text-white rounded-lg"
            onClick={handleDownload}
          >
            Download
          </button>
        )}
      </div>
      {/* </div> */}
    </section>
  );
};

export default BgRemoverSection;
