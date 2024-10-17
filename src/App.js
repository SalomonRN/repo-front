import Login from './components/Login';
import Calendar from './components/Calendar';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProposalDetail from './components/ProposalsDetail';
import ProposalsList from './components/ProposalsList';
import ProposalsListCm from './components/ProposalsListCm';
import IdeasArchive from './components/IdeasArchive';
import Brainstorming from './components/BrainStorming';
import ProposalsForms from './components/ProposalsForm';
import Home from './components/home';
import BrainStormingCM from './components/BrainStormingCM';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { useContext } from 'react';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={<Login />} 
            />
            {/* Rutas protegidas */}
            <Route 
              path="/calendar" 
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              } 
            />
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
              path="/brainstormingCm" 
              element={
                <ProtectedRoute>
                  <BrainStormingCM />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ideas-archive" 
              element={
                <ProtectedRoute>
                  <IdeasArchive />
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
              path="/proposals_cm" 
              element={
                <ProtectedRoute>
                  <ProposalsListCm />
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