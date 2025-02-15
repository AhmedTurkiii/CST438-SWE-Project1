// favorite.test.tsx

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import FavoriteQuotes from '@/app/(tabs)/favorite';

// Mock Axios to prevent real API calls
jest.mock('axios');

describe('FavoriteQuotes Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading indicator initially', () => {
    render(<FavoriteQuotes />);
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders a fetched quote', async () => {
    // Mock API response
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { content: 'This is a test quote' },
    });

    render(<FavoriteQuotes />);

    // Ensure the loading state is shown first
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();

    // Wait for the quote to appear
    await waitFor(() => expect(screen.getByText('This is a test quote')).toBeTruthy());
  });

  it('renders an error message if the API fails', async () => {
    // Mock API failure
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<FavoriteQuotes />);

    // Wait for the error message to be displayed
    await waitFor(() => expect(screen.getByText('Failed to fetch quote')).toBeTruthy());
  });
});
