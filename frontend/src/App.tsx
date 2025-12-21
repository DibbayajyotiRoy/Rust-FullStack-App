import { useState, useEffect } from 'react'

interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

const API_URL = '/api/users';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tighter bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-neutral-400 mt-2">Rust API + React Frontend (Vite, Bun, Tailwind v4)</p>
        </header>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="grid gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="group relative bg-neutral-900 border border-neutral-800 p-6 rounded-2xl hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{user.username}</h3>
                    <p className="text-neutral-500 text-sm font-mono">{user.email}</p>
                  </div>
                  <span className="text-xs bg-neutral-800 px-2 py-1 rounded text-neutral-500">
                    {user.id.split('-')[0]}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-800 text-xs text-neutral-600 flex justify-between">
                  <span>Created: {new Date(user.created_at).toLocaleDateString()}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400">View Details →</span>
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <div className="text-center p-12 border-2 border-dashed border-neutral-800 rounded-3xl">
                <p className="text-neutral-500 text-lg">No users found in the database.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
