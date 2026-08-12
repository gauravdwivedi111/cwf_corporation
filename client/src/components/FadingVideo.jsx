import React, { useEffect, useRef, useState } from 'react';

/**
 * Atmospheric video background component with automatic fade in on load,
 * fade out near the end, and seamless cycling/looping animations.
 */
export default function FadingVideo({ src, className, style }) {
  const videoRef = useRef(null);
  const [currentSrcIndex, setCurrentSrcIndex] = useState(0);

  const srcArray = Array.isArray(src) ? src : [src];
  const activeSrc = srcArray[currentSrcIndex];

  const isFadingIn = useRef(false);
  const isFadingOut = useRef(false);

  const fadeIn = () => {
    if (!videoRef.current || isFadingIn.current) return;
    isFadingIn.current = true;
    isFadingOut.current = false;
    let start = null;
    const duration = 500;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = Math.min(progress / duration, 1);
      
      if (videoRef.current && isFadingIn.current) {
        videoRef.current.style.opacity = opacity;
        if (progress < duration) {
          requestAnimationFrame(step);
        } else {
          isFadingIn.current = false;
        }
      }
    };
    requestAnimationFrame(step);
  };

  const fadeOut = (callback) => {
    if (!videoRef.current || isFadingOut.current) return;
    isFadingOut.current = true;
    isFadingIn.current = false;
    let start = null;
    const duration = 550;
    const initialOpacity = parseFloat(videoRef.current.style.opacity || '1');

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = Math.max(initialOpacity - (progress / duration) * initialOpacity, 0);

      if (videoRef.current && isFadingOut.current) {
        videoRef.current.style.opacity = opacity;
        if (progress < duration) {
          requestAnimationFrame(step);
        } else {
          isFadingOut.current = false;
          if (callback) callback();
        }
      }
    };
    requestAnimationFrame(step);
  };

  const handleLoadedData = () => {
    fadeIn();
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const remaining = video.duration - video.currentTime;
    if (remaining <= 0.55 && !isFadingOut.current && video.currentTime > 0.5) {
      fadeOut();
    }
  };

  const handleEnded = () => {
    if (srcArray.length === 1) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().then(() => {
          fadeIn();
        }).catch(() => {});
      }
    } else {
      fadeOut(() => {
        setCurrentSrcIndex((prev) => (prev + 1) % srcArray.length);
      });
    }
  };

  useEffect(() => {
    setCurrentSrcIndex(0);
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={activeSrc}
      className={className}
      style={{
        opacity: 0,
        ...style
      }}
      autoPlay
      muted
      playsInline
      preload="auto"
      onLoadedData={handleLoadedData}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
    />
  );
}
