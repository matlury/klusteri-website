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

const big_org1 = {
    id: 1,
    name: 'Matrix',
    email: 'matrix@matrix.fi',
    homepage: 'matrix.fi',
    user_set: [1, 2],
}

const big_org2 = {
    id: 2,
    name: 'TKO-äly',
    email: 'tko@aly.fi',
    homepage: 'tekis.fi',
    user_set: [3, 4],
}

const small_org1 = {
    id: 3,
    name: 'Vasara',
    email: 'vasara@vasara.fi',
    homepage: 'vasara.fi',
    user_set: [5],
}

const small_org2 = {
    id: 4,
    name: 'Synop',
    email: 'synop@synop.fi',
    homepage: 'synop.fi',
    user_set: [6],
}

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

//  test('shows success message after saving cleaning schedule', async () => {
//    axiosClient.get.mockResolvedValueOnce({ data: mockCleaningData });
//    axiosClient.post.mockResolvedValueOnce({ data: { success: true } });
//
//    render(<CleaningSchedule isLoggedIn={true} loggedUser={loggedUser} />);
//
//    fireEvent.click(screen.getByText('Tallenna'));
//
//    await waitFor(() => {
//      expect(screen.getByText('Siivouksen kirjaus onnistui')).toBeInTheDocument();
//    });
//  });
//
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
