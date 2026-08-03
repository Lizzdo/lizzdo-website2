import { useEffect, useState, MouseEvent, TouchEvent, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import VideoPlayer, { parseVideoUrl } from './VideoPlayer';

export type LightboxMedia = {
  type: 'image' | 'video';
  url: string;
};

interface LightboxProps {
  images: (string | LightboxMedia)[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function Lightbox({ images, initialIndex = 0, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const normalizedMedia = useMemo(() => {
    if (!images) return [];
    return images.map(img => {
      if (typeof img === 'string') {
        const parsed = parseVideoUrl(img);
        return { type: parsed ? 'video' : 'image', url: img } as LightboxMedia;
      }
      return img as LightboxMedia;
    });
  }, [images]);

  // Sync state if initialIndex changes when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Handle scroll lock and keyboard events
  useEffect(() => {
    if (!isOpen) return;
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev === 0 ? normalizedMedia.length - 1 : prev - 1));
      }
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev === normalizedMedia.length - 1 ? 0 : prev + 1));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, normalizedMedia.length, onClose]);

  const handlePrev = (e: MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? normalizedMedia.length - 1 : prev - 1));
  };

  const handleNext = (e: MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === normalizedMedia.length - 1 ? 0 : prev + 1));
  };

  // Mobile swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndY, setTouchEndY] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchEndY(null);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !touchStartY || !touchEndY) return;
    const distanceX = touchStart - touchEnd;
    const distanceY = touchStartY - touchEndY;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;

    if (Math.abs(distanceY) > Math.abs(distanceX) && isDownSwipe) {
      onClose();
      return;
    }

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (isLeftSwipe) {
        setCurrentIndex((prev) => (prev === normalizedMedia.length - 1 ? 0 : prev + 1));
      }
      if (isRightSwipe) {
        setCurrentIndex((prev) => (prev === 0 ? normalizedMedia.length - 1 : prev - 1));
      }
    }
  };

  if (!normalizedMedia || normalizedMedia.length === 0 || typeof document === 'undefined') return null;

  const currentMedia = normalizedMedia[currentIndex];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
          onClick={onClose}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <button 
            type="button"
            aria-label="Close Lightbox"
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-neon-pink text-white flex items-center justify-center transition-colors z-[110] cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X size={24} />
          </button>
          
          <div className="w-full h-full relative flex items-center justify-center pointer-events-none">
            {normalizedMedia.length > 1 && (
              <>
                <button 
                  type="button"
                  aria-label="Previous item"
                  className="absolute left-2 md:left-6 w-12 h-12 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all z-[110] pointer-events-auto cursor-pointer"
                  onClick={handlePrev}
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  type="button"
                  aria-label="Next item"
                  className="absolute right-2 md:right-6 w-12 h-12 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all z-[110] pointer-events-auto cursor-pointer"
                  onClick={handleNext}
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="max-w-full max-h-full flex items-center justify-center pointer-events-auto w-full px-4"
              onClick={(e) => e.stopPropagation()}
            >
              {currentMedia.type === 'video' ? (
                <VideoPlayer 
                  url={currentMedia.url} 
                  autoPlay={true}
                  className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-black"
                />
              ) : (
                <img 
                  src={currentMedia.url} 
                  alt={`Gallery media ${currentIndex + 1}`}
                  className="max-w-full max-h-[85vh] object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.8)] cursor-default rounded-xl"
                />
              )}
            </motion.div>
            
            {normalizedMedia.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-white font-mono text-sm tracking-widest pointer-events-auto">
                {currentIndex + 1} / {normalizedMedia.length}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
