// DropdownMenuBasic.tsx (20 lines) - Basic dropdown components
import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

const DropdownMenu = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative', className)}
      {...props}
    />
  )
)
DropdownMenu.displayName = 'DropdownMenu'

const DropdownMenuTrigger = forwardRef<HTMLButtonElement, HTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn('', className)}
      {...props}
    />
  )
)
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'

export { DropdownMenu, DropdownMenuTrigger }
