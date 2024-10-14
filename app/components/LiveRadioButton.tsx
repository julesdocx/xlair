import React, { useState, useRef } from 'react';
import Image from 'next/image';

import playIcon from '../assets/play_button.svg';
import stopIcon from '../assets/stop_button.svg';

const LiveRadioButton = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="flex justify-center">
      <audio ref={audioRef} src="https://streaming.ritcs.be/stream1" />
      <button onClick={handlePlayPause} className="bg-green-200 p-2 pl-4 pr-4 rounded-xl hover:bg-green-300">
        {isPlaying ? (
          <div className="flex items-center text-black font-bold gap-2">
            Luister
            <Image src={stopIcon} alt="Stop Button" width={30} height={30} />
          </div>
        ) : (
          <div className="flex items-center text-black font-bold gap-2">
            Luister
            <Image src={playIcon} alt="Play Button" width={30} height={30} />
          </div>
        )}
      </button>

      <style></style>
    </div>
  );
};

export default LiveRadioButton;
