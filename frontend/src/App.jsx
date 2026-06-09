import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Audience from './pages/Audience';
import Campaigns from './pages/Campaigns';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/audience" element={<Audience />} />
          <Route path="/campaigns" element={<Campaigns />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
