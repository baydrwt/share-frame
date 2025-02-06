import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicVideos, selectLoadingVideos, selectPublicVideos } from "../reducers/video/videoReducer";
import { AppDispatch } from "../reducers/store";
import Layout from "../components/Layout";
import { FaPlay } from "react-icons/fa";
import ReactPlayer from "react-player";
import VideoSlider from "../components/Slider";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

const Home: React.FC = () => {
  const publicVideos = useSelector(selectPublicVideos);
  const isLoading = useSelector(selectLoadingVideos);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchPublicVideos());
  }, []);
  return (
    <Layout>
      <div className="heroSection relative w-full h-[80vh] m-0 p-0">
        {!isPlaying && (
          <div className="absolute flex flex-col justify-center items-center top-0 left-0 w-full h-full bg-gradient-to-tr from-black to-gray-700" style={{ zIndex: 5 }}>
            <h1 className="text-4xl font-bold capitalizae mb-4 md:text-5xl text-transparant bg-clip-text bg-gradient-to-r from-yellow-400 via-red-300 to-yellow-800">ShareFrame with AWS 3S Bucket</h1>
            <p className="text-lg mb-6 md:text-xl text-center font-extralight text-white">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
            <button
              className="bg-blue-500 text-white flex items-center justify-center w-16 h-16 rounded-full transition duration-300 ease-in-out hover:bg-blue-700 hover:shadow-lg hover:scale-105 transform animate-scale-pulse"
              onClick={() => setIsPlaying(true)}
            >
              <FaPlay className="text-4xl" />
            </button>
            <button className="bg-blue-500 text-white px-6 py-3 mt-4 rounded shadow-lg hover:bg-blue-200 hover:cursor-pointer transition duration-300" onClick={() => setIsPlaying(true)}>
              Watch Now
            </button>
          </div>
        )}
        <div className={`absolute top-0 left-0 w-full h-full ${isPlaying ? "block" : "hidden"}`} style={{ zIndex: isPlaying ? 0 : 1 }}>
          <ReactPlayer url={"https://www.youtube.com/watch?v=bZxXAoyQwAY&ab_channel=RadityaDika"} controls width={"100%"} height={"100%"} playing={isPlaying} />
        </div>
      </div>
      <main className="w-[95vw]">
        <h2 className="capitalize text-textTwo text-lg sm:text-2xl md:text-3xl lg:text-4xl mt-2 p-4">Recently added</h2>
        {isLoading ? (
          <div className="w-full mb-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} height={250} width={220} />
            ))}
          </div>
        ) : (
          <div className="p-4">
            <VideoSlider videos={publicVideos} />
          </div>
        )}
      </main>
    </Layout>
  );
};

export default Home;
