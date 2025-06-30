import { useState } from 'react';

export default function ImageConverter() {
  const [convertedUrl, setConvertedUrl] = useState(null);

  const convertToPNG = (file) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL('image/png');
        setConvertedUrl(pngUrl);
      };
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      convertToPNG(file);
    } else {
      alert('Please upload a valid image file.');
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Image to PNG Converter</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-6 block w-full max-w-xs text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
      />

      {convertedUrl && (
        <div className="flex flex-col items-center space-y-4">
          <img src={convertedUrl} alt="Converted" className="max-w-md rounded shadow" />
          <a
            href={convertedUrl}
            download="converted-image.png"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Download PNG
          </a>
        </div>
      )}
    </section>
  );
}
