import Login from './components/GoogleLogin';
import Calendar from './components/Calendar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProposalDetail from './components/ProposalsDetail';
import ProposalsList from './components/ProposalsList';
import IdeasArchive from './components/IdeasArchive';
import Brainstorming from './components/BrainStorming';
import ProposalsForms from './components/ProposalsForm';
import Home from './components/home';
import Register from './components/GoogleRegister';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas */}
          <Route
            path="/calendar"
            element={
              <Calendar />
            }
          />
          <Route
            path="/proposals"
            element={
              <ProposalsList />
            }
          />
          <Route
            path="/content_proposal/:id"
            element={
              <ProposalDetail />
            }
          />
          <Route
            path="/brainstorming"
            element={
              <Brainstorming />
            }
          />
          <Route
            path="/ideas-archive"
            element={
              <IdeasArchive />
            }
          />
          <Route
            path="/proposals_form"
            element={
              <ProposalsForms />
            }
          />
        </Routes>
      </header>
    </div>

  );
}

export default App;
