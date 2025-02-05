import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { downloadVideo, IVideo } from "../reducers/video/videoReducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../reducers/store";
import { toast } from "sonner";
import parse from "html-react-parser";
import backendApi from "../api/backendApi";
import Layout from "../components/Layout";
import { FaDownload, FaPlay } from "react-icons/fa";
import ReactPlayer from "react-player";

const SingleVideo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<IVideo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      if (id) {
        await dispatch(downloadVideo({ id }));
        toast.success("Video downloaded");
      }
    } catch (error) {
      toast.error(`Error in downloading the video ${error}`);
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setIsLoading(true);
        const { data } = await backendApi.get(`/api/v1/fetch-single/${id}`);
        if (data.success) {
          setVideo(data.video);
        }
      } catch (error) {
        toast.error(`Error in showing the video ${error}`);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchVideo();
    }
  }, [id]);

  if (isLoading) return <p className="text-lg text-center">Loading...</p>;
  return (
    <Layout>
      <div className="relative w-full h-[69vh]">
        {video && !isPlaying && (
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black flex flex-col justify-center items-start p-8" style={{ zIndex: 5 }}>
            <h1 className="text-3xl font-bold text-white mb-4">{video.title}</h1>
            {video.description && <p>{parse(video.description)}</p>}
            <div className="flex space-x-4 mt-4">
              <button
                className="bg-blue-500 text-white w-16 h-16 rounded-full flex justify-center items-center transition duration-300 animate-scale-pulse ease-in-out hover:bg-blue-700 hover:shadow-lg hover:scale-105 transform"
                onClick={() => setIsPlaying(true)}
              >
                <FaPlay className="text-4xl" />
              </button>
              <button
                className={`bg-green-500 text-white w-16 h-16 rounded-full flex justify-center items-center transition duration-300 ease-in-out transform  ${
                  isDownloading ? "cursor-not-allowed opacity-50" : "hover:bg-green-700 hover:shadow-lg hover:scale-105"
                }`}
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <p>
                    <svg className="animate-spin mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    </svg>
                  </p>
                ) : (
                  <FaDownload className="text-xl" />
                )}
              </button>
            </div>
          </div>
        )}
        {video && (
          <div className={`relative w-full h-full ${isPlaying ? "flex justify-center items-center" : "pt-12"}`} style={{ zIndex: isPlaying ? 0 : 1 }}>
            <ReactPlayer url={video.path} controls width={"100%"} height={"100%"} className="absolute top-0 left-0" playing={isPlaying} />
            {isPlaying && (
              <button className={`bg-green-500 absolute top-4 right-4 text-white w-16 h-16 rounded-full flex justify-center items-center transition duration-300 ease-in-out transform`} onClick={handleDownload}>
                {isDownloading ? (
                  <p>
                    <svg className="animate-spin mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    </svg>
                  </p>
                ) : (
                  <FaDownload className="text-xl" />
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SingleVideo;
