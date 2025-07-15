import * as React from 'react';
import { cn } from '../../lib/utils';

// Form root component
export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, ...props }, ref) => (
    <form ref={ref} className={cn('space-y-6', className)} {...props} />
  )
);
Form.displayName = 'Form';

// Form field wrapper
export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: string;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, error, children, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-2', className)} {...props}>
      {children}
      {error && <p className='text-sm text-destructive'>{error}</p>}
    </div>
  )
);
FormField.displayName = 'FormField';

// Form error message component
export interface FormErrorProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

const FormError = React.forwardRef<HTMLParagraphElement, FormErrorProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-destructive', className)}
      {...props}
    >
      {children}
    </p>
  )
);
FormError.displayName = 'FormError';

// Form description component
export interface FormDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  FormDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
FormDescription.displayName = 'FormDescription';

// Form message component (for success or general messages)
export interface FormMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'success';
  children: React.ReactNode;
}

const FormMessage = React.forwardRef<HTMLDivElement, FormMessageProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variantClasses = {
      default: 'text-sm text-muted-foreground',
      destructive: 'text-sm text-destructive',
      success: 'text-sm text-green-600 dark:text-green-400',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-md p-3 border',
          variant === 'destructive' &&
            'bg-destructive/10 border-destructive/20',
          variant === 'success' &&
            'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          variant === 'default' && 'bg-muted border-border',
          className
        )}
        {...props}
      >
        <p className={variantClasses[variant]}>{children}</p>
      </div>
    );
  }
);
FormMessage.displayName = 'FormMessage';

export { Form, FormField, FormError, FormDescription, FormMessage };
