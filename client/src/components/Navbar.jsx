import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-primary-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.jpeg" alt="ZUT Logo" className="w-12 h-12 rounded-lg object-contain bg-white p-0.5" />
          <div>
            <p className="text-white font-bold text-lg leading-none">ZUT</p>
            <p className="text-accent-400 text-xs font-medium">Lost & Found</p>
          </div>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-4">
          <Link to="/" className="text-white hover:text-accent-400 transition font-medium text-sm">
            Browse Items
          </Link>
          {user ? (
            <>
              <Link to="/post" className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                + Post Item
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-white text-sm">Hi, {user.name}!</span>
                <button onClick={handleLogout} className="text-accent-400 hover:text-white text-sm transition">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-accent-400 transition text-sm font-medium">
                Login
              </Link>
              <Link to="/register" className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}