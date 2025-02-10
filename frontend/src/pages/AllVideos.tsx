import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../reducers/store";
import { fetchPublicVideos, searchVideos, selectLoadingVideos, selectPublicVideos, selectSearchVideos } from "../reducers/video/videoReducer";
import HeroVideoCard from "../components/HeroVideoCard";
import Skeleton from "react-loading-skeleton";

const AllVideos: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const isLoading = useSelector(selectLoadingVideos);
  const searchResults = useSelector(selectSearchVideos);
  const dispatch = useDispatch<AppDispatch>();
  const publicVideos = useSelector(selectPublicVideos);

  const handleSearch = () => {
    setSearchTerm(query);
  };

  const handleEnterPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSearch();
    }
  };

  useEffect(() => {
    if (searchTerm) {
      dispatch(searchVideos(searchTerm));
    }
    dispatch(fetchPublicVideos());
  }, [searchTerm]);
  return (
    <Layout>
      <div className="w-full p-4">
        <main className="w-[95vw]">
          <div className="mt-3 px-3 w-full flex justify-center">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-8/12 block rounded-full p-2 focus:outline-none border border-black focus:border-none focus:outline-blue-600 bg-bgOne"
              onKeyDown={handleEnterPress}
            />
            <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full" onClick={handleSearch}>
              Search
            </button>
          </div>
          <div className="mt-7">
            {searchTerm && searchResults ? (
              searchResults?.length > 0 ? (
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults?.map((video) => (
                    <HeroVideoCard key={video._id} video={video} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-2xl font-bold w-full">Video not found.</p>
              )
            ) : isLoading ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(8)].map((_, index) => (
                  <Skeleton key={index} height={300} width={200} className="rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                {publicVideos?.map((video, index) => (
                  <HeroVideoCard key={index} video={video} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default AllVideos;
