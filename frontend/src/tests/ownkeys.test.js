import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import OwnKeys from '../../src/pages/ownkeys'

test('renders OwnKeys component when not logged in', () => {
  const { getByText } = render(<OwnKeys isLoggedIn={false}/>)

  expect(getByText('Kirjaudu sisään')).toBeInTheDocument()

})

test('renders OwnKeys component when logged in', () => {
  const { getByText } = render(<OwnKeys isLoggedIn={true}/>)

  expect(getByText('Sivua rakennetaan vielä! :)')).toBeInTheDocument()

})