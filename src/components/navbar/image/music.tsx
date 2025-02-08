'use client';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  ButtonGroup,
  Slider,
} from '@heroui/react';
import {
  FaPlay,
  FaPause,
  FaStop,
  FaVolumeUp,
  FaStepForward,
  FaStepBackward,
  FaRandom,
} from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import YouTube, { YouTubePlayer } from 'react-youtube';
import { ImageNavbar } from '../ImageNavbar';
import VolumeSetting from './volume';
import { motion } from 'framer-motion';

declare global {
  interface Window {
    YT: {
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
  }
}

const PLAYLIST = [
  { id: 'Fl0YWLT6iFE', title: 'METAMORPHOSIS 2' },
  { id: '317RHaFF7Xk', title: 'METAMORPHOSIS' },
  { id: 'b95JTn8j7cM', title: 'RAPTURE' },
  { id: 'q0Kxangw3-w', title: 'Bonetrousle - UNDERTALE' },
];

export const ImageAudio = () => {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [playlist, setPlaylist] = useState(PLAYLIST);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 0 as 0 | 1 | undefined,
      controls: 0 as 0 | 1 | undefined,
      disablekb: 1 as 0 | 1 | undefined,
      modestbranding: 1 as 1 | undefined,
    },
  };

  const loadTrack = (index: number) => {
    if (player) {
      player.loadVideoById(playlist[index].id);
      setCurrentTrackIndex(index);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  };

  const changeTrack = (direction: 'next' | 'prev') => {
    let newIndex = currentTrackIndex;

    if (shuffle) {
      newIndex = Math.floor(Math.random() * playlist.length);
    } else {
      newIndex =
        direction === 'next'
          ? (currentTrackIndex + 1) % playlist.length
          : (currentTrackIndex - 1 + playlist.length) % playlist.length;
    }

    loadTrack(newIndex);
  };
  const toggleShuffle = () => {
    if (!shuffle) {
      const shuffled = [...PLAYLIST].sort(() => Math.random() - 0.5);
      setPlaylist(shuffled);
      setCurrentTrackIndex(0);
    } else {
      const originalIndex = PLAYLIST.findIndex(
        (track) => track.id === playlist[currentTrackIndex].id
      );
      setPlaylist(PLAYLIST);
      setCurrentTrackIndex(originalIndex);
    }
    setShuffle(!shuffle);
  };

  const onReady = async (event: { target: YouTubePlayer }) => {
    setPlayer(event.target);
    const duration = await event.target.getDuration();
    setDuration(duration);
  };

  const onStateChange = async (event: {
    data: number;
    target: YouTubePlayer;
  }): Promise<void> => {
    if (event.data === window.YT.PlayerState.ENDED) {
      setTimeout(() => {
        changeTrack('next');
      }, 500);
    } else if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      const currentDuration = await event.target.getDuration();
      setDuration(currentDuration);
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (!player) return;

    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const stopSound = () => {
    if (player) {
      player.stopVideo();
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (player) {
      player.setVolume(newVolume);
      setVolume(newVolume);
    }
  };

  const handleSeek = (value: number | number[]) => {
    const seekTime = Array.isArray(value) ? value[0] : value;
    if (player) {
      player.seekTo(seekTime, true);
      setCurrentTime(seekTime);
    }
  };

  useEffect(() => {
    const updateTime = async () => {
      if (isPlaying && player) {
        const time = await player.getCurrentTime();
        setCurrentTime(time);
      }
    };

    if (isPlaying) {
      intervalRef.current = setInterval(updateTime, 500);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, player]);

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${String(
      Math.floor(seconds % 60)
    ).padStart(2, '0')}`;
  };
  const currentThumbnail = `https://img.youtube.com/vi/${playlist[currentTrackIndex].id}/hqdefault.jpg`;

  return (
    <>
      <div className='hidden'>
        <YouTube
          videoId={PLAYLIST[0].id}
          opts={opts}
          onReady={onReady}
          onStateChange={onStateChange}
        />
      </div>
      <Dropdown>
        <DropdownTrigger>
          <button className='cursor-pointer inline-block p-2 rounded-full border-2 border-transparent hover:border-blue-400 transition-all duration-300 focus:outline-none focus:ring-0'>
            <motion.div
              animate={{
                scale: isPlaying ? [1, 1.05, 1] : 1,
                opacity: isPlaying ? 1 : 0.5,
              }}
              transition={{
                scale: {
                  repeat: isPlaying ? Infinity : 0,
                  repeatType: 'loop',
                  duration: 1.13,
                },
                opacity: {
                  duration: 0.5,
                },
              }}
            >
              <ImageNavbar thumbnail={currentThumbnail} />
            </motion.div>
          </button>
        </DropdownTrigger>

        <DropdownMenu
          aria-label='Music Controls'
          color='primary'
          closeOnSelect={false}
        >
          <DropdownItem key='player' variant='faded'>
            <div className='text-center mb-2 font-bold text-sm'>
              {playlist[currentTrackIndex].title}
            </div>

            <Slider
              aria-label='Music progress'
              className='max-w-md'
              color='primary'
              minValue={0}
              maxValue={duration}
              value={currentTime}
              onChange={handleSeek}
              size='sm'
            />

            <div className='text-center my-2 text-xs'>
              <p>
                {formatTime(currentTime)} / {formatTime(duration)}
              </p>
            </div>

            <ButtonGroup className='flex justify-center'>
              <Button
                onPress={() => changeTrack('prev')}
                size='sm'
                variant='ghost'
              >
                <FaStepBackward />
              </Button>

              <Button
                onPress={togglePlayPause}
                color='primary'
                variant='shadow'
                size='lg'
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </Button>

              <Button
                onPress={() => changeTrack('next')}
                size='sm'
                variant='ghost'
              >
                <FaStepForward />
              </Button>

              <Button
                onPress={toggleShuffle}
                color={shuffle ? 'primary' : 'default'}
                size='sm'
                variant={shuffle ? 'solid' : 'ghost'}
              >
                <FaRandom />
              </Button>
            </ButtonGroup>

            <div className='mt-4'>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    fullWidth
                    variant='flat'
                    startContent={<FaVolumeUp />}
                  >
                    Volumen
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label='Volume Control'>
                  <DropdownItem key='volume'>
                    <VolumeSetting
                      onChange={handleVolumeChange}
                      volume={volume}
                    />
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>

            <div className='mt-2'>
              <Button
                fullWidth
                color='danger'
                variant='ghost'
                onPress={stopSound}
                startContent={<FaStop />}
              >
                Detener
              </Button>
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};
