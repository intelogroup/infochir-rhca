import { Twitter, Facebook, Linkedin, Rss } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const quickLinks = [
    { name: "Soumettre un manuscrit", href: "#submit" },
    { name: "Comité éditorial", href: "#editorial" },
    { name: "Directives pour les auteurs", href: "#guidelines" },
    { name: "Nous contacter", href: "#contact" },
  ];

  const resources = [
    { name: "Banque d'images", href: "#images" },
    { name: "Études de cas", href: "#cases" },
    { name: "Outils de recherche", href: "#tools" },
    { name: "Archives", href: "#archives" },
  ];

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "#twitter" },
    { name: "Facebook", icon: Facebook, href: "#facebook" },
    { name: "LinkedIn", icon: Linkedin, href: "#linkedin" },
    { name: "Flux RSS", icon: Rss, href: "#rss" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png"
                alt="Info Chir Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
                INFOCHIR
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Une plateforme de premier plan pour la recherche médicale et les connaissances chirurgicales en Haïti.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Liens rapides</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-600 hover:text-primary text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Ressources</h3>
            <ul className="space-y-3">
              {resources.map((resource) => (
                <li key={resource.name}>
                  <Link
                    to={resource.href}
                    className="text-gray-600 hover:text-primary text-sm transition-colors duration-200"
                  >
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Nous suivre</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  to={social.href}
                  className="text-gray-600 hover:text-primary transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200/50">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} InfoChir. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};