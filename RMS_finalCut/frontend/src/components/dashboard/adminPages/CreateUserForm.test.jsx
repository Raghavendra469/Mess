import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CreateUserForm from './CreateUserForm';
import { createUser } from '../../../services/userService';

// Correctly Mock the Service for Vitest
vi.mock('../../../services/userService', () => {
  return {
    default: {
      createUser: vi.fn(),
    },
    createUser: vi.fn(),
  };
});

describe('CreateUserForm Submission', () => {
  const mockUser = {
    username: 'testuser',
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    mobileNo: '1234567890',
    role: 'Artist',
    address: '123 Test St'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('successful form submission with custom success message', async () => {
    const customMessage = 'User account created successfully!';
    createUser.mockResolvedValueOnce({ message: customMessage });

    render(<CreateUserForm />);

    Object.entries(mockUser).forEach(([field, value]) => {
      const input = screen.getByLabelText(field.charAt(0).toUpperCase() + field.slice(1));
      fireEvent.change(input, { target: { value } });
    });

    fireEvent.click(screen.getByText('Create User'));

    await waitFor(() => {
      expect(screen.getByText(customMessage)).toBeInTheDocument();
      expect(screen.getByText(customMessage)).toHaveClass('text-green-600');
    });

    Object.keys(mockUser).forEach(field => {
      const input = screen.getByLabelText(field.charAt(0).toUpperCase() + field.slice(1));
      expect(input.value).toBe(field === 'role' ? 'Artist' : '');
    });

    expect(createUser).toHaveBeenCalledWith(mockUser);
    expect(createUser).toHaveBeenCalledTimes(1);
  });

  it('successful form submission with default success message', async () => {
    createUser.mockResolvedValueOnce({});

    render(<CreateUserForm />);

    Object.entries(mockUser).forEach(([field, value]) => {
      const input = screen.getByLabelText(field.charAt(0).toUpperCase() + field.slice(1));
      fireEvent.change(input, { target: { value } });
    });

    fireEvent.click(screen.getByText('Create User'));

    await waitFor(() => {
      expect(screen.getByText('User created successfully!')).toBeInTheDocument();
      expect(screen.getByText('User created successfully!')).toHaveClass('text-green-600');
    });
  });

  it('form submission with custom error message', async () => {
    const errorMessage = 'Username already exists';
    createUser.mockRejectedValueOnce(new Error(errorMessage));

    render(<CreateUserForm />);

    Object.entries(mockUser).forEach(([field, value]) => {
      const input = screen.getByLabelText(field.charAt(0).toUpperCase() + field.slice(1));
      fireEvent.change(input, { target: { value } });
    });

    fireEvent.click(screen.getByText('Create User'));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toHaveClass('text-red-600');
    });

    Object.entries(mockUser).forEach(([field, value]) => {
      const input = screen.getByLabelText(field.charAt(0).toUpperCase() + field.slice(1));
      expect(input.value).toBe(value);
    });
  });

  it('form submission with default error message', async () => {
    createUser.mockRejectedValueOnce(new Error());

    render(<CreateUserForm />);

    Object.entries(mockUser).forEach(([field, value]) => {
      const input = screen.getByLabelText(field.charAt(0).toUpperCase() + field.slice(1));
      fireEvent.change(input, { target: { value } });
    });

    fireEvent.click(screen.getByText('Create User'));

    await waitFor(() => {
      expect(screen.getByText('Error creating user')).toBeInTheDocument();
      expect(screen.getByText('Error creating user')).toHaveClass('text-red-600');
    });
  });

  it('form submission handles network error', async () => {
    createUser.mockRejectedValueOnce(new Error('Network Error'));

    render(<CreateUserForm />);

    Object.entries(mockUser).forEach(([field, value]) => {
      const input = screen.getByLabelText(field.charAt(0).toUpperCase() + field.slice(1));
      fireEvent.change(input, { target: { value } });
    });

    fireEvent.click(screen.getByText('Create User'));

    await waitFor(() => {
      expect(screen.getByText('Network Error')).toBeInTheDocument();
      expect(screen.getByText('Network Error')).toHaveClass('text-red-600');
    });
  });
});
