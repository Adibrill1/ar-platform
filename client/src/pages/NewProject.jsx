import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'

function NewProject() {
  const navigate = useNavigate()
  const { getToken } = useAuth()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [targetImage, setTargetImage] = useState(null)
  const [overlayVideo, setOverlayVideo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) return setError('Title is required')
    if (!targetImage) return setError('Target image is required')
    if (!overlayVideo) return setError('Overlay video is required')

    setLoading(true)
    try {
      const token = await getToken()
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('targetImage', targetImage)
      formData.append('overlayVideo', overlayVideo)

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create project')
      }

      const project = await res.json()
      navigate(`/projects/${project.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0c29',
      color: 'white',
      fontFamily: 'sans-serif',
      padding: '40px',
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: '560px' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'transparent',
            color: 'rgba(255,255,255,0.6)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem',
            marginBottom: '24px',
            padding: 0,
          }}
        >
          ← Back to Dashboard
        </button>

        <h1 style={{ fontSize: '1.8rem', marginBottom: '32px' }}>New AR Project</h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Project Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Museum Exhibit AR"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={labelStyle}>Target Image * (the image to scan)</label>
            <FileDropZone
              accept="image/*"
              file={targetImage}
              onChange={setTargetImage}
              hint="PNG, JPG, WEBP"
            />
          </div>

          <div>
            <label style={labelStyle}>Overlay Video * (plays when image is detected)</label>
            <FileDropZone
              accept="video/*"
              file={overlayVideo}
              onChange={setOverlayVideo}
              hint="MP4, MOV, WEBM"
            />
          </div>

          {error && (
            <p style={{ color: '#ff6b6b', fontSize: '0.9rem', margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? 'rgba(255,255,255,0.3)' : 'white',
              color: '#302b63',
              border: 'none',
              padding: '14px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '8px',
            }}
          >
            {loading ? 'Uploading...' : 'Create Project'}
          </button>
        </form>
      </div>
    </div>
  )
}

function FileDropZone({ accept, file, onChange, hint }) {
  const handleChange = (e) => {
    if (e.target.files[0]) onChange(e.target.files[0])
  }

  return (
    <label style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      border: '2px dashed rgba(255,255,255,0.2)',
      borderRadius: '10px',
      padding: '28px',
      cursor: 'pointer',
      background: file ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
      transition: 'background 0.2s',
    }}>
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      {file ? (
        <span style={{ color: '#a8ff78', fontSize: '0.95rem' }}>✓ {file.name}</span>
      ) : (
        <>
          <span style={{ fontSize: '1.8rem' }}>+</span>
          <span style={{ opacity: 0.5, fontSize: '0.85rem' }}>{hint}</span>
        </>
      )}
    </label>
  )
}

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '0.9rem',
  opacity: 0.8,
}

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '8px',
  padding: '12px',
  color: 'white',
  fontSize: '1rem',
  boxSizing: 'border-box',
  outline: 'none',
}

export default NewProject
