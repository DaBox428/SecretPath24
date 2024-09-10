import React, { useState, useRef, useEffect } from 'react';

const CustomAudioPlayer = ({ src, isVisible, onPlay, onPause, autoPlay}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (src) {
      audioRef.current.load();
    }
  }, [src]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    if (onPlay) onPlay();
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (onPause) onPause();
  };

  if (!src || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 flex items-center bg-white p-4 rounded-lg shadow-md">
      <audio
        ref={audioRef}
        src={src}
        autoPlay={autoPlay}
        onPlay={handlePlay}
        onPause={handlePause}
      />
      <button
        onClick={togglePlayPause}
        className="bg-[#121212] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
      >
        <span style={{ fontSize: '24px', fontFamily: 'Segoe UI Symbol' }}>
          {isPlaying ? '\u23F8\uFE0E' : '\u25B6'}
        </span>
      </button>
    </div>
  );
};

export default CustomAudioPlayer;