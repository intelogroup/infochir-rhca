
export interface Sponsor {
  name: string;
  logo: string;
  type: 'partner' | 'sponsor';
  url?: string;
}

export const sponsors: Sponsor[] = [
  {
    name: "Laboratoires 4C",
    logo: "/lovable-uploads/6510c61e-6913-49cc-9450-a8a4e676937d.png",
    type: "sponsor",
    url: "https://laboratoires4c.com/en/home/"
  },
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
  },
  {
    name: "OFATMA",
    logo: "/lovable-uploads/6e69fedc-484d-4f68-b95c-63ca2aa91e6c.png",
    type: "sponsor",
    url: "https://www.ofatma.gouv.ht"
  },
  {
    name: "JSA Foundation",
    logo: "/lovable-uploads/c4ecbe61-7269-4a2c-9db6-e4f656279bde.png",
    type: "sponsor",
    url: "https://www.charitynavigator.org/ein/823647332"
  },
  {
    name: "MSPP",
    logo: "/lovable-uploads/fe976826-422d-438c-bc21-354485ccd812.png",
    type: "partner",
    url: "https://www.mspp.gouv.ht/"
  },
  {
    name: "CESPA",
    logo: "/lovable-uploads/bf15ddab-ab6b-4b3a-b94e-1b935b8026ab.png",
    type: "partner"
  },
  {
    name: "SOHAD",
    logo: "/lovable-uploads/2fe4f20b-e98b-4fbd-8ade-0768e8a0a286.png",
    type: "partner",
    url: "https://www.sohadhaiti.com/"
  },
  {
    name: "SurgiMed",
    logo: "/lovable-uploads/113fbe65-07c2-4e94-b069-5c7d6e063317.png",
    type: "partner",
    url: "https://www.facebook.com/p/SurgiMed-61551703082395/"
  },
  {
    name: "HHN",
    logo: "/lovable-uploads/c2e2d9e4-a71c-422f-b7d1-e6fa80c04a22.png",
    type: "partner"
  },
  {
    name: "FMP_EBO",
    logo: "/lovable-uploads/5319f234-4c0d-48e2-85eb-f267dc21d813.png",
    type: "partner"
  }
];
