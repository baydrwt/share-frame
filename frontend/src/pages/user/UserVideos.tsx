import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserVideos, selectUserVideos } from "../../reducers/video/videoReducer";
import SideBar from "../../components/SideBar";
import { AppDispatch } from "../../reducers/store";
import { useConfig } from "../../customHooks/useConfigHook";
import VideoCard from "../../components/VideoCard";

const UserVideos: React.FC = () => {
  const userVideos = useSelector(selectUserVideos);
  const dispatch = useDispatch<AppDispatch>();
  const { configWithJWT } = useConfig();

  useEffect(() => {
    dispatch(fetchUserVideos({ configWithJwt: configWithJWT }));
  }, []);

  return (
    <div className="flex w-full gap-2 ">
      <SideBar />
      <main className="flex-1 ml-4 lg:ml-[17rem] pr-2 z-10">
        <section className="p-4 mt-3">
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
            {userVideos?.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserVideos;
