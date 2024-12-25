export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center animate-fade-in">
      <div className="relative">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <div className="animate-spin rounded-full h-8 w-8 border-r-2 border-primary absolute top-0 left-0" style={{ animationDelay: '-0.2s' }}></div>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary absolute top-0 left-0" style={{ animationDelay: '-0.4s' }}></div>
      </div>
    </div>
  );
};