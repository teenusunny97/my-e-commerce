import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin({ login }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/admin');
    } else {
      setError('Wrong password, try again.');
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '50px auto',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        backgroundColor: '#f9f9f9',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        textAlign: 'center',
      }}
    >
      <h2 style={{ marginBottom: '24px', color: '#333' }}>🔒 Admin Login</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: '12px 16px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1.5px solid #ccc',
            outline: 'none',
            transition: 'border-color 0.3s ease',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#007BFF')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
        />

        <button
          type="submit"
          style={{
            padding: '12px',
            fontSize: '16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#007BFF',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#007BFF')}
        >
          Login
        </button>
      </form>

      {error && (
        <p
          style={{
            marginTop: '20px',
            color: 'red',
            fontWeight: '600',
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default AdminLogin;
