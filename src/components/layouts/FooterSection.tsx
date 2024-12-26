import { Link } from "react-router-dom";
import { Twitter, Facebook, Linkedin, Rss } from "lucide-react";

interface FooterLink {
  name: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink extends FooterLink {
  icon: React.ComponentType<any>;
}

const quickLinks: FooterLink[] = [
  { name: "Soumettre un manuscrit", href: "#submit" },
  { name: "Comité éditorial", href: "#editorial" },
  { name: "Directives pour les auteurs", href: "#guidelines" },
  { name: "Nous contacter", href: "#contact" },
  { name: "Annuaire", href: "/annuaire" },
  { name: "À propos", href: "/about" },
];

const resources: FooterLink[] = [
  { name: "Banque d'images", href: "#images" },
  { name: "Études de cas", href: "#cases" },
  { name: "Outils de recherche", href: "#tools" },
  { name: "Archives", href: "#archives" },
];

const socialLinks: SocialLink[] = [
  { name: "Twitter", icon: Twitter, href: "#twitter" },
  { name: "Facebook", icon: Facebook, href: "#facebook" },
  { name: "LinkedIn", icon: Linkedin, href: "#linkedin" },
  { name: "Flux RSS", icon: Rss, href: "#rss" },
];

export const FooterSection = ({ title, links }: { title: string; links: FooterLink[] }) => (
  <div>
    <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
    <ul className="space-y-3">
      {links.map((link) => (
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
);

export { quickLinks, resources, socialLinks };