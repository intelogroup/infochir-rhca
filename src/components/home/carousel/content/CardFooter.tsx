
interface CardFooterProps {
  date?: string;
  author?: string;
}

export const CardFooter = ({ date, author }: CardFooterProps) => {
  return (
    <div className="flex items-center justify-between text-sm text-gray-500 w-full">
      {date && (
        <span className="flex items-center gap-1 truncate mr-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
          <span className="truncate">{date}</span>
        </span>
      )}
      {author && (
        <span className="flex items-center gap-1 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
          <span className="truncate">{author}</span>
        </span>
      )}
    </div>
  );
};
