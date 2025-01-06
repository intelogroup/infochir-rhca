import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

interface DateRangeSelectorProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

export const DateRangeSelector = ({ date, setDate }: DateRangeSelectorProps) => {
  return <DatePickerWithRange date={date} setDate={setDate} />;
};