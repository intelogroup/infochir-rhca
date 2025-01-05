import { introductionChapter } from "./categories/introduction";
import { traumaChapters } from "./categories/trauma";
import { specialtiesChapters } from "./categories/specialties";
import { thoracicChapters } from "./categories/thoracic";
import { digestiveChapters } from "./categories/digestive";
import { AtlasChapter } from "../types";

export const atlasChapters: AtlasChapter[] = [
  introductionChapter,
  ...traumaChapters,
  ...specialtiesChapters,
  ...thoracicChapters,
  ...digestiveChapters,
];