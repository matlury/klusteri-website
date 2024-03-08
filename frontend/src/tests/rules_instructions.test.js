import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import Rules_and_Instructions from '../../src/pages/rules_instructions'

test('renders FrontPage component', () => {
  const { getByText } = render(<Rules_and_Instructions />)

  expect(getByText('Sivua rakennetaan vielä! :)')).toBeInTheDocument()

})