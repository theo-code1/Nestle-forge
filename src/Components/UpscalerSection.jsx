import React, { useState } from "react";
import axios from "axios";

function UpscalerSection() {
  const [file, setFile] = useState(null);
  const [scale, setScale] = useState(4); // default 4x
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setErrorMsg("");
    setImageUrl(null);

    try {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload a JPG, PNG, or WebP image.');
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File is too large. Maximum size is 10MB.');
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("scale", scale);

      // Upload the image
      const uploadRes = await axios.post("http://localhost:8000/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { id } = uploadRes.data;
      if (!id) {
        throw new Error('No job ID received from server');
      }

      // Start polling for status
      const pollStatus = async () => {
        try {
          const statusRes = await axios.get(`http://localhost:8000/status/${id}`);
          const { state, upscaled_image_url, error } = statusRes.data;

          if (state === 'completed' && upscaled_image_url) {
            setImageUrl(upscaled_image_url);
            setLoading(false);
            return true;
          } else if (state === 'failed' || error) {
            throw new Error(error || 'Upscaling failed');
          }
          // If still processing, continue polling
          return false;
        } catch (err) {
          console.error('Polling error:', err);
          throw err;
        }
      };

      // Initial delay before first poll
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Poll with exponential backoff
      let attempts = 0;
      const maxAttempts = 10;
      let isDone = false;

      while (!isDone && attempts < maxAttempts) {
        try {
          isDone = await pollStatus();
          if (isDone) break;
          
          // Increase delay between attempts (exponential backoff with jitter)
          const delay = Math.min(1000 * Math.pow(2, attempts) + Math.random() * 1000, 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
          attempts++;
        } catch (err) {
          console.error('Polling failed:', err);
          throw err;
        }
      }

      if (!isDone) {
        throw new Error('Upscaling is taking longer than expected. Please try again later.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      let errorMessage = 'An error occurred';
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
        
        errorMessage = err.response.data?.detail || 
                     err.response.data?.error || 
                     err.response.statusText || 
                     `Server responded with status ${err.response.status}`;
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error:', err.message);
        errorMessage = err.message || 'An unknown error occurred';
      }
      
      setErrorMsg(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-white flex flex-col items-center justify-center px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-center text-indigo-400">AI Image Upscaler</h1>
      <div className="w-full max-w-xl bg-gray-800 p-6 rounded-2xl shadow-xl">

        <div className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
          />

          <select
  value={scale}
  onChange={(e) => setScale(Number(e.target.value))} // ensure scale is number
            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600"
          >
            <option value={2}>Upscale ×2</option>
            <option value={4}>Upscale ×4</option>
          </select>

          <button
            onClick={handleUpload}
            className="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-medium transition"
            disabled={loading || !file}
          >
            {loading ? "Upscaling..." : "Upload and Upscale"}
          </button>

          {errorMsg && <p className="text-red-400 text-sm text-center">{errorMsg}</p>}
        </div>

        {imageUrl && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-semibold text-green-400 mb-2">Upscaled Image</h2>
            <img src={imageUrl} alt="Upscaled" className="rounded-xl shadow-md w-full" />
            <a href={imageUrl} download className="inline-block mt-4 text-indigo-400 hover:underline">
              ⬇ Download Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpscalerSection;
