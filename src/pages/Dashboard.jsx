import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronUp, ChevronDown, User, Mail, Phone, Building2, ArrowRight } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { fetchUsers } from '../services/api';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch {
        setError('Could not load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    // Search
    if (searchTerm) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      let aValue = sortConfig.key === 'company' ? a.company.name : a[sortConfig.key];
      let bValue = sortConfig.key === 'company' ? b.company.name : b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, searchTerm, sortConfig]);

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

  if (error) {
    return (
      <div className="container">
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <Motion.h1 
          className="title-gradient"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          User Directory
        </Motion.h1>
        
        <div className="search-container">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="input-field"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="user-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Name
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th>Email</th>
                <th>Phone</th>
                <th onClick={() => handleSort('company')} className="sortable">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Company
                    {sortConfig.key === 'company' && (
                       sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredAndSortedUsers.map((user, index) => (
                  <Motion.tr
                    key={user.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(`/user/${user.id}`)}
                    className="user-row"
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="avatar-small">
                          {user.name.charAt(0)}
                        </div>
                        <span style={{ fontWeight: 500 }}>{user.name}</span>
                      </div>
                    </td>
                    <td><span className="text-secondary">{user.email}</span></td>
                    <td><span className="text-secondary">{user.phone}</span></td>
                    <td><span className="company-badge">{user.company.name}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <ArrowRight size={18} className="arrow-icon" />
                    </td>
                  </Motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredAndSortedUsers.length === 0 && (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No users found matching your search criteria.
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .user-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        
        .user-table th {
          padding: 1.25rem 1.5rem;
          color: var(--text-muted);
          font-weight: 500;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--glass-border);
        }
        
        .user-table td {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
          transition: background var(--transition-fast);
        }
        
        .user-row {
          cursor: pointer;
        }
        
        .user-row:hover {
          background: rgba(255, 255, 255, 0.03);
        }
        
        .user-row:hover .arrow-icon {
          transform: translateX(4px);
          color: var(--accent-primary);
        }
        
        .arrow-icon {
          transition: all var(--transition-normal);
          color: var(--text-muted);
        }
        
        .sortable {
          cursor: pointer;
          user-select: none;
        }
        
        .sortable:hover {
          color: var(--text-primary);
        }
        
        .avatar-small {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.8rem;
          color: white;
        }
        
        .company-badge {
          background: var(--bg-tertiary);
          padding: 0.25rem 0.75rem;
          border-radius: 2rem;
          font-size: 0.85rem;
          color: var(--text-primary);
        }
      `}} />
    </div>
  );
};

export default Dashboard;
