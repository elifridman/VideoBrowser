import { useVideos } from './hooks/useVideos';
import './App.css'
import { useState, useMemo, useEffect } from 'react';
import { useDebounce } from './hooks/useDebounce';
import Header from './components/Header';
import { VideoList } from './components/VideoList';
import type { RawVideo, Genre, Video } from './types';
const App = () => {

  const { data, isLoading, error } = useVideos();
  // Filtering state
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);

  const debouncedSearch = useDebounce<string>(search, 300);

  const normalizedVideos = useMemo(() => {
    if (!data?.videos) return [];
    
    return data.videos.map((v: RawVideo) => ({
      id: v.id,
      title: String(v.title || ""),
      artist: String(v.artist || ""),
      imageUrl: v.image_url,              
      releaseYear: Number(v.release_year),
      genreId: v.genre_id
    }));
  }, [data?.videos]);

  // STEP 1: Filter by Text Search ONLY 
  const searchFilteredBase = useMemo(() => {
    const term = debouncedSearch.toLowerCase();
    return normalizedVideos.filter(v => 
      v.title.toLowerCase().includes(term) || v.artist.toLowerCase().includes(term)
    );
  }, [normalizedVideos, debouncedSearch]);

  // STEP 2: Derive Dynamic Options
  const dynamicYears = useMemo(() => {
    const years = new Set(searchFilteredBase.map((v: Video) => v.releaseYear));
    return Array.from(years).sort((a, b) => b - a);
  }, [searchFilteredBase]);

  const dynamicGenres = useMemo(() => {
    // 1. Get all unique Genre IDs from the current search results
    const availableIds = Array.from(new Set(searchFilteredBase.map((v: Video) => v.genreId)));
  
    // 2. Map those IDs to their names, providing a fallback if the ID is missing from API
    return availableIds.map(id => {
      const foundGenre = data?.genres?.find((g: Genre) => Number(g.id) === Number(id));
      
      return {
        id: Number(id),
        // If found, use the name. If not, provide a clean fallback.
        name: foundGenre ? foundGenre.name : 'uncategorized' 
      };
    }).sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically for UX
  }, [data?.genres, searchFilteredBase]);

  // STEP 3: Final Combined Filtering (AND Logic)
  const finalFilteredVideos = useMemo(() => {
    return searchFilteredBase.filter(v => {
      // Matches Year (if selected)
      const matchesYear = selectedYear ? v.releaseYear === selectedYear : true;
      
      // Matches Genres (if any selected)
      const matchesGenre = selectedGenreIds.length > 0 
        ? selectedGenreIds.includes(v.genreId) 
        : true;
        
      return matchesYear && matchesGenre;
    });
  }, [searchFilteredBase, selectedYear, selectedGenreIds]);

  useEffect(() => {
    // If typing more letters makes the selected year impossible, reset it
    if (selectedYear && !dynamicYears.includes(selectedYear)) {
      setSelectedYear(null);
    }
    
    // If typing more letters makes selected genres impossible, remove them
    const validIds = new Set(dynamicGenres.map(g => g.id));
    setSelectedGenreIds(prev => {
      const filtered = prev.filter(id => validIds.has(id));
      return filtered.length === prev.length ? prev : filtered;
    });
  }, [dynamicYears, dynamicGenres]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
      <VideoList />
    </main>
  </div>;
};

export default App;
