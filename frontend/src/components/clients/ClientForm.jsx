import { useState, useEffect } from "react";
import { agences } from "../../data/mockData";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { cn } from "../../lib/utils";
import { TYPE_PERSONNE_LABELS } from "../../lib/constants";

const TYPE_PERSONNE_OPTIONS = [
  { value: "PHYSIQUE", label: "Personne Physique" },
  { value: "MORALE", label: "Personne Morale" },
];

const FORME_JURIDIQUE_OPTIONS = [
  { value: "SARL", label: "SARL" },
  { value: "SA", label: "SA" },
  { value: "SAS", label: "SAS" },
  { value: "SSI", label: "SSI" },
];

const AGENCE_OPTIONS = agences.map((a) => ({ value: a.id, label: a.nom }));

const defaultFormData = {
  type_personne: "PHYSIQUE",
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  adresse: "",
  profession: "",
  date_naissance: "",
  numero_identite: "",
  raison_sociale: "",
  forme_juridique: "SARL",
  registre_commerce: "",
  agence_id: "",
};

export function ClientForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({ ...defaultFormData, ...initialData });
    }
  }, [initialData]);

  const isPhysique = formData.type_personne === "PHYSIQUE";
  const isMorale = formData.type_personne === "MORALE";

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (formData.telephone && !/^[\d\s+\-()]{8,}$/.test(formData.telephone)) {
      newErrors.telephone = "Format de téléphone invalide";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Select
            label="Type de personne"
            value={formData.type_personne}
            onChange={(v) => handleChange("type_personne", v)}
            options={TYPE_PERSONNE_OPTIONS}
          />
        </div>

        {isPhysique && (
          <div>
            <Input
              label="Prénom"
              value={formData.prenom}
              onChange={(e) => handleChange("prenom", e.target.value)}
            />
          </div>
        )}

        <div>
          <Input
            label="Nom *"
            value={formData.nom}
            onChange={(e) => handleChange("nom", e.target.value)}
            error={errors.nom}
            required
          />
        </div>

        {isMorale && (
          <div>
            <Input
              label="Raison sociale"
              value={formData.raison_sociale}
              onChange={(e) => handleChange("raison_sociale", e.target.value)}
            />
          </div>
        )}

        <div>
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors.email}
          />
        </div>

        <div>
          <Input
            label="Téléphone"
            value={formData.telephone}
            onChange={(e) => handleChange("telephone", e.target.value)}
            error={errors.telephone}
          />
        </div>

        <div className="md:col-span-2">
          <Textarea
            label="Adresse"
            value={formData.adresse}
            onChange={(e) => handleChange("adresse", e.target.value)}
          />
        </div>

        {isPhysique && (
          <>
            <div>
              <Input
                label="Profession"
                value={formData.profession}
                onChange={(e) => handleChange("profession", e.target.value)}
              />
            </div>
            <div>
              <Input
                label="Date de naissance"
                type="date"
                value={formData.date_naissance}
                onChange={(e) => handleChange("date_naissance", e.target.value)}
              />
            </div>
            <div>
              <Input
                label="Numéro d'identité"
                value={formData.numero_identite}
                onChange={(e) => handleChange("numero_identite", e.target.value)}
              />
            </div>
          </>
        )}

        {isMorale && (
          <>
            <div>
              <Select
                label="Forme juridique"
                value={formData.forme_juridique}
                onChange={(v) => handleChange("forme_juridique", v)}
                options={FORME_JURIDIQUE_OPTIONS}
              />
            </div>
            <div>
              <Input
                label="Registre de commerce"
                value={formData.registre_commerce}
                onChange={(e) => handleChange("registre_commerce", e.target.value)}
              />
            </div>
          </>
        )}

        <div>
          <Select
            label="Agence"
            value={formData.agence_id}
            onChange={(v) => handleChange("agence_id", v)}
            options={AGENCE_OPTIONS}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
}