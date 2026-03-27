import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { getProject, deleteProject } from '../api/projects'

function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const loadProject = async () => {
      try {
        const token = await getToken()
        const data = await getProject(id, token)
        setProject(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadProject()
  }, [id, getToken])

  const handleDelete = async () => {
    if (!confirm('Delete this project permanently?')) return
    try {
      const token = await getToken()
      await deleteProject(id, token)
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(project.arUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadQR = () => {
    const a = document.createElement('a')
    a.href = project.qrCodeUrl
    a.download = `${project.slug}-qr.png`
    a.click()
  }

  if (loading) return (
    <div style={pageStyle}>
      <p style={{ opacity: 0.5, textAlign: 'center', marginTop: '80px' }}>Loading...</p>
    </div>
  )

  if (!project) return (
    <div style={pageStyle}>
      <p style={{ opacity: 0.5, textAlign: 'center', marginTop: '80px' }}>Project not found.</p>
    </div>
  )

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Back */}
        <button onClick={() => navigate('/dashboard')} style={backBtnStyle}>
          ← Back to Dashboard
        </button>

        {/* Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>{project.title}</h1>
            {project.description && (
              <p style={{ opacity: 0.5, fontSize: '0.95rem' }}>{project.description}</p>
            )}
            <p style={{ opacity: 0.4, fontSize: '0.85rem', marginTop: '6px' }}>
              {project.viewCount} views
            </p>
          </div>
          <button onClick={handleDelete} style={deleteBtnStyle}>Delete Project</button>
        </div>

        {/* Media previews */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
          <div>
            <p style={labelStyle}>Target Image</p>
            <img
              src={project.targetImage}
              alt="target"
              style={{ width: '100%', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>
          <div>
            <p style={labelStyle}>Overlay Video</p>
            <video
              src={project.overlayVideo}
              controls
              style={{ width: '100%', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>
        </div>

        {/* QR + Link */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '16px',
          padding: '32px',
          display: 'flex',
          gap: '40px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          {/* QR Code */}
          <div style={{ textAlign: 'center' }}>
            <img
              src={project.qrCodeUrl}
              alt="QR Code"
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '12px',
                background: 'white',
                padding: '8px',
                display: 'block',
              }}
            />
            <button onClick={downloadQR} style={actionBtnStyle}>
              Download QR
            </button>
          </div>

          {/* AR Link */}
          <div style={{ flex: 1, minWidth: '240px' }}>
            <p style={labelStyle}>AR Viewer Link</p>
            <p style={{ opacity: 0.5, fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.5 }}>
              Share this link or scan the QR code. Opening it on a phone activates the camera and AR experience.
            </p>
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '8px',
              padding: '12px',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              wordBreak: 'break-all',
              marginBottom: '12px',
              opacity: 0.8,
            }}>
              {project.arUrl}
            </div>
            <button onClick={copyLink} style={actionBtnStyle}>
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const pageStyle = {
  minHeight: '100vh',
  background: '#0f0c29',
  color: 'white',
  fontFamily: 'sans-serif',
  padding: '40px',
}

const backBtnStyle = {
  background: 'transparent',
  color: 'rgba(255,255,255,0.5)',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.9rem',
  marginBottom: '24px',
  padding: 0,
}

const labelStyle = {
  fontSize: '0.8rem',
  opacity: 0.5,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '10px',
}

const deleteBtnStyle = {
  background: 'transparent',
  color: 'rgba(255,100,100,0.8)',
  border: '1px solid rgba(255,100,100,0.3)',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.85rem',
}

const actionBtnStyle = {
  background: 'white',
  color: '#302b63',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '0.9rem',
  marginTop: '12px',
}

export default ProjectDetail
