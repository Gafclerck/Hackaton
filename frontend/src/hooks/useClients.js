import { useState, useEffect, useCallback } from "react";
import { clientService } from "../services/clientService";

export function useClients() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await clientService.getAll(0, 100);
      setData(result);
    } catch (err) {
      setError(err.response?.data?.detail || "Erreur lors du chargement des clients");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useClient(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClient = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await clientService.getById(id);
      setData(result);
    } catch (err) {
      setError(err.response?.data?.detail || "Client non trouvé");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchClient(); }, [fetchClient]);

  return { data, loading, error, refetch: fetchClient };
}
