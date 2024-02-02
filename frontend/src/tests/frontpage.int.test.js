import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import FrontPage from '../../src/pages/frontpage'

test('renders FrontPage component', () => {
  const { getByText } = render(<FrontPage />)

  expect(getByText('Ilotalo')).toBeInTheDocument()
  expect(getByText('”sub hoc tecto cives academici excoluntur”?')).toBeInTheDocument()
})
