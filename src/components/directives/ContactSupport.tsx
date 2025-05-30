
import { DirectiveSection } from "./DirectiveSection";
import { Mail, Phone, Users } from "lucide-react";

export const ContactSupport = () => {
  return (
    <DirectiveSection title="Contact et support" icon={<Users className="h-6 w-6 text-secondary" />}>
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-secondary mb-4">Informations de contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-secondary" />
                <div>
                  <p className="font-medium">Email principal</p>
                  <a href="mailto:infochir@gmail.com" className="text-secondary hover:underline">
                    infochir@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-secondary" />
                <div>
                  <p className="font-medium">Téléphone</p>
                  <a href="tel:+50947355350" className="text-secondary hover:underline">
                    +509 47355350
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-secondary mb-4">Adresse</h3>
            <p className="text-gray-600">
              30 Rue Camille Léon<br />
              Port-au-Prince, HAITI
            </p>
            <div className="mt-4">
              <h4 className="font-medium text-secondary mb-2">Heures de bureau</h4>
              <p className="text-gray-600 text-sm">
                Lundi - Vendredi: 8h00 - 17h00<br />
                Réponse par email sous 24-48h
              </p>
            </div>
          </div>
        </div>
      </div>
    </DirectiveSection>
  );
};
