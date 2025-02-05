import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../reducers/store";
import { fetchPublicVideos, selectPublicVideos } from "../reducers/video/videoReducer";
import HeroVideoCard from "../components/HeroVideoCard";

const AllVideos: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const publicVideos = useSelector(selectPublicVideos);

  useEffect(() => {
    dispatch(fetchPublicVideos());
  }, []);
  return (
    <Layout>
      <div className="w-full p-4">
        <main className="w-[95vw]">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {publicVideos?.map((video) => (
              <HeroVideoCard key={video._id} video={video} />
            ))}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default AllVideos;
