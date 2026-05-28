import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form)
      login(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <img src="/logo.jpeg" alt="ZUT Logo" className="w-28 h-28 rounded-2xl object-contain bg-white p-2 mx-auto mb-4 shadow-lg" />
          <h1 className="text-white text-3xl font-black">Create account</h1>
          <p className="text-blue-300 mt-1">Join the ZUT Lost & Found community</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-blue-200 text-sm font-medium block mb-2">Full name</label>
              <input
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-500 transition"
                required
              />
            </div>

            <div>
              <label className="text-blue-200 text-sm font-medium block mb-2">Email address</label>
              <input
                type="email"
                placeholder="you@zut.ac.zm"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-500 transition"
                required
              />
            </div>

            <div>
              <label className="text-blue-200 text-sm font-medium block mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-500 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition text-lg mt-2"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-blue-300 mt-6 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-400 font-semibold hover:text-accent-500 transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}