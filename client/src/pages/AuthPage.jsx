import '../styles/auth.css'
import {SignInButton} from '@clerk/clerk-react'

const AuthPage = () => {
  return (
    <div className="auth-container">
        <div className="auth-left">
            <div className="auth-hero">
                <div className="brand-container">
                    <img src="/logo.png" alt="Puga" className="brand-logo" style={{width: '150px', height: '150px'}}/>
                    <span className="brand-name">Puga</span>
                </div>
                <h1 className="hero-title">Connect now✨</h1>
                <p className='hero-subtitle'>Socialise with friends and family in real-time.</p>
                <div className="features-list">
                    <div className="feature-item">
                        <span className="feature-icon">💬</span>
                        <span>Real-time messaging</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🎥</span>
                        <span>Video calls & meetings</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🔒</span>
                        <span>Secure and private</span>
                    </div>
                </div>
                <SignInButton mode='modal'>
                    <button className="cta-button">
                    Get started with PUGA
                    <span className="button-arrow">→</span>
                    </button>
                </SignInButton>
            </div>
        </div>
        <div className="auth-right">
            <div className="auth-image-container">
                <img src="/auth-i.png" alt="Collaboration" className="auth-image" />
                <div className="image-overlay"></div>
            </div>
        </div>
    </div>
  )
}

export default AuthPage