import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import HomePage from "./HomePage";

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("HomePage", () => {
  it("should render the navbar with title and login link", () => {
    renderWithRouter(<HomePage />);

    expect(
      screen.getByText(/Royalty Management System/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Login/i })).toHaveAttribute(
      "href",
      "/login"
    );
  });

  it("should display the hero section with heading and CTA", () => {
    renderWithRouter(<HomePage />);

    expect(
      screen.getByRole("heading", { name: /Manage Your Royalties Seamlessly/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/A modern platform designed/i)).toBeInTheDocument();

    const getStartedButton = screen.getByRole("link", { name: /Get Started/i });
    expect(getStartedButton).toHaveAttribute("href", "/login");
  });

  it("should render the features section with key features", () => {
    renderWithRouter(<HomePage />);

    expect(screen.getByRole("heading", { name: /Key Features/i })).toBeInTheDocument();
    expect(screen.getByText(/Role-Based Access Control/i)).toBeInTheDocument();
    expect(screen.getByText(/Automated Royalty Calculations/i)).toBeInTheDocument();
    expect(screen.getByText(/Performance Insights/i)).toBeInTheDocument();
  });

  it("should render the 'How It Works' section", () => {
    renderWithRouter(<HomePage />);

    expect(screen.getByRole("heading", { name: /How It Works/i })).toBeInTheDocument();
    expect(
      screen.getByText(/Artists and Managers log in with role-based access/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Artists can add songs, request managers, and track royalties/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Admins oversee user accounts, transactions, and generate reports/i)
    ).toBeInTheDocument();
  });

  it("should display the 'How to Register?' section with admin contact info", () => {
    renderWithRouter(<HomePage />);

    expect(screen.getByRole("heading", { name: /How to Register\?/i })).toBeInTheDocument();
    expect(
      screen.getByText(/Artists and Managers cannot register themselves/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/admin@gmail.com/i)).toBeInTheDocument();
    expect(screen.getByText(/\+91 7093148469/i)).toBeInTheDocument();
  });

  it("should render the footer with copyright text", () => {
    renderWithRouter(<HomePage />);

    expect(
      screen.getByText(/© 2025 Royalty Management. All rights reserved./i)
    ).toBeInTheDocument();
  });
});
