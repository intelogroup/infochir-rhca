import type { RhcaVolume } from "../../types";

// Convert any numeric pageCount values to strings
export const neurosurgeryData: RhcaVolume[] = [
  {
    id: "ns-vol3-2023",
    title: "Advances in Neurosurgical Procedures",
    volume: "3",
    issue: "12",
    date: "2023-09-15",
    year: "2023",
    pageCount: "128", // Convert to string
    specialty: "Neurosurgery",
    category: "Clinical Research",
    institution: "National Neurosurgical Institute",
    editor: "Dr. Maria Cortez",
    description: "Explore the latest advancements in neurosurgical techniques and procedures.",
    articleCount: 10,
    downloadCount: 235,
    shareCount: 87,
  },
  {
    id: "ns-vol2-2023",
    title: "Brain Tumor Surgical Approaches",
    volume: "2",
    issue: "8",
    date: "2023-04-22",
    year: "2023",
    pageCount: "95", // Convert to string
    specialty: "Neurosurgery",
    category: "Surgical Techniques",
    institution: "University Neurosurgical Center",
    editor: "Dr. Alexandre Dubois",
    description: "A comprehensive review of surgical approaches for treating brain tumors.",
    articleCount: 8,
    downloadCount: 198,
    shareCount: 62,
  }
];
