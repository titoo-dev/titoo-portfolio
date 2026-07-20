import cvData from "@/cv.json";

export const cv = cvData;

export type Basics = (typeof cvData)["basics"];
export type Job = (typeof cvData)["work"][number];
export type Project = (typeof cvData)["projects"][number];
export type Skill = (typeof cvData)["skills"][number];
