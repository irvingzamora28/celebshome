import { useState, useEffect } from 'react';

interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
  isPortrait: boolean;
}

export function useImageDimensions(src: string): ImageDimensions | null {
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      setDimensions({
        width: img.width,
        height: img.height,
        aspectRatio,
        isPortrait: img.height > img.width
      });
    };
    img.src = src;
  }, [src]);

  return dimensions;
}
