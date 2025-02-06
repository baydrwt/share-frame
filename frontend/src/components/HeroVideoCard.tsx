import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { downloadVideo, IVideo } from "../reducers/video/videoReducer";
import ReactPlayer from "react-player";
import { FaDownload, FaExternalLinkAlt, FaPlay, FaShareAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import parse from "html-react-parser";
import { MdAccessTime } from "react-icons/md";
import { AppDispatch } from "../reducers/store";

interface IVideoCard {
  video: IVideo;
}

const HeroVideoCard: React.FC<IVideoCard> = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
    setIsHovered(true);
  };

  const handleShare = () => {
    const videoLink = `https://share-frame.vercel.app/video/${video._id}`;
    navigator.clipboard.writeText(videoLink).then(() => {
      toast.success("Link copied to clipboard");
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      await dispatch(downloadVideo({ id: video._id }));
    } catch (error) {
      toast.error(`Error in downloading the video ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (video.path) {
      const videoElement = videoRef.current;
      if (videoElement) {
        videoElement.onloadedmetadata = () => {
          setDuration(videoElement.duration);
        };
      }
    }
  }, [video.path]);

  return (
    <div className="heroVideoCard flex flex-col gap-3 relative bg-white rounded-md m-2 h-52" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <video src={video.path} style={{ display: "none" }} preload="metadata" ref={videoRef} />
      <div className="overflow-hidden mb-2 relative" style={{ width: "100%", height: "180px", cursor: "pointer" }}>
        <ReactPlayer url={video.path} light={video.thumbnail} width={"100%"} height={"100%"} controls={isPlaying} playing={isPlaying} onPause={() => setIsPlaying(false)} onPlay={() => setIsPlaying(true)} />
        {!isPlaying && isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center transition-opacity duration-300">
            <FaPlay size={30} className="text-white cursor-pointer hover:text-gray-300 transition duration-300" onClick={handlePlayPause} />
            {isLoading ? (
              <p className="text-white cursor-pointer absolute bottom-2 left-2 hover:text-gray-300 transition duration-200">Downloading ....</p>
            ) : (
              <FaDownload size={20} className="text-white cursor-pointer absolute bottom-2 left-2 hover:text-gray-300 transition duration-200" onClick={handleDownload} />
            )}
            <Link to={`video/${video._id}`}>
              <FaExternalLinkAlt size={20} className="text-white cursor-pointer absolute top-2 right-2 hover:text-gray-300 transition duration-200" />
            </Link>
            <div className="absolute z-10 top-2 left-2 cursor-pointer" onClick={handleShare}>
              <FaShareAlt size={20} className="text-blue-500 hover:text-blue-700 transition-colors duration-200" />
            </div>
          </div>
        )}
      </div>

      <div className="detailsContainer px-2">
        <h2 className="text-lg font-semibold">{video.title}</h2>
        <div className="userContainer flex justify-between items-center">
          <div className="text-gray-600 text-xs mb-1 flex justify-between items-cente w-full pb-2">
            {video.description ? <p className="flex items-center">{parse(video.description)}</p> : <p>Default description</p>}

            {duration > 0 && (
              <div className="text-gray-500 text-xs flex items-center gap-2 ">
                <MdAccessTime size={20} />
                <p>{formatDuration(duration)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroVideoCard;
