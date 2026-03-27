import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

// MindAR requires full-page DOM control, so we redirect to the standalone ar.html page.
// The React route /ar/:slug → /ar.html?slug=...
function ARViewer() {
  const { slug } = useParams()

  useEffect(() => {
    window.location.replace(`/ar.html?slug=${slug}`)
  }, [slug])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0c29',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'sans-serif',
    }}>
      <p>Loading AR experience...</p>
    </div>
  )
}

export default ARViewer
