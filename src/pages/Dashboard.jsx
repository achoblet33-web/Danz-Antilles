import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function Dashboard() {
  const [news, setNews] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('news').select('id,title,summary,published_at').eq('published', true).order('published_at', { ascending: false }).limit(3),
      supabase.from('events').select('id,title,starts_at,location').gte('starts_at', new Date().toISOString()).order('starts_at').limit(3),
    ]).then(([newsResult, eventsResult]) => {
      setNews(newsResult.data || [])
      setEvents(eventsResult.data || [])
      setLoading(false)
    })
  }, [])

  return <>
    <section className="hero-card"><div><span className="eyebrow">Amicale DANZ Antilles</span><h1>Bienvenue dans votre espace amicaliste.</h1><p>Retrouvez ici les informations utiles, les prochains rendez-vous et les documents partagés par le bureau.</p></div><div className="hero-symbol">☀</div></section>
    <div className="section-heading"><div><span className="eyebrow">À la une</span><h2>Dernières actualités</h2></div><a href="#/actualites">Tout voir →</a></div>
    <div className="card-grid three">{loading ? <Skeleton count={3} /> : news.length ? news.map(item => <article className="content-card" key={item.id}><time>{formatDate(item.published_at)}</time><h3>{item.title}</h3><p>{item.summary}</p></article>) : <Empty text="Aucune actualité publiée pour le moment." />}</div>
    <div className="section-heading"><div><span className="eyebrow">Agenda</span><h2>Prochains rendez-vous</h2></div><a href="#/agenda">Voir l'agenda →</a></div>
    <div className="card-grid three">{loading ? <Skeleton count={3} /> : events.length ? events.map(item => <article className="event-card" key={item.id}><div className="date-tile"><strong>{new Date(item.starts_at).getDate()}</strong><span>{new Date(item.starts_at).toLocaleDateString('fr-FR',{month:'short'})}</span></div><div><h3>{item.title}</h3><p>{item.location || 'Lieu à préciser'}</p><small>{new Date(item.starts_at).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</small></div></article>) : <Empty text="Aucun événement à venir." />}</div>
  </>
}

function formatDate(value){ return new Date(value).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}) }
function Empty({text}){ return <div className="empty-state">{text}</div> }
function Skeleton({count}){ return Array.from({length:count}).map((_,i)=><div className="skeleton-card" key={i} />) }
