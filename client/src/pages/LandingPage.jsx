import { SignInButton, SignedIn, SignedOut } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      color: 'white',
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '20px',
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        Bring Your Art to Life
      </h1>
      <p style={{ fontSize: '1.2rem', maxWidth: '600px', marginBottom: '2rem', opacity: 0.8 }}>
        Upload an image and a video – get a QR code that makes your art come alive in Augmented Reality. No app needed.
      </p>

      <SignedOut>
        <SignInButton mode="modal">
          <button style={{
            background: 'white',
            color: '#302b63',
            border: 'none',
            padding: '14px 32px',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}>
            Get Started – It's Free
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'white',
            color: '#302b63',
            border: 'none',
            padding: '14px 32px',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}>
          Go to Dashboard
        </button>
      </SignedIn>
    </div>
  )
}

export default LandingPage