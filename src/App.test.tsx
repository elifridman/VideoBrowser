import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import App from "./App";
import { useFetchVideosData } from "./hooks/useFetchVideosData";
import { useFilteredVideos } from "./hooks/useFilteredVideos";
import type { Video } from "./types";
import type { ApiResponse } from "./types";

vi.mock("./hooks/useFetchVideosData");
vi.mock("./hooks/useFilteredVideos");

const mockUseFetchVideosData = vi.mocked(useFetchVideosData);
const mockUseFilteredVideos = vi.mocked(useFilteredVideos);

type QueryResult = ReturnType<typeof useFetchVideosData>;

function mockQueryResult(overrides: {
  data?: ApiResponse;
  isLoading?: boolean;
  error?: Error | null;
}): QueryResult {
  return {
    data: undefined,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
    ...overrides,
  } as unknown as QueryResult;
}

const defaultFilteredReturn = {
  finalFilteredVideos: [] as Video[],
  dynamicYears: [2024, 2023],
  dynamicGenres: [{ id: 1, name: "Action" }],
};

describe("App", () => {
  beforeEach(() => {
    mockUseFetchVideosData.mockReturnValue(mockQueryResult({}));
    mockUseFilteredVideos.mockReturnValue(defaultFilteredReturn);
  });

  it("renders the Header with Video Browser title", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /video browser/i })).toBeInTheDocument();
  });

  it("shows Loading when data is loading", () => {
    mockUseFetchVideosData.mockReturnValue(mockQueryResult({ isLoading: true }));

    render(<App />);
    expect(screen.getByText("Loading videos...")).toBeInTheDocument();
  });

  it("shows ErrorState with Try Again when there is an error", () => {
    mockUseFetchVideosData.mockReturnValue(
      mockQueryResult({ error: new Error("Network error") })
    );

    render(<App />);
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("shows Empty when filtered videos list is empty", () => {
    mockUseFetchVideosData.mockReturnValue(
      mockQueryResult({ data: { videos: [], genres: [] } })
    );
    mockUseFilteredVideos.mockReturnValue({
      ...defaultFilteredReturn,
      finalFilteredVideos: [],
    });

    render(<App />);
    expect(screen.getByText("No videos found")).toBeInTheDocument();
  });

  it("shows VideoList with videos when data is loaded and not empty", () => {
    const videos: Video[] = [
      {
        id: 1,
        title: "Test Video",
        artist: "Test Artist",
        releaseYear: 2024,
        genreId: 1,
        imageUrl: "/poster.svg",
      },
    ];
    mockUseFetchVideosData.mockReturnValue(
      mockQueryResult({ data: { videos: [], genres: [] } })
    );
    mockUseFilteredVideos.mockReturnValue({
      ...defaultFilteredReturn,
      finalFilteredVideos: videos,
    });

    render(<App />);
    expect(screen.getByText("Test Video")).toBeInTheDocument();
    expect(screen.getByText("Test Artist")).toBeInTheDocument();
  });
});
