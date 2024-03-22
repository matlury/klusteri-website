import { render } from '@testing-library/react'
import ChristinaRegina from '../../src/pages/christina_regina'
import '@testing-library/jest-dom'

// Mock the image import
jest.mock('../ChristinaRegina.png', () => 'placeholder.png')

describe('ChristinaRegina Component', () => {
  it('renders without errors', () => {
    const { getByText } = render(<ChristinaRegina />)
    
    // Assert that the component renders the appropriate content
    expect(getByText('Christina Regina')).toBeInTheDocument()
    expect(getByText(/Matlun klusteri/)).toBeInTheDocument(); // Use regular expression matcher
    
  })
})
