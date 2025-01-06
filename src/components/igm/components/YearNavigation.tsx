import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface YearNavigationProps {
  currentYear: number;
  availableYears: number[];
  onYearChange: (year: number) => void;
}

export const YearNavigation = ({
  currentYear,
  availableYears,
  onYearChange,
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
    <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePreviousYear}
        disabled={currentYear === Math.min(...availableYears)}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-500" />
        <Select
          value={currentYear.toString()}
          onValueChange={(value) => onYearChange(parseInt(value))}
        >
          <SelectTrigger className="w-[100px]">
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
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNextYear}
        disabled={currentYear === Math.max(...availableYears)}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};