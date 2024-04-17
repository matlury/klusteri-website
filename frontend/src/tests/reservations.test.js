import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import Reservations from '../../src/pages/reservations'

test('renders Reservations component', () => {
  const { getByText } = render(<Reservations />)

  expect(getByText('Varauskalenteri')).toBeInTheDocument()

})