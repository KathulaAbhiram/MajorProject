import React from 'react';
import './home.css'; 
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const handleLogin = () => { navigate('/dashboard') }
  return (
    <div className="container">
      <div className="leftSide">
        <img
          src="https://img.freepik.com/free-photo/3d-cartoon-hospital-healthcare-scene_23-2151644056.jpg"
          alt="Side Decoration"
          className="image"
        />
      </div>
      <div className="rightSide">
        <h1 className="title">Welcome to sneat!</h1>
        <p className="subtitle">Please sign-in to your account and start the adventure.</p>
        
        <form className="form">
          <label className="label">Email or Username</label>
          <input type="text" placeholder="Enter your email or username" className="input" />
          
          <label className="label">Password</label>
          <input type="password" className="input" />
          
          <div className="options">
            <label className="remember">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#forgot-password" className="link">Forgot password?</a>
          </div>
          
          <button type="submit" className="button" onClick={handleLogin}>Login</button>
        </form>
        
        <p className="signup">
          New on our platform? <a href="#create-account" className="link">Create an account</a>
        </p>
      </div>
    </div>
  );
};

export default Home;