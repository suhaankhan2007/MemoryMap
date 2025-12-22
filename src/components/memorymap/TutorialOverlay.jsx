import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TutorialOverlay({ 
  targetRef, 
  onDismiss, 
  isDarkMode,
  title = "Welcome! 👋",
  message = "Click the Parse button below to analyze your code and visualize how memory works!"
}) {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const updatePosition = () => {
      if (targetRef?.current) {
        const rect = targetRef.current.getBoundingClientRect();
        setPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
        if (rect.width > 0 && rect.height > 0) {
          setIsReady(true);
        }
      }
    };

    // Initial delay to ensure DOM is ready
    const initialDelay = setTimeout(updatePosition, 100);
    
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    const interval = setInterval(updatePosition, 100);

    return () => {
      clearTimeout(initialDelay);
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
      clearInterval(interval);
    };
  }, [targetRef]);

  // Don't render until we have valid position
  if (!isReady) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999]">
        {/* Overlay backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        />

        {/* Highlighted button cutout effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{
            position: 'fixed',
            top: position.top - 6,
            left: position.left - 6,
            width: position.width + 12,
            height: position.height + 12,
          }}
          className="pointer-events-none"
        >
          {/* Pulsing glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-lg bg-yellow-400/50 blur-md"
          />
          
          {/* Animated border */}
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0 2px rgba(250, 204, 21, 0.8)',
                '0 0 0 4px rgba(250, 204, 21, 0.4)',
                '0 0 0 2px rgba(250, 204, 21, 0.8)',
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-lg border-2 border-yellow-400 bg-transparent"
          />
        </motion.div>

        {/* Animated arrow pointing UP to the button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: [0, -8, 0],
          }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ 
            opacity: { duration: 0.3, delay: 0.2 },
            y: { 
              duration: 1, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }
          }}
          style={{
            position: 'fixed',
            top: position.top + position.height + 8,
            left: position.left + position.width / 2,
            transform: 'translateX(-50%)',
          }}
          className="pointer-events-none"
        >
          <svg width="40" height="50" viewBox="0 0 40 50" fill="none" className="drop-shadow-lg">
            <path 
              d="M20 50 L20 15 M8 25 L20 10 L32 25" 
              stroke="#facc15" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* Tooltip card - positioned BELOW the button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          style={{
            position: 'fixed',
            top: position.top + position.height + 70,
            left: Math.max(160, Math.min(position.left + position.width / 2, window.innerWidth - 160)),
            transform: 'translateX(-50%)',
          }}
          className={`${
            isDarkMode 
              ? 'bg-gray-800 border-yellow-500/50 text-gray-100' 
              : 'bg-white border-yellow-400/50 text-gray-800'
          } rounded-2xl shadow-2xl border-2 p-5 w-[300px]`}
        >
          {/* Close button */}
          <button
            onClick={onDismiss}
            className={`absolute -top-3 -right-3 w-8 h-8 rounded-full ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            } flex items-center justify-center transition-colors shadow-lg border ${
              isDarkMode ? 'border-gray-600' : 'border-gray-200'
            }`}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${
                isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'
              }`}>
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <h3 className={`font-bold text-lg ${
                  isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                }`}>
                  {title}
                </h3>
                <p className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Let's get started
                </p>
              </div>
            </div>
            
            <p className={`text-sm leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {message}
            </p>

            <div className={`flex items-center gap-2 text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <MousePointerClick className="w-4 h-4" />
              <span>Click anywhere to dismiss</span>
            </div>

            <Button
              onClick={onDismiss}
              size="sm"
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-900 font-semibold shadow-lg"
            >
              Got it! ✨
            </Button>
          </div>

          {/* Arrow pointing UP from tooltip to button */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className={`w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] ${
              isDarkMode ? 'border-b-gray-800' : 'border-b-white'
            }`} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

