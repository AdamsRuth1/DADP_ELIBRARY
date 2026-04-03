import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './Authentification/login.jsx';
import Sidebar from './Components/sidebar';
import Dashboard from './pages/dashboard'
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      
        <Route path="" element={<LoginPage />} />       
         <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
