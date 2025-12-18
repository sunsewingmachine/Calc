import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  status?: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  priority?: 'low' | 'medium' | 'high'
  dueDate?: Date | string
  onClick?: () => void
  actions?: React.ReactNode
  className?: string
}

export function TaskCard({
  title,
  description,
  icon: Icon,
  status = 'pending',
  priority = 'medium',
  dueDate,
  onClick,
  actions,
  className,
}: TaskCardProps) {
  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  const priorityColors = {
    low: 'border-l-green-500',
    medium: 'border-l-yellow-500',
    high: 'border-l-red-500',
  }

  return (
    <Card
      className={cn(
        'cursor-pointer transition-shadow hover:shadow-md border-l-4',
        priorityColors[priority],
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {Icon && (
              <div className="mt-1">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base truncate">{title}</CardTitle>
              {description && (
                <CardDescription className="mt-1 line-clamp-2">{description}</CardDescription>
              )}
            </div>
          </div>
          {actions}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              statusColors[status]
            )}
          >
            {status.replace('-', ' ')}
          </span>
          {dueDate && (
            <span className="text-xs text-muted-foreground">
              {typeof dueDate === 'string' ? dueDate : dueDate.toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
