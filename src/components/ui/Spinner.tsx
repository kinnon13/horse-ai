import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

const Spinner = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]',
        className
      )}
      {...props}
    />
  )
)
Spinner.displayName = 'Spinner'

export { Spinner }
