import { useState, useEffect, useCallback } from "react";
import { agenceService } from "../services/agenceService";

export function useAgences() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await agenceService.getAll(0, 100);
      setData(result);
    } catch (err) {
      setError(err.response?.data?.detail || "Erreur lors du chargement des agences");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useAgence(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!id) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const result = await agenceService.getById(id);
      setData(result);
    } catch (err) {
      setError(err.response?.data?.detail || "Erreur lors du chargement de l'agence");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
