export const comparaisonKeys = {
  all: ["comparaison"] as const,
  detail: (firstname1: string, firstname2: string, sex1?: 1 | 2, sex2?: 1 | 2) =>
    ["comparaison", firstname1, firstname2, sex1, sex2] as const,
};
