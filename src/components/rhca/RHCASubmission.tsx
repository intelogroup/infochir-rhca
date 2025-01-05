import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const RHCASubmission = () => {
  return (
    <div className="bg-primary/5 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Contribuez à la RHCA</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Partagez vos recherches, études de cas et innovations avec la communauté médicale. 
            Votre contribution enrichit les connaissances en chirurgie et anesthésiologie.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link to="/submission">Soumettre votre article</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};