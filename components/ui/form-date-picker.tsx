'use client'

import { forwardRef, useState } from 'react'
import { Calendar } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface FormDatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  label?: string
  value?: Date | string
  onChange?: (date: Date | null) => void
  error?: string
  helperText?: string
  required?: boolean
}

export const FormDatePicker = forwardRef<HTMLInputElement, FormDatePickerProps>(
  ({ label, value, onChange, error, helperText, required, className, id, ...props }, ref) => {
    const inputId = id || `date-${label?.toLowerCase().replace(/\s+/g, '-')}`
    const [dateValue, setDateValue] = useState<string>(() => {
      if (!value) return ''
      if (value instanceof Date) return format(value, 'yyyy-MM-dd')
      return value
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setDateValue(newValue)
      if (onChange) {
        onChange(newValue ? new Date(newValue) : null)
      }
    }

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={inputId} className={cn(required && 'after:content-["*"] after:ml-0.5 after:text-red-500')}>
            {label}
          </Label>
        )}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={ref}
            id={inputId}
            type="date"
            value={dateValue}
            onChange={handleChange}
            className={cn('pl-10', error && 'border-red-500 focus-visible:ring-red-500', className)}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {helperText && !error && <p className="text-sm text-muted-foreground">{helperText}</p>}
      </div>
    )
  }
)

FormDatePicker.displayName = 'FormDatePicker'



