// components/CameraCapture.jsx

import React, { useState, useRef, useEffect, useCallback } from 'react';

const CameraCapture = ({ onCapture }) => {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // This effect hook safely attaches the stream to the video element
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const startCamera = useCallback(async () => {
    // Clear any previous captures
    setCapturedImage(null);
    onCapture(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream); // This will trigger the useEffect above
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access the camera. Please check permissions in your browser settings.");
    }
  }, [onCapture]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);
        const imageFile = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(imageFile);
      }, 'image/jpeg');

      stopCamera();
    }
  };

  return (
    <div className="border p-4 rounded-lg bg-gray-50 text-center">
      {!stream && !capturedImage && (
        <button type="button" onClick={startCamera} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 font-semibold">
          Open Camera
        </button>
      )}

      {stream && (
        <div>
          {/* Removed the debugging border */}
          <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-lg mb-2" />
          <button type="button" onClick={takePicture} className="w-full mt-2 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 font-semibold">
            Take Picture
          </button>
        </div>
      )}

      {capturedImage && (
        <div>
          <p className="text-sm font-medium mb-2">Image Preview:</p>
          <img src={capturedImage} alt="Captured preview" className="w-full rounded-lg" />
          <button type="button" onClick={startCamera} className="w-full mt-2 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 font-semibold">
            Retake
          </button>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default CameraCapture;