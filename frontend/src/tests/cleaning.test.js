import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CleaningSchedule from '../pages/cleaningschedulepage.jsx';
import CleanersList from '../components/CleanersList.jsx';
import axiosClient from '../axios.js';
import "@testing-library/jest-dom";

// Mock dependencies
jest.mock('../axios.js');

const user = {
    username: "example_username",
    email: "example_email@example.com",
    telegram: "example_telegram",
    role: 1,
    rights_for_reservation: true,
    id: 1,
};

const mockCleaningData = [
    {
      id: 1,
      week: 1,
      big: { name: 'Matrix' },
      small: { name: 'Vasara' },
    },
    {
      id: 2,
      week: 2,
      big: { name: 'TKO-äly' },
      small: { name: 'Synop' },
    },
  ];

describe('CleaningSchedule Component', () => {
  const loggedUser = { role: 1 };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("loggedUser", JSON.stringify(user));
  });

  test('renders login prompt if not logged in', () => {
    render(<CleaningSchedule isLoggedIn={false} loggedUser={null} />);
    expect(screen.getByText('Kirjaudu sisään')).toBeInTheDocument();
  });

  test('fetches and displays cleaning schedule when logged in', async () => {
    axiosClient.get.mockResolvedValueOnce({ data: mockCleaningData });
  
    render(<CleanersList allCleaners={mockCleaningData} />);
  
    await waitFor(() => {
      expect(screen.findByText('Matrix')).resolves.toBeInTheDocument();
      expect(screen.findByText('Vasara')).resolves.toBeInTheDocument();
    });
  });

  test('shows success message after saving cleaning schedule', async () => {
    axiosClient.get.mockResolvedValueOnce({ data: mockCleaningData });
    axiosClient.post.mockResolvedValueOnce({ data: { success: true } });

    render(<CleaningSchedule isLoggedIn={true} loggedUser={loggedUser} />);

    // Mock the FileReader
    const fileReaderMock = {
      onload: jest.fn(),
      readAsText: jest.fn(),
      result: JSON.stringify(mockCleaningData),
    };
    window.FileReader = jest.fn(() => fileReaderMock);

    // Mock file
    const mockFile = new Blob([JSON.stringify(mockCleaningData)], { type: 'application/json' });

    // Trigger file input change event
    const fileInput = screen.getByLabelText(/Vie lista/i);
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    // Trigger save button click
    fireEvent.click(screen.getByText('Tallenna'));

    // Wait for the success message to appear
    await waitFor(() => {
      expect(screen.getByText('Siivouksen kirjaus onnistui')).toBeInTheDocument();
    });
  });

//  test('handles delete cleaners', async () => {
//    axiosClient.get.mockResolvedValueOnce({ data: mockCleaningData });
//    axiosClient.delete.mockResolvedValueOnce({ data: { success: true } });
//
//    render(<CleaningSchedule isLoggedIn={true} loggedUser={loggedUser} />);
//
//    fireEvent.click(screen.getByText('Tyhjennä'));
//
//    await waitFor(() => {
//      expect(screen.getByText('Siivousvuorot poistettu onnistuneesti.')).toBeInTheDocument();
//    });
//  });
//
//  test('displays error message when saving fails', async () => {
//    axiosClient.get.mockResolvedValueOnce({ data: mockCleaningData });
//    axiosClient.post.mockRejectedValueOnce(new Error('Saving failed'));
//
//    render(<CleaningSchedule isLoggedIn={true} loggedUser={loggedUser} />);
//
//    fireEvent.click(screen.getByText('Tallenna'));
//
//    await waitFor(() => {
//      expect(screen.getByText('Siivouksen kirjaus epäonnistui')).toBeInTheDocument();
//    });
//  });
});
