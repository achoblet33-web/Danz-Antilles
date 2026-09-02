import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function Actualites(){
  const [items,setItems]=useState([])
  const [loading,setLoading]=useState(true)
  useEffect(()=>{supabase.from('news').select('*').eq('published',true).order('published_at',{ascending:false}).then(({data})=>{setItems(data||[]);setLoading(false)})},[])
  return <><PageTitle eyebrow="Informations" title="Actualités" text="Les nouvelles et communications du bureau de l'amicale." />{loading?<div className="skeleton-card tall"/>:<div className="stack">{items.length?items.map(x=><article className="article-card" key={x.id}><time>{new Date(x.published_at).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}</time><h2>{x.title}</h2>{x.summary&&<p className="lead">{x.summary}</p>}{x.content&&<p>{x.content}</p>}</article>):<div className="empty-state">Aucune actualité publiée.</div>}</div>}</>
}
export function PageTitle({eyebrow,title,text}){return <div className="page-title"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>}
