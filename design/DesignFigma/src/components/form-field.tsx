import React, { useState } from 'react';
import { AlertCircle, HelpCircle, Check } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from './ui/utils';

export interface ValidationRule {
  validate: (value: string) => boolean;
  message: string;
}

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  validationRules?: ValidationRule[];
  mask?: (value: string) => string;
  className?: string;
}

export function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  helpText,
  required = false,
  disabled = false,
  validationRules = [],
  mask,
  className,
}: FormFieldProps) {
  const [touched, setTouched] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleBlur = () => {
    setTouched(true);
    validateField(value);
    onBlur?.();
  };

  const validateField = (val: string) => {
    const newErrors: string[] = [];
    
    if (required && !val.trim()) {
      newErrors.push(`${label} is required`);
    }
    
    validationRules.forEach((rule) => {
      if (!rule.validate(val)) {
        newErrors.push(rule.message);
      }
    });
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    if (mask) {
      newValue = mask(newValue);
    }
    
    onChange(newValue);
    
    if (touched) {
      validateField(newValue);
    }
  };

  const isValid = touched && errors.length === 0 && value.trim() !== '';
  const isInvalid = touched && errors.length > 0;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label with help icon */}
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="flex items-center gap-1">
          {label}
          {required && <span className="text-danger">*</span>}
        </Label>
        {helpText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-muted-foreground hover:text-foreground">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">{helpText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Input with validation state */}
      <div className="relative">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            isInvalid && 'border-danger focus-visible:ring-danger',
            isValid && 'border-success focus-visible:ring-success',
            'pr-10'
          )}
          aria-invalid={isInvalid}
          aria-describedby={isInvalid ? `${id}-error` : undefined}
        />
        
        {/* Validation icon */}
        {touched && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {isValid && <Check className="h-4 w-4 text-success" />}
            {isInvalid && <AlertCircle className="h-4 w-4 text-danger" />}
          </div>
        )}
      </div>

      {/* Error messages */}
      {isInvalid && (
        <div id={`${id}-error`} className="space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-danger flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// Common validation rules
export const ValidationRules = {
  email: {
    validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address',
  },
  phone: {
    validate: (value: string) => /^[\d\s\-\+\(\)]+$/.test(value),
    message: 'Please enter a valid phone number',
  },
  minLength: (length: number) => ({
    validate: (value: string) => value.length >= length,
    message: `Must be at least ${length} characters`,
  }),
  maxLength: (length: number) => ({
    validate: (value: string) => value.length <= length,
    message: `Must be no more than ${length} characters`,
  }),
  pattern: (pattern: RegExp, message: string) => ({
    validate: (value: string) => pattern.test(value),
    message,
  }),
};

// Common input masks
export const InputMasks = {
  date: (value: string) => {
    // Format: MM/DD/YYYY
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  },
  phone: (value: string) => {
    // Format: (XXX) XXX-XXXX
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  },
  currency: (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return '';
    const number = parseInt(digits, 10) / 100;
    return number.toFixed(2);
  },
};
