/**
 * Home Page
 * 
 * Premium Landing page for SkillSwap Hub.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home-page animate-fade-in">
      <section className="hero">
        <div className="hero-content">
          <div className="badge-pill">Community Driven Learning</div>
          <h1>Master New Skills Through <span>Direct Exchange</span></h1>
          <p className="description">
            The industry-leading platform for students to swap knowledge. 
            Teach what you love, learn what you need, and build a professional network 
            that matters.
          </p>
          <div className="cta-group">
            {isAuthenticated ? (
              <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
                Return to Dashboard
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/register')} className="btn btn-primary">
                  Start Swapping Now
                </button>
                <button onClick={() => navigate('/login')} className="btn btn-outline">
                  Member Login
                </button>
              </>
            )}
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <strong>12k+</strong>
              <span>Active Learners</span>
            </div>
            <div className="stat-item">
              <strong>450+</strong>
              <span>Skills Catalogued</span>
            </div>
            <div className="stat-item">
              <strong>98%</strong>
              <span>Success Rate</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-card glass">
            <div className="card-header-v">
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
            </div>
            <div className="card-body-v">
              <div className="code-snippet">
                <span className="keyword">const</span> <span className="func">learnSkill</span> = (mentor) ={">"} {"{"}
                <br />
                &nbsp;&nbsp;{/* Future of education */}
                <br />
                &nbsp;&nbsp;<span className="keyword">return</span> mentor.shareKnowledge();
                <br />
                {"}"};
              </div>
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

