import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface PageHeaderProps {
  title: string;
  description?: string;
  subtitle?: string;
  backLink?: string;
  /** Optional node (icon) or image src rendered above the title */
  icon?: React.ReactNode;
  logoSrc?: string;
  logoAlt?: string;
  /** Brand accent used for the title */
  variant?: "primary" | "secondary" | "brand";
  align?: "left" | "center";
  className?: string;
  children?: React.ReactNode;
}

const titleClass: Record<NonNullable<PageHeaderProps["variant"]>, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  brand: "text-foreground",
};

export const PageHeader = ({
  title,
  description,
  subtitle,
  backLink,
  icon,
  logoSrc,
  logoAlt,
  variant = "primary",
  align = "center",
  className,
  children,
}: PageHeaderProps) => {
  const centered = align === "center";

  return (
    <header className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-0 -z-10 border-b border-border bg-background" />
      <div
        className={cn(
          "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14",
          centered && "text-center"
        )}
      >
        {backLink && (
          <Link to={backLink} className="inline-block mb-6">
            <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary-light transition-base">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={cn("space-y-4", centered && "flex flex-col items-center")}
        >
          {(logoSrc || icon) && (
            <div className="mb-2 flex items-center justify-center h-20 w-20 sm:h-24 sm:w-24 rounded-md border border-border bg-card p-3">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={logoAlt || title}
                  className="h-full w-full object-contain"
                  loading="eager"
                />
              ) : (
                icon
              )}
            </div>
          )}

          <h1 className={cn("type-display", titleClass[variant])}>{title}</h1>
          <div className={cn("rule-gold", centered && "mx-auto")} />

          {subtitle && (
            <p className="type-h3 text-foreground/80 max-w-3xl">{subtitle}</p>
          )}
          {description && (
            <p className={cn("type-lead max-w-3xl", centered && "mx-auto")}>{description}</p>
          )}
          {children}
        </motion.div>
      </div>
    </header>
  );
};
