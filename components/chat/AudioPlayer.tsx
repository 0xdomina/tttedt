
import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, ModernSpinnerIcon } from '../Icons';

interface AudioPlayerProps {
    audioUrl: string;
    duration: number;
}

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, duration }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handlePlaybackEnd = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };
        const handleCanPlay = () => setIsLoading(false);
        const handleWaiting = () => setIsLoading(true);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handlePlaybackEnd);
        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('waiting', handleWaiting);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handlePlaybackEnd);
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('waiting', handleWaiting);
        };
    }, []);
    
    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };
    
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="flex items-center gap-2 w-48">
            <audio ref={audioRef} src={audioUrl} preload="metadata" />
            <button onClick={togglePlay} className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full">
                {isLoading ? <ModernSpinnerIcon className="w-5 h-5 text-gray-600" /> : <PlayIcon className="w-5 h-5 text-gray-700" />}
            </button>
            <div className="flex-grow flex items-center gap-2">
                <div className="w-full bg-gray-300 rounded-full h-1.5">
                    <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="text-xs font-mono w-10 text-right">{formatTime(currentTime)}</span>
            </div>
        </div>
    );
};

export default AudioPlayer;
