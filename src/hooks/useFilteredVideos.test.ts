import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useFilteredVideos } from "./useFilteredVideos";
import type { RawVideo, Genre } from "../types";

vi.mock("./useDebounce", () => ({
  useDebounce: vi.fn((value: string) => value),
}));

const rawVideos: RawVideo[] = [
  { id: 1, title: "Alpha Song", artist: "Artist A", release_year: 2024, genre_id: 1, image_url: "/1.jpg" },
  { id: 2, title: "Beta Track", artist: "Artist B", release_year: 2023, genre_id: 1, image_url: "/2.jpg" },
  { id: 3, title: "Alpha Two", artist: "Artist C", release_year: 2024, genre_id: 2, image_url: "/3.jpg" },
];

const genres: Genre[] = [
  { id: 1, name: "Action" },
  { id: 2, name: "Comedy" },
];

const defaultProps = {
  data: { videos: rawVideos, genres },
  search: "",
  selectedYear: null as number | null,
  setSelectedYear: vi.fn(),
  selectedGenreIds: [] as number[],
  setSelectedGenreIds: vi.fn(),
};

describe("useFilteredVideos", () => {
  beforeEach(() => {
    defaultProps.setSelectedYear = vi.fn();
    defaultProps.setSelectedGenreIds = vi.fn();
  });

  it("returns empty arrays when data is undefined", () => {
    const { result } = renderHook(() =>
      useFilteredVideos({
        ...defaultProps,
        data: undefined,
      })
    );
    expect(result.current.finalFilteredVideos).toEqual([]);
    expect(result.current.dynamicYears).toEqual([]);
    expect(result.current.dynamicGenres).toEqual([]);
  });

  it("normalizes raw videos and returns all when no filters applied", () => {
    const { result } = renderHook(() => useFilteredVideos(defaultProps));
    expect(result.current.finalFilteredVideos).toHaveLength(3);
    expect(result.current.finalFilteredVideos[0]).toMatchObject({
      id: 1,
      title: "Alpha Song",
      artist: "Artist A",
      releaseYear: 2024,
      genreId: 1,
      imageUrl: "/1.jpg",
    });
  });

  it("filters by search term (title)", () => {
    const { result } = renderHook(() =>
      useFilteredVideos({ ...defaultProps, search: "alpha" })
    );
    expect(result.current.finalFilteredVideos).toHaveLength(2);
    expect(result.current.finalFilteredVideos.map((v) => v.title)).toEqual(
      expect.arrayContaining(["Alpha Song", "Alpha Two"])
    );
  });

  it("filters by search term (artist)", () => {
    const { result } = renderHook(() =>
      useFilteredVideos({ ...defaultProps, search: "Artist B" })
    );
    expect(result.current.finalFilteredVideos).toHaveLength(1);
    expect(result.current.finalFilteredVideos[0].artist).toBe("Artist B");
  });

  it("filters by selectedYear", () => {
    const { result } = renderHook(() =>
      useFilteredVideos({ ...defaultProps, selectedYear: 2024 })
    );
    expect(result.current.finalFilteredVideos).toHaveLength(2);
    expect(result.current.finalFilteredVideos.every((v) => v.releaseYear === 2024)).toBe(true);
  });

  it("filters by selectedGenreIds", () => {
    const { result } = renderHook(() =>
      useFilteredVideos({ ...defaultProps, selectedGenreIds: [2] })
    );
    expect(result.current.finalFilteredVideos).toHaveLength(1);
    expect(result.current.finalFilteredVideos[0].genreId).toBe(2);
  });

  it("applies year and genre filters together (AND logic)", () => {
    const { result } = renderHook(() =>
      useFilteredVideos({
        ...defaultProps,
        selectedYear: 2024,
        selectedGenreIds: [1],
      })
    );
    expect(result.current.finalFilteredVideos).toHaveLength(1);
    expect(result.current.finalFilteredVideos[0]).toMatchObject({
      releaseYear: 2024,
      genreId: 1,
      title: "Alpha Song",
    });
  });

  it("returns dynamicYears sorted descending and unique", () => {
    const { result } = renderHook(() => useFilteredVideos(defaultProps));
    expect(result.current.dynamicYears).toEqual([2024, 2023]);
  });

  it("returns dynamicGenres with names from data, sorted by name", () => {
    const { result } = renderHook(() => useFilteredVideos(defaultProps));
    expect(result.current.dynamicGenres).toEqual([
      { id: 1, name: "Action" },
      { id: 2, name: "Comedy" },
    ]);
  });

  it("clears selectedYear when it is not in dynamicYears after search", () => {
    const setSelectedYear = vi.fn();
    renderHook(() =>
      useFilteredVideos({
        ...defaultProps,
        search: "Alpha",
        selectedYear: 2023,
        setSelectedYear,
      })
    );
    expect(setSelectedYear).toHaveBeenCalledWith(null);
  });

  it("clears invalid genre ids from selectedGenreIds when they are not in dynamicGenres", () => {
    const setSelectedGenreIds = vi.fn();
    renderHook(() =>
      useFilteredVideos({
        ...defaultProps,
        search: "Alpha Song",
        selectedGenreIds: [1, 2, 99],
        setSelectedGenreIds,
      })
    );
    expect(setSelectedGenreIds).toHaveBeenCalled();
    const updater = setSelectedGenreIds.mock.calls[0][0];
    expect(updater([1, 2, 99])).toEqual([1]);
  });
});
