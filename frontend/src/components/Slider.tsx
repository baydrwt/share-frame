import React from "react";
import Slider from "react-slick";
import { IVideo } from "../reducers/video/videoReducer";
import HeroVideoCard from "./HeroVideoCard";

interface videoSliderProps {
  videos: IVideo[] | null;
}

const VideoSlider: React.FC<videoSliderProps> = ({ videos }) => {
  const sliderConfiguration = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <Slider {...sliderConfiguration}>
      {videos?.map((video) => (
        <HeroVideoCard key={video._id} video={video} />
      ))}
    </Slider>
  );
};

export default VideoSlider;
