"use client";

import { Button, ButtonGroup, Slider } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import { motion } from "framer-motion";
import {
  FaPlay,
  FaPause,
  FaStop,
  FaVolumeUp,
  FaStepForward,
  FaStepBackward,
  FaRandom,
} from "react-icons/fa";

import { ImageNavbar } from "../ImageNavbar";
import VolumeSetting from "./volume";
import { getPlayList } from "@/actions";
import Dropdown from "../dropdown/Dropdown";

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
        setCurrentTrackIndex(0);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void loadTracks();
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
      <button className="inline-block cursor-pointer rounded-full border-2 border-transparent p-2 opacity-60">
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-300" />
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

      <Dropdown backdrop="blur" placement="bottom end" closeOnSelect={false}>
        <Dropdown.Trigger>
          <button className="inline-block cursor-pointer rounded-full border-2 border-transparent p-2 transition-all duration-300 hover:border-blue-400 focus:outline-none focus:ring-0">
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
        </Dropdown.Trigger>

        <Dropdown.Menu
          ariaLabel="Music Controls"
          color="primary"
          className="w-[360px]"
          closeOnSelect={false}
        >
          <Dropdown.Section>
            <div className="flex flex-col gap-1 px-2 py-3">
              <div className="text-center text-base font-bold">
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

              <div className="text-center text-xs">
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

              <div className="pt-2">
                <Dropdown backdrop="blur" closeOnSelect={false}>
                  <Dropdown.Trigger>
                    <Button
                      fullWidth
                      variant="flat"
                      startContent={<FaVolumeUp />}
                      className="justify-start w-full"
                    >
                      Volumen
                    </Button>
                  </Dropdown.Trigger>

                  <Dropdown.Menu
                    ariaLabel="Volume Control"
                    className="w-[220px]"
                  >
                    <Dropdown.Section>
                      <div className="px-2 py-2">
                        <VolumeSetting
                          onChange={handleVolumeChange}
                          volume={volume}
                        />
                      </div>
                    </Dropdown.Section>
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              <div className="pt-2">
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
            </div>
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};
