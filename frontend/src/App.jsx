import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Audience from './pages/Audience';
import Campaigns from './pages/Campaigns';
import Landing from './pages/Landing';
import Docs from './pages/Docs';
import Features from './pages/Features';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/features" element={<Features />} />
        <Route path="/*" element={
          <div className="app-container">
            <Sidebar />
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/audience" element={<Audience />} />
              <Route path="/campaigns" element={<Campaigns />} />
            </Routes>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
