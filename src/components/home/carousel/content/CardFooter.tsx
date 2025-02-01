interface CardFooterProps {
  date?: string;
  author?: string;
}

export const CardFooter = ({ date, author }: CardFooterProps) => {
  return (
    <div className="flex items-center justify-between text-sm text-gray-500">
      {date && (
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
          {date}
        </span>
      )}
      {author && (
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
          {author}
        </span>
      )}
    </div>
  );
};