import { useState, useEffect, useCallback } from "react";
import { dossierService } from "../services/dossierService";

export function useDossiers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dossierService.getAll(0, 100);
      setData(result);
    } catch (err) {
      setError(err.response?.data?.detail || "Erreur lors du chargement des dossiers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useDossier(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDossier = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await dossierService.getById(id);
      setData(result);
    } catch (err) {
      setError(err.response?.data?.detail || "Dossier non trouvé");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchDossier(); }, [fetchDossier]);

  return { data, loading, error, refetch: fetchDossier };
}
