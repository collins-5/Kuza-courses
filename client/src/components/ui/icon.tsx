import * as React from 'react';
import { cn } from '@/lib/utils';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizeClasses: Record<IconSize, string> = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
};

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: IconSize;
  asChild?: boolean;
}

export function Icon({
  size = 'sm',
  asChild = false,
  className,
  children,
  ...props
}: IconProps) {
  const classes = cn(
    'inline-flex shrink-0 items-center justify-center',
    '[&_svg]:h-full [&_svg]:w-full',
    sizeClasses[size],
    className
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<{ className?: string }>,
      {
        className: cn(
          (children.props as { className?: string }).className,
          classes
        ),
      }
    );
  }

  return (
    <span className={classes} aria-hidden="true" {...props}>
      {children}
    </span>
  );
}