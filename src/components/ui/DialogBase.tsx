import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

const Dialog = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
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
