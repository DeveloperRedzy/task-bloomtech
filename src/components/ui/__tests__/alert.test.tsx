import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../test/utils';
import { Alert, AlertDescription, AlertTitle } from '../alert';
import { createRef } from 'react';

describe('Alert Component', () => {
  describe('Alert', () => {
    it('should render with default props', () => {
      render(<Alert data-testid='alert'>Alert content</Alert>);

      const alert = screen.getByTestId('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute('role', 'alert');
      expect(alert).toHaveClass(
        'relative',
        'w-full',
        'rounded-lg',
        'border',
        'p-4'
      );
      expect(alert).toHaveTextContent('Alert content');
    });

    it('should render with default variant', () => {
      render(<Alert data-testid='alert'>Default alert</Alert>);

      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('bg-background', 'text-foreground');
    });

    it('should render destructive variant correctly', () => {
      render(
        <Alert variant='destructive' data-testid='alert'>
          Error alert
        </Alert>
      );

      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('border-destructive/50', 'text-destructive');
    });

    it('should render success variant correctly', () => {
      render(
        <Alert variant='success' data-testid='alert'>
          Success alert
        </Alert>
      );

      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('border-green-500/50', 'text-green-700');
    });

    it('should render warning variant correctly', () => {
      render(
        <Alert variant='warning' data-testid='alert'>
          Warning alert
        </Alert>
      );

      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('border-yellow-500/50', 'text-yellow-700');
    });

    it('should render with custom className', () => {
      render(
        <Alert className='custom-alert' data-testid='alert'>
          Content
        </Alert>
      );

      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('custom-alert');
    });

    it('should forward ref correctly', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Alert ref={ref}>Content</Alert>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should have proper accessibility attributes', () => {
      render(<Alert data-testid='alert'>Accessible alert</Alert>);

      const alert = screen.getByTestId('alert');
      expect(alert).toHaveAttribute('role', 'alert');
    });
  });

  describe('AlertTitle', () => {
    it('should render with default props', () => {
      render(<AlertTitle data-testid='title'>Alert Title</AlertTitle>);

      const title = screen.getByTestId('title');
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H5');
      expect(title).toHaveClass(
        'mb-1',
        'font-medium',
        'leading-none',
        'tracking-tight'
      );
      expect(title).toHaveTextContent('Alert Title');
    });

    it('should render with custom className', () => {
      render(
        <AlertTitle className='custom-title' data-testid='title'>
          Title
        </AlertTitle>
      );

      const title = screen.getByTestId('title');
      expect(title).toHaveClass('custom-title');
    });

    it('should forward ref correctly', () => {
      const ref = createRef<HTMLParagraphElement>();
      render(<AlertTitle ref={ref}>Title</AlertTitle>);

      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    });
  });

  describe('AlertDescription', () => {
    it('should render with default props', () => {
      render(
        <AlertDescription data-testid='description'>
          Alert description
        </AlertDescription>
      );

      const description = screen.getByTestId('description');
      expect(description).toBeInTheDocument();
      expect(description.tagName).toBe('DIV');
      expect(description).toHaveClass('text-sm');
      expect(description).toHaveTextContent('Alert description');
    });

    it('should render with custom className', () => {
      render(
        <AlertDescription className='custom-desc' data-testid='description'>
          Description
        </AlertDescription>
      );

      const description = screen.getByTestId('description');
      expect(description).toHaveClass('custom-desc');
    });

    it('should forward ref correctly', () => {
      const ref = createRef<HTMLDivElement>();
      render(<AlertDescription ref={ref}>Description</AlertDescription>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Alert Component Integration', () => {
    it('should render complete alert with title and description', () => {
      render(
        <Alert data-testid='full-alert'>
          <AlertTitle>Important Notice</AlertTitle>
          <AlertDescription>
            This is an important message that users should be aware of.
          </AlertDescription>
        </Alert>
      );

      const alert = screen.getByTestId('full-alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute('role', 'alert');

      expect(screen.getByText('Important Notice')).toBeInTheDocument();
      expect(
        screen.getByText(/This is an important message/)
      ).toBeInTheDocument();
    });

    it('should work with all variants and content', () => {
      const variants: Array<'default' | 'destructive' | 'success' | 'warning'> =
        ['default', 'destructive', 'success', 'warning'];

      variants.forEach((variant, index) => {
        const { unmount } = render(
          <Alert variant={variant} data-testid={`alert-${variant}`}>
            <AlertTitle>{variant} Alert</AlertTitle>
            <AlertDescription>
              This is a {variant} alert message.
            </AlertDescription>
          </Alert>
        );

        const alert = screen.getByTestId(`alert-${variant}`);
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveAttribute('role', 'alert');
        expect(screen.getByText(`${variant} Alert`)).toBeInTheDocument();
        expect(
          screen.getByText(`This is a ${variant} alert message.`)
        ).toBeInTheDocument();

        unmount();
      });
    });

    it('should handle icon integration properly', () => {
      render(
        <Alert data-testid='icon-alert'>
          <svg
            data-testid='alert-icon'
            viewBox='0 0 24 24'
            width='16'
            height='16'
          >
            <path d='M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z' />
          </svg>
          <AlertTitle>Alert with Icon</AlertTitle>
          <AlertDescription>This alert includes an icon.</AlertDescription>
        </Alert>
      );

      expect(screen.getByTestId('icon-alert')).toBeInTheDocument();
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
      expect(screen.getByText('Alert with Icon')).toBeInTheDocument();
      expect(
        screen.getByText('This alert includes an icon.')
      ).toBeInTheDocument();
    });
  });
});
