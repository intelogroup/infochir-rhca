import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface YearNavigationProps {
  currentYear: number;
  availableYears: number[];
  onYearChange: (year: number) => void;
  className?: string;
}

export const YearNavigation = ({
  currentYear,
  availableYears,
  onYearChange,
  className,
}: YearNavigationProps) => {
  const handlePreviousYear = () => {
    const currentIndex = availableYears.indexOf(currentYear);
    if (currentIndex > 0) {
      onYearChange(availableYears[currentIndex - 1]);
    }
  };

  const handleNextYear = () => {
    const currentIndex = availableYears.indexOf(currentYear);
    if (currentIndex < availableYears.length - 1) {
      onYearChange(availableYears[currentIndex + 1]);
    }
  };

  return (
    <motion.div 
      className={cn(
        "flex flex-wrap items-center gap-2 bg-white rounded-lg border border-gray-200 p-2 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={handlePreviousYear}
        disabled={currentYear === Math.min(...availableYears)}
        className="h-8 w-8 sm:h-9 sm:w-9 transition-transform hover:scale-105"
        aria-label="Année précédente"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <motion.div 
        className="flex items-center gap-2"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Calendar className="hidden sm:block h-4 w-4 text-gray-500" aria-hidden="true" />
        <Select
          value={currentYear.toString()}
          onValueChange={(value) => onYearChange(parseInt(value))}
        >
          <SelectTrigger className="w-[90px] sm:w-[120px] h-8 sm:h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleNextYear}
        disabled={currentYear === Math.max(...availableYears)}
        className="h-8 w-8 sm:h-9 sm:w-9 transition-transform hover:scale-105"
        aria-label="Année suivante"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </motion.div>
  );
};