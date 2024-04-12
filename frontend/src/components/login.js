import React, { useState, useEffect } from 'react';
import { useUser } from './providers/usercontext.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../scss/main.scss';

function Login() {

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const userData = await response.json();
      localStorage.setItem('token', userData.token);
      localStorage.setItem('userTag', userData.userTag);
      localStorage.setItem('id', userData.id);
      localStorage.setItem('liked_posts', userData.liked_posts)
      login(userData);
    } else {
      alert('Login failed');
    }
  };

  return (
    <div className="col-8 kc-page">
      <div className="card p-2">
        <div className="card-body">
          <div className="row g-1 d-flex justify-content-center">
            <div className="col-12 col-md-8 mb-0 px-2 d-flex flex-column justify-content-center">
              <h4 className="mx-1 mb-1 text-center">Login</h4>
              <form className="d-flex flex-column justify-content-center" onSubmit={handleSubmit}>
                <input className="my-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input className="my-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button type="submit" className="btn-pill">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
