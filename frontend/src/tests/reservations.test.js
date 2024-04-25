import { render, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Reservations from '../../src/pages/reservations'
import React from 'react';
import axiosClient from '../axios.js'

// Mock axiosClient
jest.mock('../axios', () => {
  return {
    __esModule: true,
    default: {
      get: jest.fn().mockResolvedValue({ data: {} }),
      post: jest.fn().mockResolvedValue({}),
      put: jest.fn().mockResolvedValue({})
    },
    create: jest.fn(() => ({
      post: jest.fn().mockResolvedValue({})
    })),
    defaults: {
      headers: {
        common: {
          Authorization: 'Bearer example_token'
        }
      }
    }
  };
});

describe('Reservations component', () => {
  it('renders Reservations component', () => {
    const { getByText } = render(<Reservations />)
    expect(getByText('Varauskalenteri')).toBeInTheDocument()
    expect(getByText('Aktiiviset YKV-kirjaukset')).toBeInTheDocument()
  })

  it('renders the booking form', () => {
    const { getByText, queryByText } = render(<Reservations />)

    const reservationButton = getByText('Lisää uusi tapahtuma')
    fireEvent.click(reservationButton)

    expect(queryByText('Lisää tapahtuma')).toBeInTheDocument()

    const closeButton = getByText('Sulje')
    fireEvent.click(closeButton)
  })

  // it('booking with role 1', async () => {
  //   const { getByText, getByPlaceholderText, queryByText } = render(<Reservations />)

  //   const user = {
  //     username: 'example_username',
  //     email: 'example_email@example.com',
  //     telegram: 'example_telegram',
  //     role: 1,
  //     keys: {},
  //     organization: {},
  //     rights_for_reservation: true
  //   };

  //   localStorage.setItem('loggedUser', JSON.stringify(user))
  //   localStorage.setItem('ACCESS_TOKEN', 'example_token');

  //   const reservationButton = getByText('Lisää uusi tapahtuma')
  //   fireEvent.click(reservationButton)

  //   expect(queryByText('Lisää tapahtuma')).toBeInTheDocument()

  //   fireEvent.change(getByPlaceholderText('Tapahtuman nimi'), { target: { value: 'Test Event' } });
  //   fireEvent.change(getByPlaceholderText('Järjestäjä'), { target: { value: 'Test Organizer' } });
  //   fireEvent.change(getByPlaceholderText('Vastuuhenkilö'), { target: { value: 'Test Responsible' } });
  //   fireEvent.change(getByPlaceholderText('Tapahtuman kuvaus'), { target: { value: 'Test Description' } });
  //   fireEvent.change(getByText('Valitse avoimuus'), { target: {value: 'Avoin tapahtuma' } });
  //   fireEvent.change(getByText('Valitse huone'), { target: { value: 'Kokoushuone' } })

  //   const saveButton = getByText('Tallenna')
  //   fireEvent.click(saveButton);

  //   await waitFor(() => {
  //     expect(axiosClient.post).toHaveBeenCalledWith('events/create_event', {
  //       start: expect.any(String),
  //       end: expect.any(String),
  //       title: 'Test Event',
  //       organizer: 'Test Organizer',
  //       description: 'Test Description',
  //       responsible: 'Test Responsible',
  //       isOpen: 'Avoin tapahtuma',
  //       room: 'Kokoushuone',
  //       id: expect.any(Number),
  //     });
  //   });
  // })
})
