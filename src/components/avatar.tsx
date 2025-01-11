import { cn } from "@/lib/utils"; // 假设你使用了 shadcn/ui 的 utils

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  rounded?: boolean;
}

export const Avatar = ({
  name,
  size = "md",
  className,
  rounded = true,
}: AvatarProps) => {
  const initials = name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  return (
    <div
      className={cn(
        "bg-muted text-muted-foreground flex items-center justify-center font-medium shrink-0",
        rounded ? "rounded-full" : "rounded-lg",
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
};
