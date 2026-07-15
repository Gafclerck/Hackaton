import api from "./api";

const BASE = "/api/agence";

export const agenceService = {
  getAll: async (skip = 0, limit = 20) => {
    const { data } = await api.get(`${BASE}/all`, { params: { skip, limit } });
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`${BASE}/${id}`);
    return data;
  },

  create: async (payload) => {
    const { data } = await api.post(`${BASE}/create`, payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await api.patch(`${BASE}/${id}`, payload);
    return data;
  },

  getUsers: async (agenceId) => {
    const { data } = await api.get(`${BASE}/${agenceId}/users`);
    return data;
  },
};
