import React, { useState, useRef } from 'react';
import Image from 'next/image';

import playIcon from '../assets/play_button.svg';
import stopIcon from '../assets/stop_button.svg';

const LiveRadioButton = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handlePlayPause = () => {
    if (!isPlaying) {
      // Play the audio stream
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      // Pause the audio stream
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="radio-button-container">
      <audio ref={audioRef} src="https://kioskradiobxl.out.airtime.pro/kioskradiobxl_b" />
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
