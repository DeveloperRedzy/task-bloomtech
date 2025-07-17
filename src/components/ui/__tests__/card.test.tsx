import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../test/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../card';
import { createRef } from 'react';

describe('Card Component', () => {
  describe('Card', () => {
    it('should render with default props', () => {
      render(<Card data-testid='card'>Card content</Card>);

      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass(
        'rounded-lg',
        'border',
        'bg-card',
        'text-card-foreground',
        'shadow-sm'
      );
      expect(card).toHaveTextContent('Card content');
    });

    it('should render with custom className', () => {
      render(
        <Card className='custom-card' data-testid='card'>
          Content
        </Card>
      );

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-card');
    });

    it('should forward ref correctly', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Card ref={ref}>Content</Card>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CardHeader', () => {
    it('should render with default props', () => {
      render(<CardHeader data-testid='header'>Header content</CardHeader>);

      const header = screen.getByTestId('header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6');
      expect(header).toHaveTextContent('Header content');
    });

    it('should render with custom className', () => {
      render(
        <CardHeader className='custom-header' data-testid='header'>
          Content
        </CardHeader>
      );

      const header = screen.getByTestId('header');
      expect(header).toHaveClass('custom-header');
    });

    it('should forward ref correctly', () => {
      const ref = createRef<HTMLDivElement>();
      render(<CardHeader ref={ref}>Content</CardHeader>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CardTitle', () => {
    it('should render with default props', () => {
      render(<CardTitle data-testid='title'>Title content</CardTitle>);

      const title = screen.getByTestId('title');
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H3');
      expect(title).toHaveClass(
        'text-2xl',
        'font-semibold',
        'leading-none',
        'tracking-tight'
      );
      expect(title).toHaveTextContent('Title content');
    });

    it('should render with custom className', () => {
      render(
        <CardTitle className='custom-title' data-testid='title'>
          Content
        </CardTitle>
      );

      const title = screen.getByTestId('title');
      expect(title).toHaveClass('custom-title');
    });

    it('should forward ref correctly', () => {
      const ref = createRef<HTMLParagraphElement>();
      render(<CardTitle ref={ref}>Content</CardTitle>);

      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    });
  });

  describe('CardDescription', () => {
    it('should render with default props', () => {
      render(
        <CardDescription data-testid='description'>
          Description content
        </CardDescription>
      );

      const description = screen.getByTestId('description');
      expect(description).toBeInTheDocument();
      expect(description.tagName).toBe('P');
      expect(description).toHaveClass('text-sm', 'text-muted-foreground');
      expect(description).toHaveTextContent('Description content');
    });

    it('should render with custom className', () => {
      render(
        <CardDescription className='custom-desc' data-testid='description'>
          Content
        </CardDescription>
      );

      const description = screen.getByTestId('description');
      expect(description).toHaveClass('custom-desc');
    });
  });

  describe('CardContent', () => {
    it('should render with default props', () => {
      render(<CardContent data-testid='content'>Content area</CardContent>);

      const content = screen.getByTestId('content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('p-6', 'pt-0');
      expect(content).toHaveTextContent('Content area');
    });

    it('should render with custom className', () => {
      render(
        <CardContent className='custom-content' data-testid='content'>
          Content
        </CardContent>
      );

      const content = screen.getByTestId('content');
      expect(content).toHaveClass('custom-content');
    });
  });

  describe('CardFooter', () => {
    it('should render with default props', () => {
      render(<CardFooter data-testid='footer'>Footer content</CardFooter>);

      const footer = screen.getByTestId('footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0');
      expect(footer).toHaveTextContent('Footer content');
    });

    it('should render with custom className', () => {
      render(
        <CardFooter className='custom-footer' data-testid='footer'>
          Content
        </CardFooter>
      );

      const footer = screen.getByTestId('footer');
      expect(footer).toHaveClass('custom-footer');
    });
  });

  describe('Card Component Integration', () => {
    it('should render complete card with all sub-components', () => {
      render(
        <Card data-testid='full-card'>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Main content area</p>
          </CardContent>
          <CardFooter>
            <button>Action Button</button>
          </CardFooter>
        </Card>
      );

      const card = screen.getByTestId('full-card');
      expect(card).toBeInTheDocument();

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Main content area')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Action Button' })
      ).toBeInTheDocument();
    });
  });
});
