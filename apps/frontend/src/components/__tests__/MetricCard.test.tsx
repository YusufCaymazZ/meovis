/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import MetricCard from '../ui/MetricCard'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}))

describe('MetricCard', () => {
  const defaultProps = {
    title: 'Accuracy',
    value: 0.875,
    unit: '%'
  }

  it('renders metric card with title and value', () => {
    render(<MetricCard {...defaultProps} />)
    
    expect(screen.getByText('Accuracy')).toBeInTheDocument()
    expect(screen.getByText('0.875')).toBeInTheDocument()
    expect(screen.getByText('%')).toBeInTheDocument()
  })

  it('renders with description', () => {
    render(<MetricCard {...defaultProps} description="Model accuracy" />)
    
    expect(screen.getByText('Model accuracy')).toBeInTheDocument()
  })

  it('shows trend up', () => {
    render(<MetricCard {...defaultProps} trend="up" trendValue="+5%" />)
    
    expect(screen.getByText('+5%')).toBeInTheDocument()
  })

  it('shows trend down', () => {
    render(<MetricCard {...defaultProps} trend="down" trendValue="-2%" />)
    
    expect(screen.getByText('-2%')).toBeInTheDocument()
  })

  it('formats numeric values correctly', () => {
    render(<MetricCard {...defaultProps} value={0.123456} />)
    
    expect(screen.getByText('0.123')).toBeInTheDocument()
  })

  it('handles string values', () => {
    render(<MetricCard {...defaultProps} value="N/A" />)
    
    expect(screen.getByText('N/A')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<MetricCard {...defaultProps} className="custom-class" />)
    
    const card = screen.getByText('Accuracy').closest('div')
    expect(card).toHaveClass('custom-class')
  })
})
