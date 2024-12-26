import { useNavigate } from "react-router-dom";

export const navItems = [
  { 
    name: "RHCA", 
    href: "/rhca",
    description: "Revue Haïtienne de Chirurgie et d'Anesthésiologie"
  },
  { 
    name: "Index Medicus", 
    href: "/index-medicus",
    description: "Base de données médicale"
  },
  { 
    name: "Atlas", 
    href: "/adc",
    description: "Atlas de Diagnostic Chirurgical"
  },
  { 
    name: "IGM", 
    href: "/igm",
    description: "Informations Générales Médicales"
  },
];

export const NavItems = () => {
  const navigate = useNavigate();
  
  return (
    <div className="hidden md:flex items-center justify-center flex-1 px-8">
      <div className="flex items-center justify-center space-x-6">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.href)}
            className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-gray-50"
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};