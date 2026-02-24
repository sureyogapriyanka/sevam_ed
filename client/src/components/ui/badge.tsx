import * as React from "react"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const badgeVariants: Record<BadgeVariant, string> = {
  default: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
  secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
  destructive: "border-transparent bg-red-600 text-white hover:bg-red-700",
  outline: "text-gray-900 border-gray-200",
};

const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  children?: React.ReactNode;
  className?: string;
}

function Badge({ className = "", variant = "default", children, ...props }: BadgeProps) {
  const variantClasses = badgeVariants[variant];
  const combinedClassName = `${baseClasses} ${variantClasses} ${className}`.trim();

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
