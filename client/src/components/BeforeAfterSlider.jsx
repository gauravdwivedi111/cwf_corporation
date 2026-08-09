import React, { useState, useRef, useEffect } from 'react';

/**
 * Draggable Before/After Image Comparison Slider component.
 * Supports mouse drag and touch swipe events for responsive mobile operation.
 * Uses custom clip-path properties to sweep over image layer nodes.
 */
export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = 'Water leakage state before treatment',
  afterAlt = 'Waterproofed state after treatment',
}) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage: 0 to 100
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  // Computes positioning and boundaries
  const handlePositionMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    if (e.touches && e.touches[0]) {
      handlePositionMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    handlePositionMove(e.clientX);
  };

  const handleDragStart = (e) => {
    e.preventDefault(); // Stop standard image drag ghosting
    isDragging.current = true;
  };

  const handleTouchStart = () => {
    isDragging.current = true;
  };

  useEffect(() => {
    const handleGlobalDragEnd = () => {
      isDragging.current = false;
    };

    window.addEventListener('mouseup', handleGlobalDragEnd);
    window.addEventListener('touchend', handleGlobalDragEnd);

    return () => {
      window.removeEventListener('mouseup', handleGlobalDragEnd);
      window.removeEventListener('touchend', handleGlobalDragEnd);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="ba-slider-container"
      onMouseDown={handleDragStart}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      style={{ '--clip-pos': `${sliderPosition}%` }}
    >
      {/* Before state image layer */}
      <img
        src={beforeImage}
        alt={beforeAlt}
        className="ba-image ba-image-before"
        draggable={false}
      />
      <div className="ba-label ba-label-before">Before Treatment</div>

      {/* After state image layer (Clipped) */}
      <img
        src={afterImage}
        alt={afterAlt}
        className="ba-image ba-image-after"
        draggable={false}
      />
      <div className="ba-label ba-label-after">After Treatment</div>

      {/* Sliding bar control indicator */}
      <div className="ba-handle">
        <div className="ba-handle-button" aria-hidden="true">
          &harr;
        </div>
      </div>
    </div>
  );
}
