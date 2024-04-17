import { getByLabelText, render, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import OwnKeys from '../../src/pages/ownkeys'
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

describe('OwnKeys Component', () => {
  it('opens without logging in', () => {
    const { getByText } = render(<OwnKeys isLoggedIn={false} />)
    expect(getByText('Kirjaudu sisään')).toBeInTheDocument()
  })

  it('opens with role 1', () => {
    const user = {
        username: 'example_username',
        email: 'example_email@example.com',
        telegram: 'example_telegram',
        role: 1
    };

    localStorage.setItem('loggedUser', JSON.stringify(user))
    const { getByText, getByLabelText } = render(<OwnKeys isLoggedIn={true} loggedUser={user}/>)
    
    expect(getByText('Kenestä otat vastuun?')).toBeInTheDocument()
    expect(getByText('Kirjaa sisään muita henkilöitä')).toBeInTheDocument()
  })

  it('taking responsibility works', async () => {
    const user = {
      username: 'example_username',
      email: 'example_email@example.com',
      telegram: 'example_telegram',
      role: 1
    };
  
    window.confirm = jest.fn(() => true);
    localStorage.setItem('ACCESS_TOKEN', 'example_token');
    
    const { getByText, getByLabelText } = render(<OwnKeys isLoggedIn={true} loggedUser={user}/>)
  
    const responsibile_for = getByLabelText('Kenestä otat vastuun?')
    fireEvent.change(responsibile_for, { target: { value: 'fuksit' } });
    
    const respButton = getByText('Ota vastuu')
    fireEvent.click(respButton)
  
    // Wait for the axiosClient.post to be called
    await waitFor(() => {
      expect(axiosClient.post).toHaveBeenCalledWith(
        '/ykv/create_responsibility',
        {
          email: 'example_email@example.com',
          login_time: expect.any(String),
          responsible_for: 'fuksit',
          username: 'example_username',
        })
      expect(axiosClient.get).toHaveBeenCalledWith(
        `listobjects/nightresponsibilities/`
      )
    });
  });
})