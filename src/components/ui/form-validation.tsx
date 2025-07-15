import React from 'react';
import { cn } from '../../lib/utils';

export interface ValidationMessageProps {
  message?: string;
  type?: 'error' | 'warning' | 'info' | 'success';
  className?: string;
}

export const ValidationMessage: React.FC<ValidationMessageProps> = ({
  message,
  type = 'error',
  className,
}) => {
  if (!message) return null;

  const typeStyles = {
    error: 'text-destructive',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
    success: 'text-green-600',
  };

  const iconMap = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    success: '✅',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm',
        typeStyles[type],
        className
      )}
    >
      <span className='text-xs'>{iconMap[type]}</span>
      <span>{message}</span>
    </div>
  );
};

export interface FieldRequiredIndicatorProps {
  required?: boolean;
  className?: string;
}

export const FieldRequiredIndicator: React.FC<FieldRequiredIndicatorProps> = ({
  required = false,
  className,
}) => {
  if (!required) return null;

  return (
    <span className={cn('text-destructive text-sm ml-1', className)}>*</span>
  );
};

export interface FieldHelpTextProps {
  text?: string;
  className?: string;
}

export const FieldHelpText: React.FC<FieldHelpTextProps> = ({
  text,
  className,
}) => {
  if (!text) return null;

  return (
    <div className={cn('text-sm text-muted-foreground mt-1', className)}>
      {text}
    </div>
  );
};

export interface CharacterCountProps {
  current: number;
  max: number;
  className?: string;
  showOnlyWhenNearLimit?: boolean;
  warningThreshold?: number;
}

export const CharacterCount: React.FC<CharacterCountProps> = ({
  current,
  max,
  className,
  showOnlyWhenNearLimit = true,
  warningThreshold = 0.8,
}) => {
  const percentage = current / max;
  const isNearLimit = percentage >= warningThreshold;
  const isOverLimit = current > max;

  if (showOnlyWhenNearLimit && !isNearLimit) {
    return null;
  }

  return (
    <div
      className={cn(
        'text-xs text-right mt-1',
        isOverLimit
          ? 'text-destructive'
          : isNearLimit
          ? 'text-yellow-600'
          : 'text-muted-foreground',
        className
      )}
    >
      {current} / {max}
    </div>
  );
};

export interface FormFieldWrapperProps {
  children: React.ReactNode;
  label?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
}

export const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  children,
  label,
  required = false,
  error,
  helpText,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
          {label}
          <FieldRequiredIndicator required={required} />
        </label>
      )}

      {children}

      {error && <ValidationMessage message={error} type='error' />}
      {!error && helpText && <FieldHelpText text={helpText} />}
    </div>
  );
};

export interface ValidatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  showCharacterCount?: boolean;
  maxLength?: number;
  validationIcon?: boolean;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  label,
  error,
  helpText,
  required = false,
  showCharacterCount = false,
  maxLength,
  validationIcon = true,
  className,
  value,
  ...props
}) => {
  const hasError = !!error;
  const isValid = !hasError && value && String(value).length > 0;

  return (
    <FormFieldWrapper
      label={label}
      required={required}
      error={error}
      helpText={helpText}
    >
      <div className='relative'>
        <input
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            hasError && 'border-destructive focus-visible:ring-destructive',
            isValid && 'border-green-500 focus-visible:ring-green-500',
            validationIcon && (hasError || isValid) && 'pr-10',
            className
          )}
          value={value}
          maxLength={maxLength}
          {...props}
        />

        {validationIcon && hasError && (
          <div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-destructive'>
            ❌
          </div>
        )}

        {validationIcon && isValid && (
          <div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600'>
            ✅
          </div>
        )}
      </div>

      {showCharacterCount && maxLength && (
        <CharacterCount current={String(value || '').length} max={maxLength} />
      )}
    </FormFieldWrapper>
  );
};

export interface ValidatedTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  showCharacterCount?: boolean;
  maxLength?: number;
}

export const ValidatedTextarea: React.FC<ValidatedTextareaProps> = ({
  label,
  error,
  helpText,
  required = false,
  showCharacterCount = true,
  maxLength,
  className,
  value,
  ...props
}) => {
  const hasError = !!error;

  return (
    <FormFieldWrapper
      label={label}
      required={required}
      error={error}
      helpText={helpText}
    >
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          hasError && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        value={value}
        maxLength={maxLength}
        {...props}
      />

      {showCharacterCount && maxLength && (
        <CharacterCount current={String(value || '').length} max={maxLength} />
      )}
    </FormFieldWrapper>
  );
};
