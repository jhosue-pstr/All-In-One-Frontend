import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ToggleSwitch } from './ToggleSwitch'

describe('ToggleSwitch', () => {
  it('should render with label', () => {
    render(<ToggleSwitch checked={false} onChange={vi.fn()} label="Activar" />)
    expect(screen.getByText('Activar')).toBeInTheDocument()
  })

  it('should call onChange when toggled', () => {
    const onChange = vi.fn()
    render(<ToggleSwitch checked={false} onChange={onChange} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('should reflect checked state', () => {
    const { rerender } = render(<ToggleSwitch checked={false} onChange={vi.fn()} />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
    rerender(<ToggleSwitch checked={true} onChange={vi.fn()} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<ToggleSwitch checked={false} onChange={vi.fn()} disabled />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('should not render label when not provided', () => {
    const { container } = render(<ToggleSwitch checked={false} onChange={vi.fn()} />)
    expect(container.querySelector('.toggle-label')).toBeNull()
  })
})
