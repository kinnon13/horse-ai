import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ className, open, onOpenChange, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('fixed inset-0 z-50 flex items-center justify-center', className)}
      {...props}
    />
  )
)
Dialog.displayName = 'Dialog'

const DialogTrigger = forwardRef<HTMLButtonElement, HTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn('', className)}
      {...props}
    />
  )
)
DialogTrigger.displayName = 'DialogTrigger'

export { Dialog, DialogTrigger }

