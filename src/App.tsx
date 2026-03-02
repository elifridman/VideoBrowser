import { useEffect, useState } from 'react';

import { useFetchVideosData } from './hooks/useFetchVideosData';
import { useFilteredVideos } from './hooks/useFilteredVideos';
import type { Video } from './types';
import Header from './components/Header/Header';
import VideoList from './components/VideoList/VideoList';
import Loading from './components/Loading/Loading';
import ErrorState from './components/Error/Error';
import Empty from './components/Empty/Empty';
import './App.css'
const App = () => {

  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  // State to track how many videos to display initially
  const [displayLimit, setDisplayLimit] = useState(12);

  const { data, isLoading, error, refetch } = useFetchVideosData();
  const { finalFilteredVideos, dynamicYears, dynamicGenres } = useFilteredVideos({
    data,
    search,
    selectedYear,
    setSelectedYear,
    selectedGenreIds,
    setSelectedGenreIds
  });

  // Reset the limit to 12 whenever the user filters or searches
  useEffect(() => {
    setDisplayLimit(12);
  }, [search, selectedYear, selectedGenreIds]);

  // Logic to slice the array
  const visibleVideos = finalFilteredVideos.slice(0, displayLimit);
  const hasMore = displayLimit < finalFilteredVideos.length;

  const loadMore = () => {
    setDisplayLimit((prev) => prev + 12);
  };

  const mainContent = () => {
    if (isLoading) {
      return <Loading />;
    }
    if (error) {
      return (
        <ErrorState
          message={error.message}
          retry={() => refetch()}
        />
      );
    }
    if (finalFilteredVideos.length === 0) {
      return <Empty
        message="No videos found" />;
    }
   
    return <VideoList
      videos={visibleVideos as Video[]}
      hasMore={hasMore}
      onLoadMore={loadMore} />;
  }

  return <div>
    <Header
      searchTerm={search}
      setSearchTerm={setSearch}
      selectedYear={selectedYear}
      setSelectedYear={setSelectedYear}
      selectedGenreId={selectedGenreIds}
      setSelectedGenreId={setSelectedGenreIds}
      years={dynamicYears}
      genres={dynamicGenres} />

    <main>
      {mainContent()}
    </main>
  </div>;
};

export default App;
