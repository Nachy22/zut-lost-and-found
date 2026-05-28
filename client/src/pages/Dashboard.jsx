import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const categoryColors = {
  electronics: 'bg-blue-500/20 text-blue-300',
  clothing: 'bg-purple-500/20 text-purple-300',
  documents: 'bg-yellow-500/20 text-yellow-300',
  accessories: 'bg-pink-500/20 text-pink-300',
  other: 'bg-gray-500/20 text-gray-300',
}

export default function Dashboard() {
  const [items, setItems] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const { user, token } = useAuth()

  useEffect(() => {
    fetchItems()
  }, [])

  useEffect(() => {
    let result = items
    if (search) {
      result = result.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (statusFilter !== 'all') {
      result = result.filter(item => item.status === statusFilter)
    }
    setFiltered(result)
  }, [search, statusFilter, items])

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/items')
      setItems(res.data)
      setFiltered(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchItems()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-primary-900">
      
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 px-4 py-16 text-center">
        <h1 className="text-white text-4xl font-black mb-2">
          Lost something? <span className="text-accent-400">We've got you.</span>
        </h1>
        <p className="text-blue-200 text-lg mb-8">
          Browse items lost and found across ZUT campus
        </p>

        {/* Search */}
        <div className="max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search for your lost item..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/40 rounded-2xl px-6 py-4 focus:outline-none focus:border-accent-500 transition text-lg"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        
        {/* Filters */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex gap-2">
            {['all', 'lost', 'found'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition ${
                  statusFilter === status
                    ? 'bg-accent-500 text-white'
                    : 'bg-white/5 text-blue-200 hover:bg-white/10'
                }`}
              >
                {status === 'all' ? 'All Items' : status === 'lost' ? '😢 Lost' : '🎉 Found'}
              </button>
            ))}
          </div>
          <p className="text-blue-300 text-sm">{filtered.length} item{filtered.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-blue-300 mt-4">Loading items...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-white text-xl font-bold">Nothing here yet</p>
            <p className="text-blue-300 mt-2">Be the first to post a lost or found item!</p>
            {user && (
              <Link to="/post" className="inline-block mt-6 bg-accent-500 hover:bg-accent-600 text-white font-bold px-8 py-3 rounded-xl transition">
                Post an Item
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(item => (
              <div key={item.id} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden hover:border-accent-500/50 transition group">
                
                {/* Image */}
                <div className="h-48 bg-primary-700 flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img
                      src={`http://localhost:5000/uploads/${item.image}`}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <span className="text-6xl">
                      {item.category === 'electronics' ? '📱' :
                       item.category === 'clothing' ? '👕' :
                       item.category === 'documents' ? '📄' :
                       item.category === 'accessories' ? '🎒' : '📦'}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-bold text-lg leading-tight">{item.title}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ml-2 shrink-0 ${
                      item.status === 'lost' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
                    }`}>
                      {item.status === 'lost' ? 'LOST' : 'FOUND'}
                    </span>
                  </div>
                  
                  <p className="text-blue-300 text-sm mb-3 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-lg capitalize ${categoryColors[item.category] || categoryColors.other}`}>
                        {item.category}
                      </span>
                      {item.location && (
                        <span className="text-blue-400 text-xs">📍 {item.location}</span>
                      )}
                    </div>
                    {user && user.id === item.user_id && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-400 hover:text-red-300 text-xs transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}