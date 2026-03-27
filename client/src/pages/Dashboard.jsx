import { useState, useEffect } from 'react'
import { useUser, useAuth, SignOutButton } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { getProjects, deleteProject } from '../api/projects'

function Dashboard() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = await getToken()
        const data = await getProjects(token)
        setProjects(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [getToken])

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!confirm('Delete this project?')) return
    try {
      const token = await getToken()
      await deleteProject(id, token)
      setProjects(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0c29',
      color: 'white',
      fontFamily: 'sans-serif',
      padding: '40px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
      }}>
        <h1 style={{ fontSize: '1.8rem' }}>My AR Projects</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/projects/new')}
            style={{
              background: 'white',
              color: '#302b63',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            + New Project
          </button>
          <span style={{ opacity: 0.6, fontSize: '0.9rem' }}>
            {user?.firstName || user?.emailAddresses?.[0]?.emailAddress}
          </span>
          <SignOutButton>
            <button style={{
              background: 'transparent',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}>
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p style={{ opacity: 0.5, textAlign: 'center', marginTop: '80px' }}>Loading...</p>
      ) : projects.length === 0 ? (
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '80px',
          textAlign: 'center',
        }}>
          <p style={{ opacity: 0.4, marginBottom: '20px', fontSize: '1.1rem' }}>
            No projects yet
          </p>
          <button
            onClick={() => navigate('/projects/new')}
            style={{
              background: 'white',
              color: '#302b63',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            + New Project
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => navigate(`/projects/${project.id}`)}
              onDelete={(e) => handleDelete(project.id, e)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ProjectCard({ project, onClick, onDelete }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.08)',
        transition: 'transform 0.15s, background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
    >
      {/* Thumbnail */}
      <div style={{
        height: '160px',
        background: 'rgba(0,0,0,0.3)',
        overflow: 'hidden',
      }}>
        <img
          src={project.targetImage}
          alt={project.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Info */}
      <div style={{ padding: '16px' }}>
        <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: '600' }}>
          {project.title}
        </h3>
        {project.description && (
          <p style={{ margin: '0 0 12px', opacity: 0.5, fontSize: '0.85rem', lineHeight: 1.4 }}>
            {project.description}
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ opacity: 0.4, fontSize: '0.8rem' }}>
            {project.viewCount} views
          </span>
          <button
            onClick={onDelete}
            style={{
              background: 'transparent',
              color: 'rgba(255,100,100,0.7)',
              border: '1px solid rgba(255,100,100,0.3)',
              padding: '4px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
