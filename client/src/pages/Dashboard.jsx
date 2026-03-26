import { useUser, SignOutButton } from '@clerk/clerk-react'

function Dashboard() {
  const { user } = useUser()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0c29',
      color: 'white',
      fontFamily: 'sans-serif',
      padding: '40px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
      }}>
        <h1 style={{ fontSize: '1.8rem' }}>My AR Projects</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ opacity: 0.7 }}>Hello, {user?.firstName}</span>
          <SignOutButton>
            <button style={{
              background: 'transparent',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
            }}>
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '12px',
        padding: '60px',
        textAlign: 'center',
      }}>
        <p style={{ opacity: 0.5, marginBottom: '20px' }}>No projects yet</p>
        <button style={{
          background: 'white',
          color: '#302b63',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}>
          + New Project
        </button>
      </div>
    </div>
  )
}

export default Dashboard