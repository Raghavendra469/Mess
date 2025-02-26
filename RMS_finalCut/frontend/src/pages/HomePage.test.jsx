import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';
import '@testing-library/jest-dom'; // <-- Import this

const renderComponent = () => {
  render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
};

describe('HomePage Component', () => {
  test('renders the navbar with site title and login link', () => {
    renderComponent();
    expect(screen.getByText(/Royalty Management System/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument();
  });

  test('renders the hero section with heading and call-to-action button', () => {
    renderComponent();
    expect(screen.getByText(/Manage Your Royalties Seamlessly/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Get Started/i })).toBeInTheDocument();
  });

  test('renders the features section with key features', () => {
    renderComponent();
    expect(screen.getByText(/Role-Based Access Control/i)).toBeInTheDocument();
    expect(screen.getByText(/Automated Royalty Calculations/i)).toBeInTheDocument();
    expect(screen.getByText(/Performance Insights/i)).toBeInTheDocument();
  });

  test('renders the How It Works section with steps', () => {
    renderComponent();
    expect(screen.getByText(/Artists and Managers log in with role-based access./i)).toBeInTheDocument();
    expect(screen.getByText(/Artists can add songs, request managers, and track royalties./i)).toBeInTheDocument();
    expect(screen.getByText(/Admins oversee user accounts, transactions, and generate reports./i)).toBeInTheDocument();
  });

  test('renders the registration info section', () => {
    renderComponent();
    expect(screen.getByText(/How to Register?/i)).toBeInTheDocument();
    expect(screen.getByText(/Artists and Managers cannot register themselves/i)).toBeInTheDocument();
    expect(screen.getByText(/admin@gmail.com/i)).toBeInTheDocument();
    expect(screen.getByText(/7093148469/i)).toBeInTheDocument();
  });

  test('renders the footer with copyright info', () => {
    renderComponent();
    expect(screen.getByText(/© 2025 Royalty Management. All rights reserved./i)).toBeInTheDocument();
  });
});
