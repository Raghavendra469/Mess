import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateUserForm from './CreateUserForm';
import { createUser } from '../../../services/userService';
 
jest.mock('../../../services/userService');
 
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
    jest.clearAllMocks();
  });
 
  test('successful form submission with custom success message', async () => {
    // Mock successful API response with custom message
    const customMessage = 'User account created successfully!';
    createUser.mockResolvedValueOnce({ message: customMessage });
 
    render(<CreateUserForm />);
 
    // Fill in all required fields
    Object.entries(mockUser).forEach(([field, value]) => {
      const input = screen.getByLabelText(field.charAt(0).toUpperCase() + field.slice(1));
      fireEvent.change(input, { target: { value } });
    });
 
    // Submit form
    fireEvent.click(screen.getByText('Create User'));
 
    // Verify success message is displayed
    await waitFor(() => {
      expect(screen.getByText(customMessage)).toBeInTheDocument();
      expect(screen.getByText(customMessage)).toHaveClass('text-green-600');
    });
 
    // Verify form was reset
    Object.keys(mockUser).forEach(field => {
      const input = screen.getByLabelText(field.charAt(0).toUpperCase() + field.slice(1));
      expect(input.value).toBe(field === 'role' ? 'Artist' : '');
    });
 
    // Verify createUser was called with correct data
    expect(createUser).toHaveBeenCalledWith(mockUser);
    expect(createUser).toHaveBeenCalledTimes(1);
  });
 
  test('successful form submission with default success message', async () => {
    // Mock successful API response without message
    createUser.mockResolvedValueOnce({});
 
    render(<CreateUserForm />);
 
    // Fill and submit form
    Object.entries(mockUser).forEach(([field, value]) => {
      const input = screen.getByLabelText(field.charAt(0).toUpperCase() + field.slice(1));
      fireEvent.change(input, { target: { value } });
    });
 
    fireEvent.click(screen.getByText('Create User'));
 
    // Verify default success message is displayed
    await waitFor(() => {
      expect(screen.getByText('User created successfully!')).toBeInTheDocument();
      expect(screen.getByText('User created successfully!')).toHaveClass('text-green-600');
    });
  });
 
  test('form submission with custom error message', async () => {
    // Mock API error with custom message
    const errorMessage = 'Username already exists';
    createUser.mockRejectedValueOnce(new Error(errorMessage));
 
    render(<CreateUserForm />);
 
    // Fill and submit form
    Object.entries(mockUser).forEach(([field, value]) => {
      const input = screen.getByLabelText(field.charAt(0).toUpperCase() + field.slice(1));
      fireEvent.change(input, { target: { value } });
    });
 
    fireEvent.click(screen.getByText('Create User'));
 
    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toHaveClass('text-red-600');
    });
 
    // Verify form data is preserved
    Object.entries(mockUser).forEach(([field, value]) => {
      const input = screen.getByLabelText(field.charAt(0).toUpperCase() + field.slice(1));
      expect(input.value).toBe(value);
    });
  });
 
  test('form submission with default error message', async () => {
    // Mock API error without message
    createUser.mockRejectedValueOnce(new Error());
 
    render(<CreateUserForm />);
 
    // Fill and submit form
    Object.entries(mockUser).forEach(([field, value]) => {
      const input = screen.getByLabelText(field.charAt(0).toUpperCase() + field.slice(1));
      fireEvent.change(input, { target: { value } });
    });
 
    fireEvent.click(screen.getByText('Create User'));
 
    // Verify default error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Error creating user')).toBeInTheDocument();
      expect(screen.getByText('Error creating user')).toHaveClass('text-red-600');
    });
  });
 
  test('form submission handles network error', async () => {
    // Mock network error
    createUser.mockRejectedValueOnce(new Error('Network Error'));
 
    render(<CreateUserForm />);
 
    // Fill and submit form
    Object.entries(mockUser).forEach(([field, value]) => {
      const input = screen.getByLabelText(field.charAt(0).toUpperCase() + field.slice(1));
      fireEvent.change(input, { target: { value } });
    });
 
    fireEvent.click(screen.getByText('Create User'));
 
    // Verify error handling
    await waitFor(() => {
      expect(screen.getByText('Network Error')).toBeInTheDocument();
      expect(screen.getByText('Network Error')).toHaveClass('text-red-600');
    });
  });
});