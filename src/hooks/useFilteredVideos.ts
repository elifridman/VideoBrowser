import { useMemo, useEffect } from 'react';
import type { RawVideo, Genre, Video } from '../types';
import { useDebounce } from './useDebounce';

interface UseFilteredVideosProps {
  data: { videos: RawVideo[]; genres: Genre[] } | undefined;
  search: string;
  selectedYear: number | null;
  setSelectedYear: (year: number | null) => void;
  selectedGenreIds: number[];
  setSelectedGenreIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const useFilteredVideos = ({
  data,
  search,
  selectedYear,
  setSelectedYear,
  selectedGenreIds,
  setSelectedGenreIds
}: UseFilteredVideosProps) => {
  const debouncedSearch = useDebounce<string>(search, 300);

  // map the raw data to the client format
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

  // Base Filter - Search
  const searchFilteredBase = useMemo(() => {
    const term = debouncedSearch.toLowerCase();
    return normalizedVideos.filter((v: Video) => 
      v.title.toLowerCase().includes(term) || v.artist.toLowerCase().includes(term)
    );
  }, [normalizedVideos, debouncedSearch]);

  // Dynamic Options
  const dynamicYears = useMemo(() => {
    const years = new Set(searchFilteredBase.map((v: Video) => v.releaseYear));
    return Array.from(years).sort((a, b) => b - a);
  }, [searchFilteredBase]);

  // Dynamic Genres
  const dynamicGenres = useMemo(() => {
    const availableIds = Array.from(new Set(searchFilteredBase.map(v => v.genreId)));
    return availableIds.map(id => {
      const foundGenre = data?.genres?.find((g: Genre) => Number(g.id) === Number(id));
      return {
        id: Number(id),
        name: foundGenre ? foundGenre.name : 'uncategorized'
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [data?.genres, searchFilteredBase]);

  // Combined Filtering - AND Logic
  const finalFilteredVideos = useMemo(() => {
    return searchFilteredBase.filter(v => {
      const matchesYear = selectedYear ? v.releaseYear === selectedYear : true;
      const matchesGenre = selectedGenreIds.length > 0 ? selectedGenreIds.includes(v.genreId) : true;
      return matchesYear && matchesGenre;
    });
  }, [searchFilteredBase, selectedYear, selectedGenreIds]);

  // Auto-reset filters if they become invalid based on search 
  useEffect(() => {
    if (selectedYear && !dynamicYears.includes(selectedYear)) {
      setSelectedYear(null);
    }
    const validIds = new Set(dynamicGenres.map((g: Genre) => g.id));
    setSelectedGenreIds(prev => {
      const filtered = prev.filter((id: number) => validIds.has(id));
      return filtered.length === prev.length ? prev : filtered;
    });
  }, [dynamicYears, dynamicGenres, selectedYear, setSelectedYear, setSelectedGenreIds]);

  return {
    finalFilteredVideos,
    dynamicYears,
    dynamicGenres
  };
};