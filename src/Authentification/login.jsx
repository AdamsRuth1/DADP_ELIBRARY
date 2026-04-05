import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/sidebar'
export default function LoginPage({ setPage }) {
  const [serviceID, setServiceID] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  // Optional: handle Enter key
  const handleKeyPress = (e, callback) => {
    if (e.key === 'Enter') callback();
  };

  const handleLogin = async () => {
    if (!serviceID || !password) return alert('Please enter both Service ID and Password.');
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceID, password }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error || 'Login failed');

      // store token for later (simple localStorage)
      if (data.token) localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('login error', err);
      alert('Login failed (network)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-green-900">
      <div
        className="w-96 p-6 bg-white rounded-lg shadow-lg"
        role="form"
        aria-label="Login Form"
      >
        <h1 className="text-2xl font-bold text-center mb-4">DADP eLibrary</h1>

        <label htmlFor="serviceID" className="sr-only">
          Service ID
        </label>
        <input
          id="serviceID"
          type="text"
          placeholder="Service ID"
          value={serviceID}
          onChange={e => setServiceID(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          aria-required="true"
        />

        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          aria-required="true"
          onKeyPress={e => handleKeyPress(e, handleLogin)}
        />

        <button
          className="w-full p-2 bg-green-700 text-white font-bold rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}
