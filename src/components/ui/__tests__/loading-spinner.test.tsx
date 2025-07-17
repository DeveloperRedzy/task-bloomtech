import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../test/utils';
import LoadingSpinner from '../loading-spinner';

describe('LoadingSpinner Component', () => {
  it('should render with default props', () => {
    render(<LoadingSpinner data-testid='spinner' />);

    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass(
      'animate-spin',
      'rounded-full',
      'border-2',
      'border-transparent',
      'border-t-current'
    );
  });

  it('should render with default size (md)', () => {
    render(<LoadingSpinner data-testid='spinner' />);

    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('h-6', 'w-6');
  });

  it('should render with default variant (default)', () => {
    render(<LoadingSpinner data-testid='spinner' />);

    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('text-foreground');
  });

  it('should render different sizes correctly', () => {
    const { rerender } = render(
      <LoadingSpinner size='sm' data-testid='spinner' />
    );

    let spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('h-4', 'w-4');

    rerender(<LoadingSpinner size='md' data-testid='spinner' />);
    spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('h-6', 'w-6');

    rerender(<LoadingSpinner size='lg' data-testid='spinner' />);
    spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('h-8', 'w-8');

    rerender(<LoadingSpinner size='xl' data-testid='spinner' />);
    spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('h-12', 'w-12');
  });

  it('should render different variants correctly', () => {
    const { rerender } = render(
      <LoadingSpinner variant='default' data-testid='spinner' />
    );

    let spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('text-foreground');

    rerender(<LoadingSpinner variant='primary' data-testid='spinner' />);
    spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('text-primary');

    rerender(<LoadingSpinner variant='secondary' data-testid='spinner' />);
    spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('text-secondary');

    rerender(<LoadingSpinner variant='muted' data-testid='spinner' />);
    spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('text-muted-foreground');
  });

  it('should render with custom className', () => {
    render(<LoadingSpinner className='custom-spinner' data-testid='spinner' />);

    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('custom-spinner');
  });

  it('should combine size and variant props correctly', () => {
    render(
      <LoadingSpinner size='lg' variant='primary' data-testid='spinner' />
    );

    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('h-8', 'w-8', 'text-primary');
  });

  it('should maintain animation and border styles', () => {
    render(<LoadingSpinner data-testid='spinner' />);

    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass(
      'animate-spin',
      'rounded-full',
      'border-2',
      'border-transparent',
      'border-t-current'
    );
  });

  it('should render as div element', () => {
    render(<LoadingSpinner data-testid='spinner' />);

    const spinner = screen.getByTestId('spinner');
    expect(spinner.tagName).toBe('DIV');
  });

  it('should handle all size and variant combinations', () => {
    const sizes: Array<'sm' | 'md' | 'lg' | 'xl'> = ['sm', 'md', 'lg', 'xl'];
    const variants: Array<'default' | 'primary' | 'secondary' | 'muted'> = [
      'default',
      'primary',
      'secondary',
      'muted',
    ];

    sizes.forEach((size) => {
      variants.forEach((variant) => {
        const { unmount } = render(
          <LoadingSpinner
            size={size}
            variant={variant}
            data-testid={`spinner-${size}-${variant}`}
          />
        );

        const spinner = screen.getByTestId(`spinner-${size}-${variant}`);
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveClass('animate-spin');

        unmount();
      });
    });
  });
});
