import api from "./api";

const BASE = "/api/referentiel";

export const referentielService = {
  getTypeAffaires: async () => {
    const { data } = await api.get(`${BASE}/type_affaires`);
    return data;
  },

  getSpecialites: async () => {
    const { data } = await api.get(`${BASE}/specialites`);
    return data;
  },
};
