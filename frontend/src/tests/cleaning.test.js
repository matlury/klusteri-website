import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CleaningSchedule from '../pages/cleaningschedulepage.jsx';
import CleanersList from '../components/CleanersList.jsx';
import axiosClient from '../axios.js';
import mockAxios from "../../__mocks__/axios";
import "@testing-library/jest-dom";

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
        mockAxios.reset();
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
        });
    });
});
