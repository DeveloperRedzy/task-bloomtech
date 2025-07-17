import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/utils';
import { Input } from '../input';
import { createRef } from 'react';

describe('Input Component', () => {
  it('should render with default props', () => {
    render(<Input placeholder='Enter text' />);

    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('flex', 'h-10', 'w-full', 'rounded-md');
  });

  it('should render with custom className', () => {
    render(<Input className='custom-class' />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('should render with error state', () => {
    render(<Input error placeholder='Error input' />);

    const input = screen.getByPlaceholderText('Error input');
    expect(input).toHaveClass(
      'border-destructive',
      'focus-visible:ring-destructive'
    );
  });

  it('should render different input types', () => {
    const { rerender } = render(<Input type='email' data-testid='input' />);

    let input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'email');

    rerender(<Input type='password' data-testid='input' />);
    input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'password');

    rerender(<Input type='number' data-testid='input' />);
    input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('should handle user input', () => {
    render(<Input placeholder='Type here' />);

    const input = screen.getByPlaceholderText('Type here') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test value' } });

    expect(input.value).toBe('test value');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled placeholder='Disabled input' />);

    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
    expect(input).toHaveClass(
      'disabled:cursor-not-allowed',
      'disabled:opacity-50'
    );
  });

  it('should forward ref correctly', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('should handle onChange events', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} placeholder='Change test' />);

    const input = screen.getByPlaceholderText('Change test');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should handle focus and blur events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    render(
      <Input
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder='Focus test'
      />
    );

    const input = screen.getByPlaceholderText('Focus test');

    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should support all standard input attributes', () => {
    render(
      <Input
        placeholder='Test input'
        required
        readOnly
        autoComplete='email'
        maxLength={50}
        data-testid='full-input'
      />
    );

    const input = screen.getByTestId('full-input');
    expect(input).toHaveAttribute('placeholder', 'Test input');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveAttribute('autocomplete', 'email');
    expect(input).toHaveAttribute('maxlength', '50');
  });
});
