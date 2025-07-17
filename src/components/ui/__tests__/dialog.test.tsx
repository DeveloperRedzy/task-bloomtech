import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '../../../test/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../dialog';

describe('Dialog Component', () => {
  beforeEach(() => {
    // Reset body overflow style before each test
    document.body.style.overflow = 'unset';
  });

  afterEach(() => {
    cleanup();
    // Clean up body overflow style after each test
    document.body.style.overflow = 'unset';
  });

  describe('Dialog', () => {
    it('should not render when closed', () => {
      const onOpenChange = vi.fn();
      render(
        <Dialog open={false} onOpenChange={onOpenChange}>
          <div data-testid='dialog-content'>Dialog content</div>
        </Dialog>
      );

      expect(screen.queryByTestId('dialog-content')).not.toBeInTheDocument();
    });

    it('should render when open', () => {
      const onOpenChange = vi.fn();
      render(
        <Dialog open={true} onOpenChange={onOpenChange}>
          <div data-testid='dialog-content'>Dialog content</div>
        </Dialog>
      );

      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
    });

    it('should render backdrop when open', () => {
      const onOpenChange = vi.fn();
      render(
        <Dialog open={true} onOpenChange={onOpenChange}>
          <div>Content</div>
        </Dialog>
      );

      const backdrop = document.querySelector(
        '.fixed.inset-0.bg-black\\/50.backdrop-blur-sm'
      );
      expect(backdrop).toBeInTheDocument();
    });

    it('should call onOpenChange when backdrop is clicked', () => {
      const onOpenChange = vi.fn();
      render(
        <Dialog open={true} onOpenChange={onOpenChange}>
          <div>Content</div>
        </Dialog>
      );

      const backdrop = document.querySelector(
        '.fixed.inset-0.bg-black\\/50.backdrop-blur-sm'
      );
      fireEvent.click(backdrop!);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should call onOpenChange when Escape key is pressed', () => {
      const onOpenChange = vi.fn();
      render(
        <Dialog open={true} onOpenChange={onOpenChange}>
          <div>Content</div>
        </Dialog>
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should not call onOpenChange for other keys', () => {
      const onOpenChange = vi.fn();
      render(
        <Dialog open={true} onOpenChange={onOpenChange}>
          <div>Content</div>
        </Dialog>
      );

      fireEvent.keyDown(document, { key: 'Enter' });
      fireEvent.keyDown(document, { key: 'Space' });

      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('should set body overflow to hidden when open', () => {
      const onOpenChange = vi.fn();
      render(
        <Dialog open={true} onOpenChange={onOpenChange}>
          <div>Content</div>
        </Dialog>
      );

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should restore body overflow when closed', () => {
      const onOpenChange = vi.fn();
      const { rerender } = render(
        <Dialog open={true} onOpenChange={onOpenChange}>
          <div>Content</div>
        </Dialog>
      );

      expect(document.body.style.overflow).toBe('hidden');

      rerender(
        <Dialog open={false} onOpenChange={onOpenChange}>
          <div>Content</div>
        </Dialog>
      );

      expect(document.body.style.overflow).toBe('unset');
    });
  });

  describe('DialogContent', () => {
    it('should render with default props', () => {
      render(
        <DialogContent data-testid='dialog-content'>Content</DialogContent>
      );

      const content = screen.getByTestId('dialog-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass(
        'fixed',
        'w-full',
        'max-w-lg',
        'gap-4',
        'border',
        'bg-background'
      );
    });

    it('should render with custom className', () => {
      render(
        <DialogContent className='custom-content' data-testid='dialog-content'>
          Content
        </DialogContent>
      );

      const content = screen.getByTestId('dialog-content');
      expect(content).toHaveClass('custom-content');
    });
  });

  describe('DialogHeader', () => {
    it('should render with default props', () => {
      render(<DialogHeader data-testid='dialog-header'>Header</DialogHeader>);

      const header = screen.getByTestId('dialog-header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass(
        'flex',
        'flex-col',
        'space-y-1.5',
        'text-center'
      );
    });

    it('should render with custom className', () => {
      render(
        <DialogHeader className='custom-header' data-testid='dialog-header'>
          Header
        </DialogHeader>
      );

      const header = screen.getByTestId('dialog-header');
      expect(header).toHaveClass('custom-header');
    });
  });

  describe('DialogTitle', () => {
    it('should render with default props', () => {
      render(<DialogTitle data-testid='dialog-title'>Title</DialogTitle>);

      const title = screen.getByTestId('dialog-title');
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H2');
      expect(title).toHaveClass(
        'text-lg',
        'font-semibold',
        'leading-none',
        'tracking-tight'
      );
    });

    it('should render with custom className', () => {
      render(
        <DialogTitle className='custom-title' data-testid='dialog-title'>
          Title
        </DialogTitle>
      );

      const title = screen.getByTestId('dialog-title');
      expect(title).toHaveClass('custom-title');
    });
  });

  describe('DialogDescription', () => {
    it('should render with default props', () => {
      render(
        <DialogDescription data-testid='dialog-description'>
          Description
        </DialogDescription>
      );

      const description = screen.getByTestId('dialog-description');
      expect(description).toBeInTheDocument();
      expect(description.tagName).toBe('P');
      expect(description).toHaveClass('text-sm', 'text-muted-foreground');
    });

    it('should render with custom className', () => {
      render(
        <DialogDescription
          className='custom-desc'
          data-testid='dialog-description'
        >
          Description
        </DialogDescription>
      );

      const description = screen.getByTestId('dialog-description');
      expect(description).toHaveClass('custom-desc');
    });
  });

  describe('DialogFooter', () => {
    it('should render with default props', () => {
      render(<DialogFooter data-testid='dialog-footer'>Footer</DialogFooter>);

      const footer = screen.getByTestId('dialog-footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass(
        'flex',
        'flex-col-reverse',
        'sm:flex-row',
        'sm:justify-end',
        'sm:space-x-2'
      );
    });

    it('should render with custom className', () => {
      render(
        <DialogFooter className='custom-footer' data-testid='dialog-footer'>
          Footer
        </DialogFooter>
      );

      const footer = screen.getByTestId('dialog-footer');
      expect(footer).toHaveClass('custom-footer');
    });
  });

  describe('Dialog Integration', () => {
    it('should render complete dialog with all sub-components', () => {
      const onOpenChange = vi.fn();
      render(
        <Dialog open={true} onOpenChange={onOpenChange}>
          <DialogContent data-testid='full-dialog'>
            <DialogHeader>
              <DialogTitle>Test Dialog</DialogTitle>
              <DialogDescription>
                This is a test dialog description.
              </DialogDescription>
            </DialogHeader>
            <div>Main content</div>
            <DialogFooter>
              <button>Cancel</button>
              <button>Confirm</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByTestId('full-dialog')).toBeInTheDocument();
      expect(screen.getByText('Test Dialog')).toBeInTheDocument();
      expect(
        screen.getByText('This is a test dialog description.')
      ).toBeInTheDocument();
      expect(screen.getByText('Main content')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Confirm' })
      ).toBeInTheDocument();
    });

    it('should handle open/close lifecycle properly', () => {
      const onOpenChange = vi.fn();
      const { rerender } = render(
        <Dialog open={false} onOpenChange={onOpenChange}>
          <DialogContent>Content</DialogContent>
        </Dialog>
      );

      // Initially closed
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
      expect(document.body.style.overflow).toBe('unset');

      // Open the dialog
      rerender(
        <Dialog open={true} onOpenChange={onOpenChange}>
          <DialogContent>Content</DialogContent>
        </Dialog>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(document.body.style.overflow).toBe('hidden');

      // Close the dialog
      rerender(
        <Dialog open={false} onOpenChange={onOpenChange}>
          <DialogContent>Content</DialogContent>
        </Dialog>
      );

      expect(screen.queryByText('Content')).not.toBeInTheDocument();
      expect(document.body.style.overflow).toBe('unset');
    });
  });
});
