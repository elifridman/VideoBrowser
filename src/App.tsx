import { useVideos } from './hooks/useVideos';
import './App.css'
import { useState, useMemo } from 'react';
import {useDebounce} from './hooks/useDebounce';
const App = () => {

  const { data, isLoading, error } = useVideos();
  // Filtering state
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);

  const debouncedSearch = useDebounce<string>(search, 300);

  // STEP 1: Filter by Text Search ONLY 
  const searchFilteredBase = useMemo(() => {
    if (!data?.videos) return [];
    if (!debouncedSearch) return data.videos;

    const term = search.toLowerCase();
    return data.videos.filter(v => 
      v.title.toLowerCase().includes(term) || 
      v.artist.toLowerCase().includes(term)
    );
  }, [data, debouncedSearch]);

  // STEP 2: Derive Dynamic Options
  const dynamicYears = useMemo(() => {
    const years = searchFilteredBase.map(v => v.release_year);
    return [...new Set(years)].sort((a, b) => b - a);
  }, [searchFilteredBase]);

  const dynamicGenres = useMemo(() => {
    // Find which genre IDs exist in the current search base
    const availableGenreIds = new Set(searchFilteredBase.map(v => v.genre_id));
    // Filter the master genre list to only show these
    return (data?.genres || []).filter(g => availableGenreIds.has(g.id));
  }, [data, searchFilteredBase]);

  // STEP 3: Final Combined Filtering (AND Logic)
  const finalFilteredVideos = useMemo(() => {
    return searchFilteredBase.filter(v => {
      const matchesYear = selectedYear ? v.release_year === selectedYear : true;
      const matchesGenre = selectedGenreIds.length > 0 
        ? selectedGenreIds.includes(v.genre_id) 
        : true;
      return matchesYear && matchesGenre;
    });
  }, [searchFilteredBase, selectedYear, selectedGenreIds]);

  // Reset Year/Genre if they are no longer available in the dynamic lists
  // (Optional but good UX: if user types something that makes the selected y

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(data);

  return <div>App Component</div>;
};

export default App;
