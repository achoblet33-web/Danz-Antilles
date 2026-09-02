import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { PageTitle } from './Actualites.jsx'

export default function Profile(){
 const {user}=useAuth(); const [profile,setProfile]=useState(null)
 useEffect(()=>{supabase.from('profiles').select('*').eq('id',user.id).single().then(({data})=>setProfile(data))},[user.id])
 return <><PageTitle eyebrow="Compte" title="Mon profil" text="Les informations liées à votre accès amicaliste." /><div className="profile-card"><div className="profile-avatar">{(profile?.full_name||user.email||'A')[0].toUpperCase()}</div><div><h2>{profile?.full_name||'Amicaliste'}</h2><p>{user.email}</p><span className="role-badge">{profile?.role==='admin'?'Membre du bureau':'Amicaliste'}</span></div></div><div className="text-panel"><h2>Besoin de modifier vos informations ?</h2><p>Pour le moment, les comptes sont gérés par le bureau afin de garantir que l'accès reste réservé aux adhérents.</p></div></>
}
