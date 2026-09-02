import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { PageTitle } from './Actualites.jsx'

export default function Agenda(){
 const [items,setItems]=useState([]); const [loading,setLoading]=useState(true)
 useEffect(()=>{supabase.from('events').select('*').order('starts_at',{ascending:true}).then(({data})=>{setItems(data||[]);setLoading(false)})},[])
 return <><PageTitle eyebrow="Vie de l'amicale" title="Agenda" text="Réunions, sorties, rencontres et temps forts à venir." />{loading?<div className="skeleton-card tall"/>:<div className="timeline">{items.length?items.map(x=>{const d=new Date(x.starts_at);return <article className="timeline-item" key={x.id}><div className="timeline-date"><strong>{d.getDate()}</strong><span>{d.toLocaleDateString('fr-FR',{month:'short',year:'numeric'})}</span></div><div className="timeline-card"><span className="event-time">{d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</span><h2>{x.title}</h2>{x.location&&<p>📍 {x.location}</p>}{x.description&&<p>{x.description}</p>}</div></article>}):<div className="empty-state">Aucun événement enregistré.</div>}</div>}</>
}
