export const similairesKeys = {
  all: ["similaires"] as const,
  detail: (firstname: string, sourceSex?: 1 | 2, targetSex?: 1 | 2) =>
    ["similaires", firstname, sourceSex, targetSex] as const,
};
