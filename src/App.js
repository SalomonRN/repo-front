import Login from './components/Login';
import Calendar from './components/Calendar';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProposalDetail from './components/ProposalsDetail';
import ProposalDetailCm from './components/ProposalsDetailCm';
import ProposalsList from './components/ProposalsList';
import ProposalsListCm from './components/ProposalsListCm';
import IdeasArchive from './components/IdeasArchive';
import Brainstorming from './components/BrainStorming';
import ProposalsForms from './components/ProposalsForm';
import EditProposal from './components/EditProposal';
import Home from './components/home';
import BrainStormingCM from './components/BrainStormingCM';
import About from './components/About';
import LinkAccount from './components/LinkAccount';
import GoogleCallback from './components/GoogleCalback';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import React,{useEffect, useState} from 'react';
import { useContext } from 'react';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Obtener rol
    const adminStatus = localStorage.getItem('is_admin') === 'true';
    setIsAdmin(adminStatus);
  }, []);

  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Rutas compartidas por CM y Admin */}
            <Route 
              path="/calendar" 
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              } 
            />
            <Route path="/auth/google/oauth2callback/?" element={<LinkAccount />} />
            <Route path="/auth/meta/?" element={<LinkAccount />} />

            {/* Rutas exclusivas de Admin */}
            {isAdmin && (
              <>
                <Route 
                  path="/proposals" 
                  element={
                    <ProtectedRoute>
                      <ProposalsList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/content_proposal/:id" 
                  element={
                    <ProtectedRoute>
                      <ProposalDetail />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/brainstorming" 
                  element={
                    <ProtectedRoute>
                      <Brainstorming />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/proposals_form" 
                  element={
                    <ProtectedRoute>
                      <ProposalsForms />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/editproposal/:id" 
                  element={
                    <ProtectedRoute>
                      <EditProposal />
                    </ProtectedRoute>
                  } 
                />
              </>
            )}

            {/* Rutas exclusivas de CM */}
            {!isAdmin && (
              <>
                <Route 
                  path="/content_proposal_Cm/:id" 
                  element={
                    <ProtectedRoute>
                      <ProposalDetailCm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/brainstormingCm" 
                  element={
                    <ProtectedRoute>
                      <BrainStormingCM />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/proposals_cm" 
                  element={
                    <ProtectedRoute>
                      <ProposalsListCm />
                    </ProtectedRoute>
                  } 
                />
              </>
            )}

            {/* Rutas compartidas para ambos */}
            <Route 
              path="/ideas-archive" 
              element={
                <ProtectedRoute>
                  <IdeasArchive />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/about" 
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/link_account" 
              element={
                <ProtectedRoute>
                  <LinkAccount />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </header>
      </div>
    </AuthProvider>
  );
}

export default App;
