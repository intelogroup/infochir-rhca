import { issues2024 } from "./years/2024";
import { issues2023 } from "./years/2023";
import { issues2022 } from "./years/2022";
import type { Issue } from "../types";

export const mockIssues: Issue[] = [
  ...issues2024,
  ...issues2023,
  ...issues2022
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());