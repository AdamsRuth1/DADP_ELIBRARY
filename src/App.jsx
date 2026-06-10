import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './Authentification/login.jsx';
import Dashboard from './pages/dashboard';
import LandingPage from './LandingPage/landingPage';
import DadpWebsite from './LandingPage/dadpWebsite';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DadpWebsite />} />
        <Route path="/elibrary" element={<LandingPage />} />

        <Route path="/login" element={<PublicRoute><LoginPage/></PublicRoute>} />

        <Route element={<ProtectedRoute/>}>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/books" element={<Dashboard/>} />
          <Route path="/profile" element={<Dashboard/>} />
          <Route path="/admin" element={<Dashboard/>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;


