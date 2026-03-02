import { render, screen } from "@testing-library/react";
import Empty from "./Empty";
import { it, describe, expect } from "vitest";

describe("Empty", () => {
  it("renders the default message when no message prop is provided", () => {
    render(<Empty />);
    expect(screen.getByText("No videos found")).toBeInTheDocument();
  });
});
