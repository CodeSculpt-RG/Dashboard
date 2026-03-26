import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Building2, 
  ExternalLink,
  Briefcase
} from 'lucide-react';
import { fetchUserDetail } from '../services/api';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await fetchUserDetail(id);
        setUser(data);
      } catch {
        setError('User not found or error loading details.');
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ width: 40, height: 40, border: '3px solid var(--bg-tertiary)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%' }}
        />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container">
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error || 'User not found'}</p>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            <ArrowLeft size={18} /> Back to Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header" style={{ marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.6rem 1rem' }}>
          <ArrowLeft size={18} /> Back
        </button>
      </header>

      <div className="detail-layout">
        <Motion.div 
          className="glass-panel profile-sidebar"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="avatar-large">
            {user.name.charAt(0)}
          </div>
          <h1 style={{ marginTop: '1.5rem', marginBottom: '0.25rem', fontSize: '1.75rem' }}>{user.name}</h1>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>@{user.username}</p>
          
          <div className="sidebar-info">
            <div className="info-item">
              <Mail size={18} />
              <span>{user.email}</span>
            </div>
            <div className="info-item">
              <Phone size={18} />
              <span>{user.phone}</span>
            </div>
            <div className="info-item">
              <Globe size={18} />
              <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
                {user.website} <ExternalLink size={14} style={{ display: 'inline' }} />
              </a>
            </div>
          </div>
        </Motion.div>

        <div className="detail-main">
          <Motion.div 
            className="glass-panel section-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="section-header">
              <Building2 size={20} className="section-icon" />
              <h2>Company Details</h2>
            </div>
            <div className="details-grid">
              <div className="detail-box">
                <label>Name</label>
                <p>{user.company.name}</p>
              </div>
              <div className="detail-box">
                <label>BS (Business Strategy)</label>
                <p>{user.company.bs}</p>
              </div>
              <div className="detail-box" style={{ gridColumn: 'span 2' }}>
                <label>Catch Phrase</label>
                <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>"{user.company.catchPhrase}"</p>
              </div>
            </div>
          </Motion.div>

          <Motion.div 
            className="glass-panel section-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ marginTop: '1.5rem' }}
          >
            <div className="section-header">
              <MapPin size={20} className="section-icon" />
              <h2>Location</h2>
            </div>
            <div className="details-grid">
              <div className="detail-box">
                <label>Street</label>
                <p>{user.address.street}</p>
              </div>
              <div className="detail-box">
                <label>Suite</label>
                <p>{user.address.suite}</p>
              </div>
              <div className="detail-box">
                <label>City</label>
                <p>{user.address.city}</p>
              </div>
              <div className="detail-box">
                <label>Zipcode</label>
                <p>{user.address.zipcode}</p>
              </div>
              <div className="detail-box" style={{ gridColumn: 'span 2' }}>
                <label>Coordinates</label>
                <p className="text-secondary">Lat: {user.address.geo.lat}, Lng: {user.address.geo.lng}</p>
              </div>
            </div>
          </Motion.div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .detail-layout {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 2rem;
          align-items: start;
        }
        
        @media (max-width: 900px) {
          .detail-layout {
            grid-template-columns: 1fr;
          }
        }
        
        .profile-sidebar {
          padding: 3rem 2rem;
          text-align: center;
          position: sticky;
          top: 2rem;
        }
        
        .avatar-large {
          width: 100px;
          height: 100px;
          border-radius: 2.5rem;
          background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 2.5rem;
          color: white;
          margin: 0 auto;
          box-shadow: 0 10px 25px -5px var(--accent-glow);
        }
        
        .sidebar-info {
          margin-top: 2.5rem;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        
        .info-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        
        .info-item svg {
          color: var(--accent-primary);
        }
        
        .section-card {
          padding: 2rem;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }
        
        .section-icon {
          color: var(--accent-primary);
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        
        .detail-box label {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        
        .detail-box p {
          font-size: 1rem;
          color: var(--text-primary);
          font-weight: 500;
        }
      `}} />
    </div>
  );
};

export default UserDetail;
