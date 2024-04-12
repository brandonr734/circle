import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../scss/main.scss';

function Signup() {

    const [tag, setTag] = useState('');
    const [display_name, setDisplayName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [icon, setIcon] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tag,
                    display_name,
                    password,
                    email,
                    icon
                }),
            });

            if (response.ok) {
                const newUser = await response.json();
                console.log('User created:', newUser);
            } else {
                console.error('Failed to create account');
            }
        } catch (error) {
            console.error('Error creating account:', error);
        }
    };

    return (
        <div className="col-8 kc-page">
            <div className="card p-2">
                <div className="card-body">
                    <div className="row g-1 d-flex justify-content-center">
                        <div className="col-12 col-md-8 mb-0 px-2 d-flex flex-column justify-content-center">
                            <h4 className="mx-1 mb-1 text-center">Create Account</h4>
                            <input className="my-2" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Tag" />
                            <span>This is the name used to uniquely identify your account.</span>
                            <input className="my-2" value={display_name} onChange={(e) => setDisplayName(e.target.value)} placeholder="Display Name" />
                            You can change your display name later.
                            <input className="my-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                            Passwords must be at least 6 characters.
                            <input className="my-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                            <input className="my-2" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="Icon url"/>
                            Not required, you can set your icon at any point.
                            <button className="btn-pill" onClick={handleSubmit}>Create Account</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
