import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DossiersList from "./pages/Dossiers";
import DossierDetail from "./pages/Dossiers/Detail";
import FileAffectation from "./pages/FileAffectation";
import PlaceholderPage from "./pages/PlaceholderPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dossiers" element={<DossiersList />} />
            <Route path="/dossiers/:reference" element={<DossierDetail />} />
            <Route path="/file" element={<FileAffectation />} />
            <Route path="/agences" element={<PlaceholderPage pageId="agences" />} />
            <Route path="/utilisateurs" element={<PlaceholderPage pageId="utilisateurs" />} />
            <Route path="/specialites" element={<PlaceholderPage pageId="specialites" />} />
            <Route path="/parametres" element={<PlaceholderPage pageId="parametres" />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
