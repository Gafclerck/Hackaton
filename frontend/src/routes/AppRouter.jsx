import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { useAuth } from "../hooks/useAuth";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../layouts/AppLayout";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import DossiersList from "../pages/Dossiers";
import DossierDetail from "../pages/Dossiers/Detail";
import FileAffectation from "../pages/FileAffectation";
import PlaceholderPage from "../pages/PlaceholderPage";

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="dossiers" element={<DossiersList />} />
            <Route path="dossiers/:reference" element={<DossierDetail />} />
            <Route path="file" element={<FileAffectation />} />
            <Route path="clients" element={<PlaceholderPage pageId="clients" />} />
            <Route path="clients/:id" element={<PlaceholderPage pageId="clients" />} />
            <Route path="agences" element={<PlaceholderPage pageId="agences" />} />
            <Route path="utilisateurs" element={<PlaceholderPage pageId="utilisateurs" />} />
            <Route path="specialites" element={<PlaceholderPage pageId="specialites" />} />
            <Route path="parametres" element={<PlaceholderPage pageId="parametres" />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
