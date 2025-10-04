/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FileUpload from '../forms/FileUpload'

// Mock react-dropzone
jest.mock('react-dropzone', () => ({
  useDropzone: () => ({
    getRootProps: () => ({
      'data-testid': 'dropzone'
    }),
    getInputProps: () => ({
      'data-testid': 'file-input'
    }),
    isDragActive: false
  })
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>
  }
}))

describe('FileUpload', () => {
  const mockOnFileSelect = jest.fn()
  const defaultProps = {
    onFileSelect: mockOnFileSelect,
    acceptedTypes: ['.csv', '.json'],
    maxSize: 50 * 1024 * 1024
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders upload area', () => {
    render(<FileUpload {...defaultProps} />)
    
    expect(screen.getByText(/drag & drop a file here/i)).toBeInTheDocument()
    expect(screen.getByText(/accepted formats/i)).toBeInTheDocument()
  })

  it('shows accepted file types', () => {
    render(<FileUpload {...defaultProps} />)
    
    expect(screen.getByText('Accepted formats: .csv, .json')).toBeInTheDocument()
  })

  it('shows max file size', () => {
    render(<FileUpload {...defaultProps} />)
    
    expect(screen.getByText('Max size: 50MB')).toBeInTheDocument()
  })

  it('can be disabled', () => {
    render(<FileUpload {...defaultProps} disabled={true} />)
    
    const dropzone = screen.getByTestId('dropzone')
    expect(dropzone).toHaveClass('opacity-50', 'cursor-not-allowed')
  })

  it('applies custom className', () => {
    render(<FileUpload {...defaultProps} className="custom-class" />)
    
    const dropzone = screen.getByTestId('dropzone')
    expect(dropzone).toHaveClass('custom-class')
  })
})
