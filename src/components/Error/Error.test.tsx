import { render, screen, fireEvent } from "@testing-library/react";
import ErrorState from "./Error";
import { it, describe, expect, vi } from "vitest";


describe("ErrorState", () => {
  it("calls retry when Try Again button is clicked", () => {
    const retry = vi.fn();
    render(<ErrorState retry={retry} />);

    fireEvent.click(screen.getByRole("button", { name: /try again/i }));

    expect(retry).toHaveBeenCalledTimes(1);
  });
});
