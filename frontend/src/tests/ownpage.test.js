import '@testing-library/jest-dom'
import { render} from '@testing-library/react'
import OwnPage from '../pages/ownpage'

const user = {
    username: 'example_username',
    email: 'example_email@example.com',
    telegram: 'example_telegram',
    role: 1
  }

  localStorage.setItem('loggedUser', JSON.stringify(user))
  

describe('OwnPage Component', () => {
    it('opens without logging in', () => {
        const { getByText } = render(<OwnPage isLoggedIn={false} />)
        expect(getByText('Kirjaudu sisään')).toBeInTheDocument()
    })

    it('opens with role 5', () => {
        const user = {
            username: 'example_username',
            email: 'example_email@example.com',
            telegram: 'example_telegram',
            role: 5
          }
        
        localStorage.setItem('loggedUser', JSON.stringify(user))
        const { getByText } = render(<OwnPage isLoggedIn={true} />)
        expect(getByText('Käyttäjänimi:')).toBeInTheDocument()
        expect(getByText('Telegram:')).toBeInTheDocument()
        expect(getByText('Rooli: 5')).toBeInTheDocument()
        expect(getByText('Tyyppi:')).toBeInTheDocument()
        expect(getByText('Myöntämispäivä:')).toBeInTheDocument()
        expect(getByText('Vahvista muutokset')).toBeInTheDocument()
        expect(getByText('Järjestöt')).toBeInTheDocument()
    })

    it('opens with role 1', () => {
        const user = {
            username: 'example_username',
            email: 'example_email@example.com',
            telegram: 'example_telegram',
            role: 1
          }
        localStorage.setItem('loggedUser', JSON.stringify(user))
        const { getByText, queryAllByText  } = render(<OwnPage isLoggedIn={true} />)
        
        expect(getByText('Käyttäjänimi:')).toBeInTheDocument()
        expect(queryAllByText(/Sähköposti:/).length).toBeGreaterThan(0)
        expect(getByText('Telegram:')).toBeInTheDocument()
        expect(getByText('Rooli: 1')).toBeInTheDocument()
        expect(getByText('Tyyppi:')).toBeInTheDocument()
        expect(getByText('Myöntämispäivä:')).toBeInTheDocument()
        expect(getByText('Vahvista muutokset')).toBeInTheDocument()
        expect(getByText('Järjestöt')).toBeInTheDocument()
    })
})
