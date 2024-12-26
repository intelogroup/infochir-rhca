import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "sm", ...props }, ref) => {
  const { isOpen, setIsOpen } = useSidebar()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

export { SidebarTrigger };
