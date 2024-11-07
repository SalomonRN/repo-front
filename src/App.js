import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Calendar from './components/Calendar';
import ProposalDetail from './components/ProposalsDetail';
import ProposalDetailCm from './components/ProposalsDetailCm';
import ProposalsList from './components/ProposalsList';
import ProposalsListCm from './components/ProposalsListCm';
import IdeasArchive from './components/IdeasArchive';
import Brainstorming from './components/BrainStorming';
import ProposalsForms from './components/ProposalsForm';
import Home from './components/home';
import BrainStormingCM from './components/BrainStormingCM';
import About from './components/About';
import LinkAccount from './components/LinkAccount';
import PasswordReset from './components/PasswordReset';
import PasswordResetConfirm from './components/PasswordResetConfirm';
import Unauthorized from './components/Unauthorized';
import GoogleCallback from './components/GoogleCalback';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';


function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header">
          <Routes>

            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/psw_reset" element={<PasswordReset />} />
            <Route path="/auth/password_reset_confirm/:userId/:token" element={<PasswordResetConfirm />} />

            {/* Rutas protegidas para todos los usuarios con token */}
            <Route element={<ProtectedRoute allowBothRoles={true} />}>
              <Route path="/" element={<Home />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/ideas-archive" element={<IdeasArchive />} />
              <Route path="/proposals_form" element={<ProposalsForms />} />

            </Route>

            {/* Rutas protegidas solo para admins */}
            <Route element={<ProtectedRoute requiredAdmin={true} />}>
              <Route path="/link_account" element={<LinkAccount />} />
              <Route path="/brainstorming" element={<Brainstorming />} />
              <Route path="/proposals" element={<ProposalsList />} />
              <Route path="/content_proposal/:id" element={<ProposalDetail />} />
              <Route path="/auth/google/oauth2callback" element={<LinkAccount />} />
              <Route path="/auth/meta" element={<LinkAccount />} />

            </Route>

            {/* Rutas protegidas solo para CM */}
            <Route element={<ProtectedRoute requiredAdmin={false} />}>
              <Route path="/brainstormingCM" element={<BrainStormingCM />} />
              <Route path="/proposals_cm" element={<ProposalsListCm />} />
              <Route path="/content_proposal_Cm/:id" element={<ProposalDetailCm />} />

            </Route>

            {/* Ruta de acceso no autorizado */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Redirección para cualquier otra ruta */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </header>
      </div>
    </AuthProvider>
  );
}

export default App;
