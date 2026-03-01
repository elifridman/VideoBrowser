// src/hooks/useFilteredVideos.ts
import { useMemo, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import type { RawVideo, Genre, Video } from '../types';

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

  // Normalize data once
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

  // Step 1: Base Filter (Search)
  const searchFilteredBase = useMemo(() => {
    const term = debouncedSearch.toLowerCase();
    return normalizedVideos.filter((v: Video) => 
      v.title.toLowerCase().includes(term) || v.artist.toLowerCase().includes(term)
    );
  }, [normalizedVideos, debouncedSearch]);

  // Step 2: Dynamic Options
  const dynamicYears = useMemo(() => {
    const years = new Set(searchFilteredBase.map(v => v.releaseYear));
    return Array.from(years).sort((a, b) => b - a);
  }, [searchFilteredBase]);

  const dynamicGenres = useMemo(() => {
    const availableIds = Array.from(new Set(searchFilteredBase.map(v => v.genreId)));
    return availableIds.map(id => {
      const foundGenre = data?.genres?.find(g => Number(g.id) === Number(id));
      return {
        id: Number(id),
        name: foundGenre ? foundGenre.name : 'uncategorized'
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [data?.genres, searchFilteredBase]);

  // Step 3: Combined Filtering (AND Logic)
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
    const validIds = new Set(dynamicGenres.map(g => g.id));
    setSelectedGenreIds(prev => {
      const filtered = prev.filter(id => validIds.has(id));
      return filtered.length === prev.length ? prev : filtered;
    });
  }, [dynamicYears, dynamicGenres, selectedYear, setSelectedYear, setSelectedGenreIds]);

  return {
    finalFilteredVideos,
    dynamicYears,
    dynamicGenres
  };
};