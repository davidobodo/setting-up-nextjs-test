import { render, screen } from "@testing-library/react";
import Home from "../pages/index";

describe("Application", () => {
	it("renders correctly", () => {
		render(<Home />);
		expect(screen.getByText(/Next.js!/)).toBeInTheDocument();
	});
});
