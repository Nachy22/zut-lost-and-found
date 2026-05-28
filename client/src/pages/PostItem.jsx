import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function PostItem() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    category: 'other',
    status: 'lost',
  })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { token } = useAuth()
  const navigate = useNavigate()

  const handleImage = (e) => {
    const file = e.target.files[0]
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, val]) => formData.append(key, val))
      if (image) formData.append('image', image)

      await axios.post('http://localhost:5000/api/items', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary-900 px-4 py-12">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-black">Post an item</h1>
          <p className="text-blue-300 mt-1">Help reunite someone with their belongings 🙌</p>
        </div>

        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Status Toggle */}
            <div>
              <label className="text-blue-200 text-sm font-medium block mb-3">What are you posting?</label>
              <div className="grid grid-cols-2 gap-3">
                {['lost', 'found'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm({...form, status: s})}
                    className={`py-3 rounded-xl font-bold text-sm capitalize transition ${
                      form.status === s
                        ? s === 'lost'
                          ? 'bg-red-500/30 border-2 border-red-500 text-red-300'
                          : 'bg-green-500/30 border-2 border-green-500 text-green-300'
                        : 'bg-white/5 border-2 border-white/10 text-blue-300 hover:bg-white/10'
                    }`}
                  >
                    {s === 'lost' ? '😢 I Lost Something' : '🎉 I Found Something'}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-blue-200 text-sm font-medium block mb-2">Item title</label>
              <input
                type="text"
                placeholder="e.g. Black iPhone 13, Blue Backpack..."
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-500 transition"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-blue-200 text-sm font-medium block mb-2">Description</label>
              <textarea
                placeholder="Describe the item in detail — color, brand, any identifying features..."
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                rows={3}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-500 transition resize-none"
              />
            </div>

            {/* Location + Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-blue-200 text-sm font-medium block mb-2">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Library, Block C..."
                  value={form.location}
                  onChange={e => setForm({...form, location: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-500 transition"
                />
              </div>
              <div>
                <label className="text-blue-200 text-sm font-medium block mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})}
                  className="w-full bg-primary-600 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent-500 transition"
                >
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="documents">Documents</option>
                  <option value="accessories">Accessories</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-blue-200 text-sm font-medium block mb-2">Photo (optional)</label>
              <label className="cursor-pointer block">
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
                  preview ? 'border-accent-500' : 'border-white/20 hover:border-accent-500/50'
                }`}>
                  {preview ? (
                    <img src={preview} alt="preview" className="max-h-40 mx-auto rounded-lg object-cover" />
                  ) : (
                    <>
                      <p className="text-4xl mb-2">📸</p>
                      <p className="text-blue-300 text-sm">Click to upload a photo</p>
                      <p className="text-blue-400 text-xs mt-1">JPG, PNG up to 5MB</p>
                    </>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition text-lg"
            >
              {loading ? 'Posting...' : 'Post Item 🚀'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}