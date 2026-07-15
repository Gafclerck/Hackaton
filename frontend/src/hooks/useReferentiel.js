import { useState, useEffect, useCallback } from "react";
import { referentielService } from "../services/referentielService";

export function useReferentiel() {
  const [typesAffaires, setTypesAffaires] = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [types, specs] = await Promise.all([
        referentielService.getTypeAffaires(),
        referentielService.getSpecialites(),
      ]);
      setTypesAffaires(types);
      setSpecialites(specs);
    } catch (err) {
      setError(err.response?.data?.detail || "Erreur lors du chargement du référentiel");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { typesAffaires, specialites, loading, error, refetch: fetchData };
}
