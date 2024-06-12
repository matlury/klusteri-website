import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CleaningSchedule from '../pages/cleaningschedulepage.jsx';
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
    week: 1,
    big: { name: 'Matrix' },
    small: { name: 'Vasara' },
  },
  {
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
});
