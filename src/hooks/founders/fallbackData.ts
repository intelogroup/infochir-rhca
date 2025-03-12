
import { Founder } from '../useFounders';

/**
 * Fallback data in case the database is not accessible
 */
export const fallbackFounders: Founder[] = [
  {
    id: "f1",
    name: "Louis-Franck TELEMAQUE",
    title: "Dr",
    role: "Fondateur",
    image: "/lovable-uploads/0878c37c-8897-4656-af02-a094357c9f8f.png",
    specialties: ["Chirurgie", "Recherche"],
    displayOrder: 1,
    isDeceased: false
  },
  {
    id: "f2",
    name: "Eunice DERIVOIS",
    title: "Dr",
    role: "Co-Fondateur",
    image: "/lovable-uploads/ade0626d-e1c8-4c08-913e-d755f1426bfd.png", 
    displayOrder: 2,
    isDeceased: false
  },
  {
    id: "f3", 
    name: "Sosthène PIERRE",
    title: "Dr",
    role: "Membre",
    image: "/lovable-uploads/6f182d14-1e9a-4570-b612-bd8bb9920805.png",
    displayOrder: 3,
    isDeceased: false
  },
  {
    id: "f4",
    name: "Jean ALOUIDOR",
    title: "Dr",
    role: "Membre",
    image: "/lovable-uploads/07f095b0-c8a1-42bd-89f8-d1618173b710.png",
    displayOrder: 4,
    isDeceased: false
  },
  {
    id: "f5",
    name: "Geissly KERNISAN",
    title: "Dr",
    role: "Membre",
    image: "/lovable-uploads/1b04ef39-161c-40a8-9706-eecbac750611.png",
    displayOrder: 5,
    isDeceased: false
  },
  {
    id: "f6",
    name: "Jean-Marie EUSTACHE",
    title: "Dr",
    role: "Membre fondateur",
    image: "/lovable-uploads/038bd7aa-3ffa-482a-bf3b-202d278f40bd.png",
    displayOrder: 6,
    isDeceased: false
  },
  {
    id: "f7",
    name: "Denise FABIEN",
    title: "Dr",
    role: "Membre fondateur",
    image: "/lovable-uploads/2d519f7b-55bf-4745-b627-f21f2d58caca.png",
    displayOrder: 7,
    isDeceased: true
  }
];
