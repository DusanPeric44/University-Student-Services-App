import { useMemo, useState } from 'react';
import { Search, UserCircle, ArrowLeft, LogIn } from 'lucide-react';
import { usePersistence } from '../hooks/usePersistence';
import { STORAGE_KEYS, INITIAL_DATA, User } from '../lib/storage';
import { Card } from './shared/Card';
import { Button } from './shared/Button';
import { toast } from 'sonner';

interface LoginUserProps {
  role: 'student' | 'professor' | 'admin';
  onBack: () => void;
  onLogin: (user: User) => void;
}

export function LoginUser({ role, onBack, onLogin }: LoginUserProps) {
  const [users] = usePersistence<User[]>(STORAGE_KEYS.USERS, INITIAL_DATA.USERS);
  const [query, setQuery] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const candidates = useMemo(
    () =>
      users
        .filter(u => u.role === role && u.status === 'active')
        .filter(
          u =>
            u.name.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase())
        ),
    [users, role, query]
  );

  const handleEmailLogin = () => {
    const user = users.find(
      u => u.role === role && u.status === 'active' && u.email.toLowerCase() === emailInput.toLowerCase().trim()
    );
    if (!user) {
      toast.error('No active user found with that email');
      return;
    }
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-3xl w-full space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-blue-900">Login as {role}</h1>
          <Button variant="secondary" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-2">Search Users</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name or email"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Login by Email</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="email@university.edu"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={handleEmailLogin}>
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Active Users">
          <div className="space-y-3">
            {candidates.length > 0 ? (
              candidates.map(user => (
                <button
                  key={user.id}
                  onClick={() => onLogin(user)}
                  className="w-full p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center gap-4 text-left"
                >
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <UserCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.department || 'General'}</p>
                  </div>
                  <Button size="sm">
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
                </button>
              ))
            ) : (
              <div className="p-4 border border-dashed border-gray-200 rounded-lg text-center text-gray-500">
                No active {role} users found. Please add users in the Admin portal.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
