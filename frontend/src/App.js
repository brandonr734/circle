import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './scss/main.scss';
import { useUser } from './components/providers/usercontext.js';
import Home from './components/home.js';
import Signup from './components/signup.js';
import Login from './components/login.js';
import PostPage from './components/postpage.js';

function App() {
  const { user } = useUser();
  const { logout } = useUser();

  return (
      <BrowserRouter>
        <div className="kc-background-image"></div>
        <div id="kc-content" className="container-fluid p-0">
          <div id="kc-navbar-placeholder">
            <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark drop-shadow" style={{ minHeight: "56px" }}>
              <div className="container-xl">
                <a className="kc-logo d-flex align-items-center me-3">
                  <img className="kc-logo d-flex align-items-center me-3" src="./images/kc-logo.png" />
                </a>
                <div className="dropdown ms-auto order-lg-1">
                  <a className="btn btn-dark d-flex align-items-center text-white" style={{ width: "180px", height: "40px" }} href="#" role="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                    <div className="kc-user-icon py-0 my-0">
                      {user ? <img src={user.icon} className="border border-dark" style={{ width: "38px", height: "38px" }} alt="User Icon"></img> : <i class="bi bi-person d-flex align-items-center justify-content-center border rounded-5 bg-dark border-dark" style={{ width: "38px", height: "38px" }}></i>}
                    </div>
                    <span className="d-none ms-2">Settings</span>
                    <div className="ps-2 d-flex flex-column align-items-start justify-content-start" style={{ width: "400px", lineHeight: "19px" }}>
                      {user ? <span>{user.display_name}</span> : null}
                      {user ? <span>@{user.userTag}</span> : null}
                    </div>
                  </a>
                  <div className="dropdown-menu dropdown-menu-end dropdown-menu-dark p-3">
                    <div className="d-flex align-items-center mb-3">
                      {user ? <div><button onClick={logout} >Logout</button></div> : <span>test</span>}
                    </div>
                  </div>

                </div>
                <div>
                  <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                      <Link className="px-3 nav-link active" to="/" href="#"><span>Home</span></Link>
                    </li>
                    <li className="nav-item">
                      <Link className="px-3 nav-link" href="#"><span>Search</span></Link>
                    </li>
                    <li className="nav-item">
                      <Link className="px-3 nav-link" href="#"><span>Messsages</span></Link>
                    </li>
                    <li className="nav-item">
                      <Link className="px-3 nav-link" href="#"><span>News</span></Link>
                    </li>
                    <li className="nav-item">
                      <Link className="px-3 nav-link" href="#"><span>Forums</span></Link>
                    </li>
                    <li className="nav-item">
                      <Link className="px-3 nav-link" href="#"><span>Notifications</span></Link>
                    </li>
                    <li className="nav-item">
                      <Link className="px-3 nav-link" to="/signup" href="#"><span>Create Account</span></Link>
                    </li>
                    <li className="nav-item">
                      <Link className="px-3 nav-link" to="/login" href="#"><span>Login</span></Link>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
          <div id="loaded-component">
            <div className="container-xl py-md-3">
              <div class="row d-flex justify-content-center">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/post/:postid" element={<PostPage />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </BrowserRouter>
  );
}

export default App;
