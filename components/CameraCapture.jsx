import React, { useState, useRef, useEffect, useCallback } from 'react';

const CameraCapture = ({ onCapture }) => {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Effect to handle the media stream lifecycle.
  // This is the primary change for better resource management.
  useEffect(() => {
    // If we have a stream, attach it to the video element.
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    // The cleanup function runs when the component unmounts or when the `stream` dependency changes.
    // It ensures that any existing stream is properly stopped.
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]); // The effect depends on the `stream` state.

  const startCamera = useCallback(async () => {
    // Clear any previous captures when starting the camera
    setCapturedImage(null);
    if (onCapture) onCapture(null);

    try {
      // Prioritize the back camera ('environment') for mobile devices
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access the camera. Please check permissions in your browser settings.");
    }
  }, [onCapture]);

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
        if (onCapture) onCapture(imageFile);

        // To stop the camera, we simply set the stream state to null.
        // The useEffect hook will detect this change and run its cleanup function to stop the tracks.
        setStream(null);
      }, 'image/jpeg');
    }
  };

  return (
    <div className="w-full rounded-lg border bg-gray-50 p-4 text-center">

      {/* --- Unified Preview Box --- */}
      <div className="flex h-80 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-black overflow-hidden">
        {!stream && !capturedImage && (
          <p className="text-gray-400">Camera preview will appear here</p>
        )}
        {stream && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
        )}
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured preview"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* --- Action Buttons --- */}
      <div className="mt-4">
        {!stream && !capturedImage && (
          <button type="button" onClick={startCamera} className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700">
            Open Camera
          </button>
        )}
        {stream && (
          <button type="button" onClick={takePicture} className="w-full rounded-lg bg-green-600 py-2.5 font-semibold text-white hover:bg-green-700">
            Take Picture
          </button>
        )}
        {capturedImage && (
          <button type="button" onClick={startCamera} className="w-full rounded-lg bg-yellow-500 py-2.5 font-semibold text-white hover:bg-yellow-600">
            Retake
          </button>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default CameraCapture;
