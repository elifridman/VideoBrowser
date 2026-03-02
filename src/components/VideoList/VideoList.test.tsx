import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import VideoList from "./VideoList";
import type { Video } from "../../types";
import { it, describe, expect } from "vitest";

const mockVideos: Video[] = [
  {
    id: 1,
    title: "First Video",
    artist: "Artist One",
    releaseYear: 2024,
    genreId: 1,
    imageUrl: "/poster.svg",
  },
  {
    id: 2,
    title: "Second Video",
    artist: "Artist Two",
    releaseYear: 2023,
    genreId: 2,
    imageUrl: "/poster.svg",
  },
];

describe("VideoList", () => {
  it("renders all videos in the list", () => {
    render(
      <VideoList videos={mockVideos} hasMore={false} onLoadMore={vi.fn()} />
    );

    expect(screen.getByText("First Video")).toBeInTheDocument();
    expect(screen.getByText("Second Video")).toBeInTheDocument();
    expect(screen.getByText("Artist One")).toBeInTheDocument();
    expect(screen.getByText("Artist Two")).toBeInTheDocument();
  });

  it("calls onLoadMore when IntersectionObserver detects the sentinel and hasMore is true", () => {
    let observerCallback!: (entries: IntersectionObserverEntry[]) => void;
    const observe = vi.fn();
    const disconnect = vi.fn();

    const IntersectionObserverMock = vi.fn((callback: (entries: IntersectionObserverEntry[]) => void) => {
      observerCallback = callback;
      return { observe, disconnect };
    });
    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);

    const onLoadMore = vi.fn();
    render(
      <VideoList videos={[]} hasMore={true} onLoadMore={onLoadMore} />
    );

    expect(observe).toHaveBeenCalled();
    observerCallback!([{ isIntersecting: true } as IntersectionObserverEntry]);
    expect(onLoadMore).toHaveBeenCalledTimes(1);

    vi.unstubAllGlobals();
  });
});
