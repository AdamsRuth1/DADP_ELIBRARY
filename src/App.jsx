import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './Authentification/login.jsx';
import Dashboard from './pages/dashboard';
import LandingPage from './LandingPage/landingPage'
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


