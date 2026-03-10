import React, { useState, useEffect } from 'react';
import { fetchAllUsers } from '../../services/apiClient';
import { useNavigate } from 'react-router-dom';

const ManageAmbassadors = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAllUsers();
      data.sort((a, b) => b.points - a.points);
      setUsers(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadUsers(); }, []);

  if (loading) return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-border-default border-t-primary" />
    </div>
  );

  return (
    <div className="animate-fade-in mx-auto max-w-[1200px] px-6 py-10">
      <h1 className="mb-1 text-3xl font-extrabold text-text-primary">Ambassadors Directory</h1>
      <p className="mb-8 text-sm text-text-secondary">Explore all registered ambassadors globally.</p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
        {users.map(u => (
          <div
            key={u.id}
            onClick={() => navigate(`/admin/ambassadors/${u.id}`)}
            className="group flex cursor-pointer flex-col gap-4 rounded-xl border border-border-default bg-bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary-dim hover:shadow-card"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-dim to-secondary-dim text-lg font-extrabold text-white shadow-sm">
                {u.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight text-text-primary group-hover:text-primary-hover transition-colors">{u.name}</span>
                <span className="text-xs font-medium text-text-secondary">{u.city}, {u.country}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-dashed border-border-subtle pt-4">
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold uppercase border ${
                u.onboarded ? 'border-success/30 bg-success-bg text-success' : 'border-warning/30 bg-warning-bg text-warning'
              }`}>
                {u.onboarded ? 'Verified' : 'Pending'}
              </span>
              <div className="flex items-center gap-1 text-sm font-extrabold text-accent-gold">
                ★ <span>{u.points}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageAmbassadors;
