import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

const SelectValue = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn('text-sm', className)}
      {...props}
    />
  )
)
SelectValue.displayName = 'SelectValue'

export { SelectValue }

