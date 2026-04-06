"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  ButtonGroup,
  Slider,
} from "@heroui/react";
import {
  FaPlay,
  FaPause,
  FaStop,
  FaVolumeUp,
  FaStepForward,
  FaStepBackward,
  FaRandom,
} from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import { ImageNavbar } from "../ImageNavbar";
import VolumeSetting from "./volume";
import { motion } from "framer-motion";
import { getPlayList } from "@/actions";

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

type Track = {
  id: number;
  name: string;
  videoId: string;
};

const opts = {
  height: "0",
  width: "0",
  playerVars: {
    autoplay: 0 as 0 | 1 | undefined,
    controls: 0 as 0 | 1 | undefined,
    disablekb: 1 as 0 | 1 | undefined,
    modestbranding: 1 as 1 | undefined,
  },
};

export const ImageAudio = () => {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [playList, setPlayList] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const tracks = await getPlayList();
        setPlayList(tracks);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadTracks();
  }, []);

  const loadTrack = (index: number) => {
    if (!player || playList.length === 0) return;

    const track = playList[index];
    if (!track) return;

    player.loadVideoById(track.videoId);
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const changeTrack = (direction: "next" | "prev") => {
    if (playList.length === 0) return;

    let newIndex = currentTrackIndex;

    if (shuffle) {
      if (playList.length === 1) {
        newIndex = 0;
      } else {
        do {
          newIndex = Math.floor(Math.random() * playList.length);
        } while (newIndex === currentTrackIndex);
      }
    } else {
      newIndex =
        direction === "next"
          ? (currentTrackIndex + 1) % playList.length
          : (currentTrackIndex - 1 + playList.length) % playList.length;
    }

    loadTrack(newIndex);
  };

  const toggleShuffle = () => {
    setShuffle((prev) => !prev);
  };

  const onReady = async (event: { target: YouTubePlayer }) => {
    setPlayer(event.target);
    const total = await event.target.getDuration();
    setDuration(total);
  };

  const onStateChange = async (event: {
    data: number;
    target: YouTubePlayer;
  }) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      setTimeout(() => {
        changeTrack("next");
      }, 500);
    } else if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      const total = await event.target.getDuration();
      setDuration(total);
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
      intervalRef.current = setInterval(() => {
        void updateTime();
      }, 500);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, player]);

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

  const currentThumbnail = playList[currentTrackIndex]?.videoId
    ? `https://img.youtube.com/vi/${playList[currentTrackIndex].videoId}/hqdefault.jpg`
    : "";

  if (loading) {
    return (
      <button className="cursor-pointer inline-block p-2 rounded-full border-2 border-transparent opacity-60">
        <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
      </button>
    );
  }

  if (playList.length === 0) return null;

  return (
    <>
      <div className="hidden">
        <YouTube
          videoId={playList[0].videoId}
          opts={opts}
          onReady={onReady}
          onStateChange={onStateChange}
        />
      </div>

      <Dropdown>
        <DropdownTrigger>
          <button className="cursor-pointer inline-block p-2 rounded-full border-2 border-transparent hover:border-blue-400 transition-all duration-300 focus:outline-none focus:ring-0">
            <motion.div
              animate={{
                scale: isPlaying ? [1, 1.05, 1] : 1,
                opacity: isPlaying ? 1 : 0.5,
              }}
              transition={{
                scale: {
                  repeat: isPlaying ? Infinity : 0,
                  repeatType: "loop",
                  duration: 1.13,
                },
                opacity: { duration: 0.5 },
              }}
            >
              <ImageNavbar thumbnail={currentThumbnail} />
            </motion.div>
          </button>
        </DropdownTrigger>

        <DropdownMenu
          aria-label="Music Controls"
          color="primary"
          closeOnSelect={false}
        >
          <DropdownItem key="player" variant="faded">
            <div className="text-center mb-2 font-bold text-sm">
              {playList[currentTrackIndex]?.name}
            </div>

            <Slider
              aria-label="Music progress"
              className="max-w-md"
              color="primary"
              minValue={0}
              maxValue={duration}
              value={currentTime}
              onChange={handleSeek}
              size="sm"
            />

            <div className="text-center my-2 text-xs">
              <p>
                {formatTime(currentTime)} / {formatTime(duration)}
              </p>
            </div>

            <ButtonGroup className="flex justify-center">
              <Button
                onPress={() => changeTrack("prev")}
                size="sm"
                variant="ghost"
              >
                <FaStepBackward />
              </Button>

              <Button
                onPress={togglePlayPause}
                color="primary"
                variant="shadow"
                size="lg"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </Button>

              <Button
                onPress={() => changeTrack("next")}
                size="sm"
                variant="ghost"
              >
                <FaStepForward />
              </Button>

              <Button
                onPress={toggleShuffle}
                color={shuffle ? "primary" : "default"}
                size="sm"
                variant={shuffle ? "solid" : "ghost"}
              >
                <FaRandom />
              </Button>
            </ButtonGroup>

            <div className="mt-4">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    fullWidth
                    variant="flat"
                    startContent={<FaVolumeUp />}
                  >
                    Volumen
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Volume Control">
                  <DropdownItem key="volume">
                    <VolumeSetting
                      onChange={handleVolumeChange}
                      volume={volume}
                    />
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>

            <div className="mt-2">
              <Button
                fullWidth
                color="danger"
                variant="ghost"
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
