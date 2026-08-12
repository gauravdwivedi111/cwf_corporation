import React from 'react';
import { Layers, ArrowDown, Bath, Waves, Building, Zap } from 'lucide-react';

/**
 * Renders bold geometric Lucide icons for waterproofing categories.
 * Recolored dynamically depending on container contexts.
 * 
 * @param {string} category - Slug identifier of the service category
 * @param {number} size - Square dimension in pixels
 */
export default function CategoryIcon({ category, size = 24 }) {
  const iconColor = 'currentColor';

  switch (category) {
    case 'terrace-waterproofing':
      return <Layers size={size} color={iconColor} style={{ display: 'block' }} />;
    case 'basement-waterproofing':
      return <ArrowDown size={size} color={iconColor} style={{ display: 'block' }} />;
    case 'bathroom-waterproofing':
      return <Bath size={size} color={iconColor} style={{ display: 'block' }} />;
    case 'water-tank-sealing':
      return <Waves size={size} color={iconColor} style={{ display: 'block' }} />;
    case 'facade-sealing':
      return <Building size={size} color={iconColor} style={{ display: 'block' }} />;
    case 'injection-grouting':
    default:
      return <Zap size={size} color={iconColor} style={{ display: 'block' }} />;
  }
}
