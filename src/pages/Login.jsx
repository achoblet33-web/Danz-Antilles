import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { user, signIn, configured } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to="/" replace />

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signIn(email.trim(), password)
    } catch (err) {
      setError(err.message === 'Invalid login credentials' ? 'Identifiants incorrects.' : err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-page">
      <section className="login-visual">
        <div className="login-overlay">
          <div className="brand brand-light"><div className="brand-mark">DA</div><div><strong>Amicale DANZ</strong><span>Antilles</span></div></div>
          <div className="welcome-copy"><span className="eyebrow">Bienvenue</span><h1>Notre amicale,<br />notre espace.</h1><p>Actualités, rendez-vous, documents et souvenirs de l'Amicale DANZ Antilles, réunis dans un espace réservé aux adhérents.</p></div>
        </div>
      </section>
      <section className="login-panel">
        <form className="login-card" onSubmit={submit}>
          <div className="mobile-logo"><div className="brand-mark">DA</div></div>
          <span className="eyebrow">Espace privé</span>
          <h2>Connexion amicaliste</h2>
          <p className="muted">Utilisez l'adresse e-mail enregistrée par le bureau de l'amicale.</p>
          {!configured && <div className="alert warning"><strong>Configuration nécessaire.</strong><br />Les variables Supabase doivent être ajoutées avant la première connexion.</div>}
          {error && <div className="alert error">{error}</div>}
          <label>Adresse e-mail<input type="email" required autoComplete="email" placeholder="prenom.nom@exemple.fr" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label>Mot de passe<input type="password" required autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          <button className="primary-button" disabled={busy || !configured}>{busy ? 'Connexion…' : 'Se connecter'}</button>
          <p className="login-help">Vous n'avez pas encore de compte ? Contactez un membre du bureau. L'inscription libre est désactivée.</p>
        </form>
      </section>
    </div>
  )
}
