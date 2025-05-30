
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const DirectivesActions = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
      <Link to="/submission">
        <Button className="bg-secondary hover:bg-secondary-light w-full sm:w-auto">
          Soumettre un manuscrit
        </Button>
      </Link>
      <Link to="/editorial">
        <Button variant="outline" className="w-full sm:w-auto">
          Comité éditorial
        </Button>
      </Link>
    </div>
  );
};
