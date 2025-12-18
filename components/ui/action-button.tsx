import { Button } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActionButtonProps {
  icon: LucideIcon
  label: string
  onClick?: () => void
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export function ActionButton({
  icon: Icon,
  label,
  onClick,
  variant = 'default',
  size = 'default',
  disabled = false,
  className,
  type = 'button',
}: ActionButtonProps) {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={cn('flex flex-col items-center justify-center h-auto py-2 px-3 gap-1 min-w-[60px]', className)}
    >
      <Icon className="h-4 w-4" />
      <span className="text-xs leading-tight whitespace-nowrap">{label}</span>
    </Button>
  )
}
