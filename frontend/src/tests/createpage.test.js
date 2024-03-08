import { render, fireEvent, waitFor } from '@testing-library/react';
import NewAccountPage from '../../src/pages/createpage';
import axiosClient from '../axios.js'

jest.mock('../axios.js')


describe('NewAccountPage', () => {
  beforeEach(() => {
    axiosClient.post.mockResolvedValue({ data: {} });
  });

  test('renders the component', () => {
    const { getByText } = render(<NewAccountPage />);
    expect(getByText('Luo uusi käyttäjä')).toBeTruthy();
  });

  test('displays error when fields are empty', async () => {
    const { getByText } = render(<NewAccountPage />);

    fireEvent.click(getByText('Luo käyttäjä'));

    await waitFor(() => {
      expect(getByText('Käyttäjänimi, salasana, sähköposti ja vahvista salasana ovat pakollisia kenttiä.')).toBeTruthy();
    });
  });

})