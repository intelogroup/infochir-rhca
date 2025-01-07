export interface Sponsor {
  name: string;
  logo: string;
  type: 'partner' | 'sponsor';
}

export const sponsors: Sponsor[] = [
  {
    name: "Partner 1",
    logo: "/placeholder.svg",
    type: "partner"
  },
  {
    name: "Partner 2",
    logo: "/placeholder.svg",
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