import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import axiosInstance from '../api/axios';

export default function Matchmaking() {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/matches');
        console.log('Fetched matches:', response.data);
        setMatches(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch matches.');
        console.error('Fetch matches error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const getDisplayName = (entity, type) => {
    if (!entity) return `Unknown ${type}`;
    if (typeof entity === 'object' && entity.name) return entity.name;
    if (typeof entity === 'string') return `${type} ID: ${entity}`;
    return `Unknown ${type}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow px-6 md:px-12 py-8 pt-24 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Matchmaking</h1>
          <div className="flex mt-4 md:mt-0 space-x-3">
            <Link to="/investordashboard" className="px-4 py-2 bg-zinc-950 text-white font-medium rounded-lg shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all">
              Investor Dashboard
            </Link>
            <Link to="/investorpreference" className="px-4 py-2 bg-zinc-950 text-white font-medium rounded-lg shadow-sm border hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all">
              Investment Preferences
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex space-x-4">
              <div className="h-12 w-12 bg-zinc-600 rounded-full"></div>
              <div className="space-y-4">
                <div className="h-4 bg-zinc-600 rounded w-36"></div>
                <div className="h-4 bg-zinc-600 rounded w-24"></div>
              </div>
            </div>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600 mb-4">No matches found. Check back later!</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all">
              Refresh
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <Card key={match._id} className="flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Match Details</h2>
                    {match.status && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-950 text-white">
                        {match.status}
                      </span>
                    )}
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium">Startup:</span> {getDisplayName(match.startupId, 'Startup')}
                    </p>
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium">Investor:</span> {getDisplayName(match.investorId, 'Investor')}
                    </p>
                  </div>
                  {match.matchScore !== undefined && (
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-500">Match Score</span>
                        <span className="font-semibold text-gray-900">{match.matchScore}</span>
                      </div>
                    </div>
                  )}
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <button className="w-full px-4 py-2 bg-zinc-950 text-white rounded-lg hover:bg-gray-800 transition-all text-sm font-medium flex items-center justify-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 17l6 6 12-12" />
                      </svg>
                      View Details
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}