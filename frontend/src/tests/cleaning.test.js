import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CleaningSchedule from '../pages/cleaningschedulepage.jsx';
import CleanersList from '../components/CleanersList.jsx';
import mockAxios from "../../__mocks__/axios";
import { ContextProvider } from "@context/ContextProvider";
import "@testing-library/dom";
import { Role } from '../roles';

localStorage.setItem("lang", "fi")

const user = {
    username: "example_username",
    email: "example_email@example.com",
    telegram: "example_telegram",
    role: Role.LEPPISPJ,
    rights_for_reservation: true,
    id: 1,
};

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
    beforeEach(() => {
        mockAxios.reset();
        localStorage.clear();
        localStorage.setItem("lang", "fi")
    });

    test('renders login prompt if not logged in', () => {
        render(
            <ContextProvider skipHydration>
                <CleaningSchedule />
            </ContextProvider>
        );
        expect(screen.getByText('Kirjaudu sisään')).toBeInTheDocument();
    });

    test('fetches and displays cleaning schedule when logged in', async () => {
        // CleanersList expects processed data (with id and string names)
        const processedData = mockCleaningData.map(item => ({
            id: item.week,
            week: item.week,
            big: item.big.name,
            small: item.small.name,
            date: "2024-01-01" // date is handled by moment in real component
        }));

        render(
            <ContextProvider skipHydration>
                <CleanersList allCleaners={processedData} />
            </ContextProvider>
        );

        expect(await screen.findByText('Matrix')).toBeInTheDocument();
    });

    test('renders all content when logged as leppispj', async () => {
        window.confirm = jest.fn(() => true);

        render(
            <ContextProvider initialUser={user} skipHydration>
                <CleaningSchedule />
            </ContextProvider>
        );

        await waitFor(() => expect(mockAxios.get).toHaveBeenCalledWith("listobjects/cleaning/"));

        await waitFor(() => {
            mockAxios.mockResponse({ data: mockCleaningData });
        });

        expect(await screen.findByText('Siivousvuorot')).toBeInTheDocument();
        expect(screen.getByText('Tuo lista')).toBeInTheDocument();
        expect(screen.getByText('Vie lista')).toBeInTheDocument();
        expect(screen.getByText('Tallenna')).toBeInTheDocument();
    });
});
