import { useVideos } from './hooks/useVideos';
import './App.css'
import { useState } from 'react'; 
import Header from './components/Header';
import { VideoList } from './components/VideoList';
import type { Video } from './types';
import { useFilteredVideos } from './hooks/useFilteredVideos';
import Loading from './components/Loading';
import { ErrorState } from './components/Error';
import Empty from './components/Empty';
const App = () => {

  // Filtering state
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  
  
  const { data, isLoading, error, refetch } = useVideos();
  const { finalFilteredVideos, dynamicYears, dynamicGenres } = useFilteredVideos({
    data,
    search,
    selectedYear,
    setSelectedYear,
    selectedGenreIds,
    setSelectedGenreIds
  });

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
    if(finalFilteredVideos.length === 0) {
      return <Empty message="No videos found" />;
    }
    return <VideoList videos={finalFilteredVideos as Video[]} />;
  }


  console.log("Render count", { 
    length: finalFilteredVideos.length, 
    isLoading,
    finalFilteredVideos
  });
  console.log("response", data);

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
