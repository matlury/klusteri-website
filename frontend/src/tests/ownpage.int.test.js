import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import OwnPage from '../../src/pages/ownpage';

jest.mock('axios');

describe('OwnPage', () => {
    beforeEach(() => {
      axios.get.mockResolvedValue({ data: [] }); 
    });
  
    afterEach(() => {
        jest.restoreAllMocks();
      })
    
    it('renders login message if not logged in', () => {
        render(<OwnPage isLoggedIn={false} />);
        expect(screen.getByText('Kirjaudu sisään muokataksesi tietoja')).toBeTruthy();
      });
    
    it('renders user page if logged in', async () => {
        render(<OwnPage isLoggedIn={true} />);
        
        await waitFor(() => {
            expect(screen.getByText('Käyttäjänimi:')).toBeTruthy()
            expect(screen.getByText('Sähköposti:')).toBeTruthy()
            expect(screen.getByText('Telegram:')).toBeTruthy()
            expect(screen.getByText('Rooli: 5')).toBeTruthy()
            expect(screen.getByText('Virka:')).toBeTruthy()
            expect(screen.getByText('Myöntämis päivä:')).toBeTruthy()
            expect(screen.getByText('Järjestöt')).toBeTruthy();
        });
      })
})
