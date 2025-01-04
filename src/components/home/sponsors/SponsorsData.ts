export interface Sponsor {
  name: string;
  logo: string;
  type: 'partner' | 'sponsor';
}

export const sponsors: Sponsor[] = [
  {
    name: "UMREP",
    logo: "/lovable-uploads/bb937ab1-3f45-4a51-8791-420d086ea071.png",
    type: "partner"
  },
  {
    name: "ASHAC",
    logo: "/lovable-uploads/4c3beb92-b2bf-4e90-b874-757e8c1ed4e7.png",
    type: "partner"
  },
  {
    name: "HMS Medical Supplies",
    logo: "/lovable-uploads/cc57d2a1-5f69-4a2a-80ff-5b844065cefe.png",
    type: "partner"
  },
  {
    name: "Agences Vallieres",
    logo: "/lovable-uploads/76bfab45-eb57-49c4-b4c8-5a8c9c268c0e.png",
    type: "sponsor"
  },
  {
    name: "Laboratoires Farmatrix",
    logo: "/lovable-uploads/3b53ffd7-7e51-4197-b951-45b3d996c5d9.png",
    type: "sponsor"
  }
];