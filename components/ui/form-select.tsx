import { forwardRef } from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface FormSelectProps {
  label?: string
  placeholder?: string
  options: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export const FormSelect = forwardRef<HTMLButtonElement, FormSelectProps>(
  ({ label, placeholder, options, value, onValueChange, error, helperText, required, disabled, className }, ref) => {
    const selectId = `select-${label?.toLowerCase().replace(/\s+/g, '-')}`

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={selectId} className={cn(required && 'after:content-["*"] after:ml-0.5 after:text-red-500')}>
            {label}
          </Label>
        )}
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
          <SelectTrigger
            ref={ref}
            id={selectId}
            className={cn(error && 'border-red-500 focus:ring-red-500', className)}
          >
            <SelectValue placeholder={placeholder || 'Select an option'} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {helperText && !error && <p className="text-sm text-muted-foreground">{helperText}</p>}
      </div>
    )
  }
)

FormSelect.displayName = 'FormSelect'



