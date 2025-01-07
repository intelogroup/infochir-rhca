export interface Sponsor {
  name: string;
  logo: string;
  type: 'partner' | 'sponsor';
}

export const sponsors: Sponsor[] = [
  {
    name: "UMREP",
    logo: "/lovable-uploads/043dcc02-cb0f-4bb1-acb1-ae247158b63c.png",
    type: "partner"
  },
  {
    name: "ASHAC",
    logo: "/lovable-uploads/dbeee762-0a9c-45a2-a2fd-0339acd3f611.png",
    type: "partner"
  },
  {
    name: "Sponsor 1",
    logo: "/placeholder.svg",
    type: "sponsor"
  },
  {
    name: "Sponsor 2",
    logo: "/placeholder.svg",
    type: "sponsor"
  }
];