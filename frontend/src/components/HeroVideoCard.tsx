import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggedInUser } from "../reducers/auth/authReducer";
import { IVideo } from "../reducers/video/videoReducer";
import ReactPlayer from "react-player";
import { FaDownload, FaExternalLinkAlt, FaPlay, FaShareAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import parse from "html-react-parser";
import { MdAccessTime } from "react-icons/md";

interface IVideoCard {
  video: IVideo;
}

const HeroVideoCard: React.FC<IVideoCard> = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const loggedInUser = useSelector(selectLoggedInUser);
  const dispatch = useDispatch();

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
    setIsHovered(true);
  };

  const handleShare = () => {
    const videoLink = `http://localhost:5173/video/${video._id}`;
    navigator.clipboard.writeText(videoLink).then(() => {
      toast.success("Link copied to clipboard");
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
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
      <div className="overflow-hidden mb-2 relative" style={{ width: "100&", height: "100%", cursor: "pointer" }}>
        <ReactPlayer url={video.path} light={video.thumbnail} width={"100%"} height={"100%"} controls={isPlaying} playing={isPlaying} onPause={() => setIsPlaying(false)} onPlay={() => setIsPlaying(true)} />
      </div>
      {!isPlaying && isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center transition-opacity duration-300">
          <FaPlay size={30} className="text-white cursor-pointer hover:text-gray-300 transition duration-300" />
          {<FaDownload size={30} className="text-white cursor-pointer absolute bottom-2 left-2 hover:text-gray-300 transition duration-300" />}
          <Link to={`video/${video._id}`}>
            <FaExternalLinkAlt size={30} className="text-blue-500 hove:text-blue-700 transition-colors duration-300" />
          </Link>
          <div className="absolute z-10 top-2 left-2 cursor-pointer" onClick={handleShare}>
            <FaShareAlt size={20} className="text-blue-500 hove:text-blue-700 transition-colors duration-300" />
          </div>
        </div>
      )}
      <div className="detailsContainer px-2">
        <h2 className="text-lg font-semibold">{video.title}</h2>
        <div className="flex justify-between items-center">
          <div className="text-gray-600 text-xs mb-1">
            {video.description ? <p className="truncate">{parse(video.description)}</p> : <p>Default description</p>}

            {duration > 0 && (
              <div className="text-gray-500 text-xs flex items-center gap-2 pb-2">
                <MdAccessTime size={30} />
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
