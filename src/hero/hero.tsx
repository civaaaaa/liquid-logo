'use client';

import { useEffect, useState } from 'react';
import { defaultParams, type ShaderParams } from './params';
import { Canvas } from './canvas';

interface HeroProps {
  imageId: string; // kept for compatibility, not used
}

type State = ShaderParams & {
  background: string;
};

const defaultState: State = { ...defaultParams, background: 'metal' };

export function Hero({ imageId }: HeroProps) {
  const [state] = useState<State>(defaultState);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [processing, setProcessing] = useState<boolean>(true);

  // Always load your local PNG logo from /public/logo.png
  useEffect(() => {
    let cancelled = false;

    async function updateImageData() {
      try {
        setProcessing(true);

        const res = await fetch('/logo.png'); // 🔥 your logo
        const blob = await res.blob();
        const bitmap = await createImageBitmap(blob);

        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(bitmap, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);

        if (!cancelled) {
          setImageData(data);
          setProcessing(false);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) setProcessing(false);
      }
    }

    updateImageData();

    return () => {
      cancelled = true;
    };
  }, []); // no deps – always same logo

  return (
    <div className="flex items-center justify-center px-32">
      <div
        className="flex aspect-square w-full max-w-[400px] items-center justify-center rounded-10"
        style={{ background: '#000000' }} // solid black background
      >
        <div className="aspect-square w-400">
          {imageData && (
            <Canvas imageData={imageData} params={state} processing={processing} />
          )}
        </div>
      </div>
    </div>
  );
}
