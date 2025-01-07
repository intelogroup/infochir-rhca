export interface Sponsor {
  name: string;
  logo: string;
  type: 'partner' | 'sponsor';
  url?: string;
}

export const sponsors: Sponsor[] = [
  {
    name: "UMREP",
    logo: "/lovable-uploads/043dcc02-cb0f-4bb1-acb1-ae247158b63c.png",
    type: "partner",
    url: "https://www.facebook.com/umrep.haiti/"
  },
  {
    name: "ASHAC",
    logo: "/lovable-uploads/dbeee762-0a9c-45a2-a2fd-0339acd3f611.png",
    type: "partner"
  },
  {
    name: "Agences Vallieres",
    logo: "/lovable-uploads/52b6de93-8ef4-4a73-8af9-6a1d14aa2b24.png",
    type: "sponsor",
    url: "https://www.facebook.com/agencesvallieres"
  },
  {
    name: "Laboratoires Farmatrix",
    logo: "/lovable-uploads/f0f4e7e6-877c-493c-9575-90f790b37d83.png",
    type: "sponsor",
    url: "https://labfarmatrix.com"
  },
  {
    name: "HMS Medical Supplies",
    logo: "/lovable-uploads/c2c9c95c-a47c-466a-ab8e-6c17ca9e7ece.png",
    type: "sponsor",
    url: "http://www.hms.ht"
  }
];