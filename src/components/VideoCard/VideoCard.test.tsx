import { render, screen } from "@testing-library/react";
import VideoCard from "./VideoCard";
import { it, describe, expect } from "vitest";

describe("VideoCard", () => {
  it("renders title, artist, and release year", () => {
    render(
      <VideoCard
        imageUrl="/poster.svg"
        title="Test Video"
        artist="Test Artist"
        releaseYear={2024}
      />
    );
    expect(screen.getByText("Test Video")).toBeInTheDocument();
    expect(screen.getByText("Test Artist")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
    const img = screen.getByRole("img", { name: "Test Video" });
    expect(img).toHaveAttribute("src", "/poster.svg");
  });
});
