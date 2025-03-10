import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const handleHomeClick = () => {
    if (token) {
      if (role === 'investor') {
        navigate('/investor-dashboard');
      } else if (role === 'entrepreneur') {
        navigate('/entrepreneur-dashboard');
      }
    } else {
      navigate('/');
    }
  };
  // backdrop-blur-md 
  return (
    <nav className=" fixed w-dvw bg-white z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              onClick={handleHomeClick}
              className="text-2xl font-bold text-black hover:text-gray-700 transition-colors duration-200"
            >
              INVSTART HUB
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {token ? (
              <>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800 transition-all font-medium text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800 transition-all font-medium text-sm"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800 transition-all font-medium text-sm"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}