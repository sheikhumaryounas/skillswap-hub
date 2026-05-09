/**
 * Home Page
 * 
 * Premium Landing page for SkillSwap Hub.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-overlay">
          <img src="/assets/images/hero-bg.png" alt="Hero Background" className="hero-bg-img" />
          <div className="glass-overlay"></div>
        </div>
        
        <div className="container hero-content">
          <div className="badge-pill">🚀 The Future of Peer Learning</div>
          <h1>
            Master New Skills <br />
            <span>By Teaching Others</span>
          </h1>
          <p className="description">
            SkillSwap Hub is a premium marketplace where students trade knowledge. 
            Teach what you master, learn what you love—all for free.
          </p>
          <div className="cta-group">
            <button onClick={() => navigate('/register')} className="btn btn-primary btn-lg">
              Get Started Free
            </button>
            <button onClick={() => navigate('/users')} className="btn btn-outline btn-lg">
              Explore Skills
            </button>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <strong>1k+</strong>
              <span>Active Students</span>
            </div>
            <div className="stat-item">
              <strong>500+</strong>
              <span>Skills Exchanged</span>
            </div>
            <div className="stat-item">
              <strong>4.9/5</strong>
              <span>User Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="section-header">
          <h2>Engineered for <span>Growth</span></h2>
          <p>Everything you need to level up your skillset without the tuition fees.</p>
        </div>
        <div className="feature-grid">
          {[
            { icon: '🚀', title: 'Rapid Discovery', desc: 'Find matches based on your specific needs using our advanced matching algorithm.' },
            { icon: '🤝', title: 'Verified Swaps', desc: 'Our rating system ensures high-quality peer-to-peer learning experiences.' },
            { icon: '📈', title: 'Track Progress', desc: 'Monitor your learning journey with built-in session tracking and analytics.' },
            { icon: '🛡️', title: 'Safe Space', desc: 'Secure environment exclusively for students from verified institutions.' }
          ].map((f, i) => (
            <div key={i} className="card feature-item">
              <div className="feature-icon-box">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

