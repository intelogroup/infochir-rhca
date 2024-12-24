export const categories = [
  "Toutes les catégories",
  "Chirurgie",
  "Pneumologie",
  "Radiologie",
  "Cardiologie",
  "Neurologie",
  "Orthopédie",
  "Pédiatrie",
  "Gynécologie",
  "Dermatologie"
];

export const sources = [
  "Toutes les sources",
  "RHCA",
  "IGM",
  "ADC"
];

export const mockArticles = [
  {
    id: "1",
    title: "Nouvelles Approches en Chirurgie Laparoscopique",
    authors: ["Dr. Jean Martin", "Dr. Marie Dubois"],
    date: "2024-02-15",
    category: "Chirurgie",
    source: "RHCA" as const,
    abstract: "Une étude approfondie des techniques innovantes en chirurgie mini-invasive...",
    tags: ["laparoscopie", "chirurgie mini-invasive", "innovation"],
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format"
  },
  {
    id: "2",
    title: "Cas Clinique: Pneumonie Atypique",
    authors: ["Dr. Pierre Lambert"],
    date: "2024-02-14",
    category: "Pneumologie",
    source: "IGM" as const,
    abstract: "Présentation d'un cas de pneumonie avec manifestations atypiques...",
    tags: ["pneumonie", "diagnostic", "cas clinique"]
  },
  {
    id: "3",
    title: "Diagnostic Radiologique des Fractures Complexes",
    authors: ["Dr. Sophie Bernard", "Dr. Luc Moreau"],
    date: "2024-02-13",
    category: "Radiologie",
    source: "ADC" as const,
    abstract: "Analyse détaillée des approches diagnostiques en traumatologie...",
    tags: ["radiologie", "traumatologie", "diagnostic"]
  },
  {
    id: "4",
    title: "Avancées en Cardiologie Interventionnelle",
    authors: ["Dr. Marc Dupont", "Dr. Claire Lefebvre"],
    date: "2024-02-12",
    category: "Cardiologie",
    source: "RHCA" as const,
    abstract: "Nouvelles techniques d'intervention cardiaque minimalement invasives...",
    tags: ["cardiologie", "intervention", "innovation"],
    imageUrl: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&auto=format"
  },
  {
    id: "5",
    title: "Traitement de l'Épilepsie Réfractaire",
    authors: ["Dr. Antoine Rousseau"],
    date: "2024-02-11",
    category: "Neurologie",
    source: "IGM" as const,
    abstract: "Étude sur les nouvelles approches thérapeutiques pour l'épilepsie résistante...",
    tags: ["neurologie", "épilepsie", "traitement"]
  },
  {
    id: "6",
    title: "Innovations en Chirurgie Orthopédique",
    authors: ["Dr. Julie Martin", "Dr. Thomas Petit"],
    date: "2024-02-10",
    category: "Orthopédie",
    source: "ADC" as const,
    abstract: "Les dernières avancées en matière de prothèses et techniques chirurgicales...",
    tags: ["orthopédie", "prothèses", "innovation"],
    imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format"
  },
  {
    id: "7",
    title: "Prise en Charge des Maladies Respiratoires Chroniques",
    authors: ["Dr. Emma Blanc"],
    date: "2024-02-09",
    category: "Pneumologie",
    source: "RHCA" as const,
    abstract: "Nouvelles stratégies de traitement pour les patients atteints de BPCO...",
    tags: ["pneumologie", "BPCO", "traitement chronique"]
  },
  {
    id: "8",
    title: "Imagerie Cérébrale Avancée",
    authors: ["Dr. Lucas Dubois", "Dr. Sarah Cohen"],
    date: "2024-02-08",
    category: "Neurologie",
    source: "IGM" as const,
    abstract: "Applications de l'IA dans l'interprétation des images cérébrales...",
    tags: ["neurologie", "imagerie", "IA"],
    imageUrl: "https://images.unsplash.com/photo-1559757175-7b21e7afdd2b?w=800&auto=format"
  },
  {
    id: "9",
    title: "Dermatologie Pédiatrique",
    authors: ["Dr. Marie-Claire Laurent"],
    date: "2024-02-07",
    category: "Dermatologie",
    source: "ADC" as const,
    abstract: "Nouvelles approches dans le traitement des affections cutanées chez l'enfant...",
    tags: ["dermatologie", "pédiatrie", "traitement"]
  },
  {
    id: "10",
    title: "Gynécologie Obstétrique Moderne",
    authors: ["Dr. Sophie Martin", "Dr. Philippe Durand"],
    date: "2024-02-06",
    category: "Gynécologie",
    source: "RHCA" as const,
    abstract: "Évolution des pratiques en obstétrique et suivi de grossesse...",
    tags: ["gynécologie", "obstétrique", "grossesse"],
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format"
  },
  {
    id: "11",
    title: "Pédiatrie d'Urgence",
    authors: ["Dr. Alexandre Petit"],
    date: "2024-02-05",
    category: "Pédiatrie",
    source: "IGM" as const,
    abstract: "Protocoles actualisés pour la prise en charge des urgences pédiatriques...",
    tags: ["pédiatrie", "urgences", "protocoles"]
  },
  {
    id: "12",
    title: "Chirurgie Cardiaque Robotique",
    authors: ["Dr. François Lemaire", "Dr. Marie Dupont"],
    date: "2024-02-04",
    category: "Chirurgie",
    source: "ADC" as const,
    abstract: "L'utilisation de la robotique dans la chirurgie cardiaque moderne...",
    tags: ["chirurgie", "robotique", "cardiologie"],
    imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&auto=format"
  },
  {
    id: "13",
    title: "Dermatologie Interventionnelle",
    authors: ["Dr. Isabelle Roux"],
    date: "2024-02-03",
    category: "Dermatologie",
    source: "RHCA" as const,
    abstract: "Nouvelles techniques mini-invasives en dermatologie esthétique...",
    tags: ["dermatologie", "intervention", "esthétique"]
  }
];