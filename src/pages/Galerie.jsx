import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { PageTitle } from './Actualites.jsx'

export default function Galerie(){
 const [items,setItems]=useState([])
 useEffect(()=>{supabase.from('gallery').select('*').order('taken_at',{ascending:false}).then(({data})=>setItems(data||[]))},[])
 return <><PageTitle eyebrow="Souvenirs" title="Galerie" text="Quelques souvenirs de la vie de l'Amicale DANZ Antilles." /><div className="gallery-grid">{items.length?items.map(x=><figure className="gallery-item" key={x.id}><img src={x.image_url} alt={x.title||'Photo de l’amicale'} loading="lazy" /><figcaption><strong>{x.title}</strong>{x.taken_at&&<span>{new Date(x.taken_at).toLocaleDateString('fr-FR',{month:'long',year:'numeric'})}</span>}</figcaption></figure>):<div className="empty-state">La galerie sera bientôt alimentée.</div>}</div></>
}
