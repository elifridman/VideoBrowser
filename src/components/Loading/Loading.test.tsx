import { render, screen } from "@testing-library/react";
import Loading from "./Loading";
import { it, describe, expect } from "vitest";

describe("Loading", () => {
  it("renders the default message when no message prop is provided", () => {
    render(<Loading />);
    expect(screen.getByText("Loading videos...")).toBeInTheDocument();
  });
});
