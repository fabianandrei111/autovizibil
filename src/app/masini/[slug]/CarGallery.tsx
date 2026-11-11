'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function CarGallery({ images, carName }: { images: string[]; carName: string }) {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="aspect-[16/10] bg-surface-dark rounded-xl flex items-center justify-center text-text-lighter">
        Fara imagini
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-surface-dark cursor-pointer" onClick={() => setFullscreen(true)}>
          <Image src={images[active]} alt={carName} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" priority />
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {active + 1} / {images.length}
          </div>
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {images.map((img, i) => (
              <button key={i} onClick={() => setActive(i)} className={`relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${i === active ? 'border-accent' : 'border-transparent'}`}>
                <Image src={img} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen */}
      {fullscreen && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center" onClick={() => setFullscreen(false)}>
          <button className="absolute top-4 right-4 text-white text-3xl z-10" onClick={() => setFullscreen(false)}>&times;</button>
          {images.length > 1 && (
            <>
              <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl z-10" onClick={e => { e.stopPropagation(); setActive(a => (a - 1 + images.length) % images.length); }}>&lsaquo;</button>
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl z-10" onClick={e => { e.stopPropagation(); setActive(a => (a + 1) % images.length); }}>&rsaquo;</button>
            </>
          )}
          <Image src={images[active]} alt={carName} fill className="object-contain p-8" sizes="100vw" />
        </div>
      )}
    </>
  );
}
