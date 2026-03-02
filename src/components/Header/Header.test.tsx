import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";
import { it, describe, expect, vi } from "vitest";

const defaultProps = {
  searchTerm: "",
  setSearchTerm: vi.fn(),
  selectedYear: null,
  setSelectedYear: vi.fn(),
  selectedGenreId: [] as number[],
  setSelectedGenreId: vi.fn(),
  years: [2024, 2023, 2022],
  genres: [
    { id: 1, name: "Action" },
    { id: 2, name: "Comedy" },
  ],
};

describe("Header", () => {
  it("renders title and calls setSearchTerm when user types in the search input", () => {
    const setSearchTerm = vi.fn();
    render(<Header {...defaultProps} setSearchTerm={setSearchTerm} />);

    const searchInput = screen.getByPlaceholderText(/search video/i);
    fireEvent.change(searchInput, { target: { value: "test query" } });

    expect(setSearchTerm).toHaveBeenCalledWith("test query");
  });

  it("calls setSelectedYear when a year is selected from the dropdown", () => {
    const setSelectedYear = vi.fn();
    render(<Header {...defaultProps} setSelectedYear={setSelectedYear} />);

    const yearTrigger = screen.getByRole("combobox");
    fireEvent.click(yearTrigger);

    const option2024 = screen.getByRole("option", { name: "2024" });
    fireEvent.click(option2024);

    expect(setSelectedYear).toHaveBeenCalledWith(2024);
  });

  it("calls setSelectedYear with null when All Years is selected", () => {
    const setSelectedYear = vi.fn();
    render(
      <Header {...defaultProps} selectedYear={2024} setSelectedYear={setSelectedYear} />
    );

    const yearTrigger = screen.getByRole("combobox");
    fireEvent.click(yearTrigger);

    const allYearsOption = screen.getByRole("option", { name: /all years/i });
    fireEvent.click(allYearsOption);

    expect(setSelectedYear).toHaveBeenCalledWith(null);
  });

  it("renders genre trigger with Genre when no genres selected", () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText("Genre")).toBeInTheDocument();
    const genreTrigger = screen.getByText("Genre").closest("button");
    expect(genreTrigger).toBeInTheDocument();
  });

  it("renders genre trigger with N Selected when genres are selected", () => {
    render(<Header {...defaultProps} selectedGenreId={[1]} />);
    expect(screen.getByText("1 Selected")).toBeInTheDocument();
  });
});
