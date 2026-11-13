import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase, isConfigured } from './supabase'
import {
  Activity, AlertCircle, ArrowDownUp, ArrowUpRight, Bell, Check, CheckCircle2,
  ChevronDown, ClipboardList, Clock3, GraduationCap, LayoutDashboard, LogOut,
  Menu, Moon, Plus, Search, ShieldCheck, Sparkles, Sun, Wifi, Wrench, X,
  Zap, CircleHelp, MapPin, CalendarDays, Filter, type LucideIcon
} from 'lucide-react'

type Profile = { id: string; full_name: string; role: 'student' | 'admin' }
type Issue = { id: string; title: string; description: string; category: string; location: string; priority: string; status: string; created_at: string; user_id: string }
const categories = ['Wi-Fi / Internet', 'Classroom Equipment', 'Electrical', 'Cleanliness', 'Furniture', 'Other']
const statuses = ['Submitted', 'In Progress', 'Resolved']

export default function App() {
  const [session, setSession] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [issues, setIssues] = useState<Issue[]>([])
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [authBusy, setAuthBusy] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [dark, setDark] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', category: categories[0], location: '', priority: 'Medium' })

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, current) => setSession(current))
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session || !supabase) { setProfile(null); setIssues([]); return }
    void loadProfileAndIssues()
  }, [session])

  async function loadProfileAndIssues() {
    if (!supabase || !session) return
    const { data: p, error: profileError } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
    if (profileError) setNotice('Profile could not load: ' + profileError.message)
    else setProfile(p as Profile)
    const { data, error } = await supabase.from('issues').select('*').order('created_at', { ascending: false })
    if (error) setNotice('Issues could not load: ' + error.message)
    else setIssues((data || []) as Issue[])
  }

  async function authenticate(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setAuthBusy(true); setNotice('')
    const result = mode === 'signup'
      ? await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName.trim() } } })
      : await supabase.auth.signInWithPassword({ email, password })
    setAuthBusy(false)
    if (result.error) setNotice(result.error.message)
    else if (mode === 'signup' && !result.data.session) setNotice('Your account has been created. Check your email to confirm your address, then sign in.')
    else setNotice('')
  }

  async function createIssue(e: FormEvent) {
    e.preventDefault()
    if (!supabase || !session) return
    setBusy(true); setNotice('')
    const { error } = await supabase.from('issues').insert({ ...form, title: form.title.trim(), location: form.location.trim(), description: form.description.trim(), user_id: session.user.id })
    setBusy(false)
    if (error) setNotice(error.message)
    else {
      setForm({ title: '', description: '', category: categories[0], location: '', priority: 'Medium' })
      setShowForm(false); setNotice('Your issue has been submitted successfully.')
      await loadProfileAndIssues()
    }
  }

  async function updateStatus(id: string, status: string) {
    if (!supabase || profile?.role !== 'admin') return
    const { error } = await supabase.from('issues').update({ status }).eq('id', id)
    if (error) setNotice(error.message)
    else { setNotice('Issue status updated.'); await loadProfileAndIssues() }
  }

  async function logout() { await supabase?.auth.signOut(); setNotice('') }

  const isAdmin = profile?.role === 'admin'
  const visibleIssues = useMemo(() => issues.filter(issue => {
    const matchesStatus = filter === 'All' || issue.status === filter
    const matchesPriority = priorityFilter === 'All' || issue.priority === priorityFilter
    const q = search.trim().toLowerCase()
    const matchesSearch = !q || [issue.title, issue.description, issue.category, issue.location].some(v => v.toLowerCase().includes(q))
    return matchesStatus && matchesPriority && matchesSearch
  }), [issues, filter, priorityFilter, search])
  const count = (s: string) => issues.filter(i => i.status === s).length
  const firstName = profile?.full_name?.trim().split(' ')[0] || 'there'

  if (!isConfigured) return <SetupScreen />
  if (!session) return <main className="auth-page">
    <section className="auth-visual">
      <div className="auth-brand"><div className="brand-symbol"><GraduationCap size={23}/></div><span>Campus<span>Connect</span></span></div>
      <div className="visual-content">
        <span className="visual-kicker"><Sparkles size={14}/> SMARTER CAMPUS. BETTER TOGETHER.</span>
        <h1>A better campus<br/><em>starts with you.</em></h1>
        <p>One place to report campus concerns, follow progress, and help make everyday student life better.</p>
        <div className="visual-orbit"><div className="orbit-ring ring-one"/><div className="orbit-ring ring-two"/><div className="orbit-core"><GraduationCap size={43}/></div><div className="orbit-float float-a"><Wifi size={19}/></div><div className="orbit-float float-b"><CheckCircle2 size={19}/></div><div className="orbit-float float-c"><Wrench size={18}/></div></div>
      </div>
      <div className="visual-foot"><span><ShieldCheck size={15}/> Secure campus access</span><span>Campus operations, connected.</span></div>
    </section>
    <section className="auth-main">
      <div className="auth-top"><span>YOUR CAMPUS, IN ONE PLACE</span><div className="auth-top-icon"><ShieldCheck size={16}/> Secure sign in</div></div>
      <div className="auth-card">
        <div className="auth-mobile-brand"><div className="brand-symbol"><GraduationCap size={21}/></div><b>Campus<span>Connect</span></b></div>
        <div className="auth-heading"><span className="section-kicker">{mode === 'login' ? 'WELCOME BACK' : 'GET STARTED'}</span><h2>{mode === 'login' ? 'Sign in to your account' : 'Create your account'}</h2><p>{mode === 'login' ? 'Enter your details to continue to your campus workspace.' : 'Join your campus community and help improve student life.'}</p></div>
        <form onSubmit={authenticate} className="auth-form">
          {mode === 'signup' && <label>Full name<input required autoComplete="name" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full name"/></label>}
          <label>Email address<input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your college email"/></label>
          <label>Password<input type="password" required minLength={8} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password"/></label>
          <button className="primary auth-submit" disabled={authBusy}>{authBusy ? <span className="spinner"/> : <>{mode === 'login' ? 'Sign in' : 'Create account'}<ArrowUpRight size={17}/></>}</button>
        </form>
        {notice && <div className="notice auth-notice"><AlertCircle size={16}/><span>{notice}</span></div>}
        <p className="auth-switch">{mode === 'login' ? "Don't have an account?" : 'Already registered?'} <button className="text-button" onClick={() => {setMode(mode === 'login' ? 'signup' : 'login');setNotice('')}}>{mode === 'login' ? 'Create account' : 'Sign in'}</button></p>
        <div className="auth-assurance"><ShieldCheck size={15}/><span>Your account is protected with secure authentication.</span></div>
      </div>
      <p className="auth-copyright">© {new Date().getFullYear()} CampusConnect <span>·</span> Smart campus issue management</p>
    </section>
  </main>

  return <div className={`app-shell ${dark ? 'dark' : ''}`}>
    <div className={`mobile-scrim ${mobileNav ? 'visible' : ''}`} onClick={() => setMobileNav(false)}/>
    <aside className={`sidebar ${mobileNav ? 'open' : ''}`}>
      <div className="brand"><div className="brand-symbol"><GraduationCap size={22}/></div><span>Campus<span>Connect</span></span><button className="mobile-close" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={18}/></button></div>
      <div className="side-label">WORKSPACE</div>
      <button className="nav-item active"><LayoutDashboard size={18}/> <span>Overview</span><span className="nav-indicator"/></button>
      <div className="sidebar-note"><div className="sidebar-note-icon"><Sparkles size={16}/></div><div><b>Campus, improved.</b><span>Every report makes a difference.</span></div></div>
      <div className="side-bottom"><div className="avatar">{(profile?.full_name || session.user.email || 'U').slice(0,1).toUpperCase()}</div><div className="user-meta"><strong>{profile?.full_name || 'Campus user'}</strong><span>{isAdmin ? 'Administrator' : 'Student account'}</span></div><button className="icon-btn logout-btn" title="Sign out" onClick={logout}><LogOut size={17}/></button></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="heading-group"><button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={21}/></button><div><p className="eyebrow">CAMPUS OPERATIONS <span className="live-dot"/></p><h1>Issue dashboard</h1></div></div><div className="top-actions"><span className={`role-pill ${isAdmin ? 'admin' : ''}`}><ShieldCheck size={15}/>{isAdmin ? 'Administrator' : 'Student access'}</span><button className="icon-btn theme-toggle" title={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setDark(!dark)}>{dark ? <Sun size={18}/> : <Moon size={18}/>}</button><button className="primary top-report" onClick={() => setShowForm(!showForm)}><Plus size={17}/> Report an issue</button></div></header>
      {notice && <div className="notice-banner"><span className="notice-symbol"><Check size={15}/></span><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss notification"><X size={16}/></button></div>}
      <section className="welcome"><div className="welcome-copy"><p className="eyebrow light">CAMPUS, IMPROVED TOGETHER</p><h2>{isAdmin ? 'Welcome back, administrator.' : `Good to see you, ${firstName}.`}</h2><p>Small improvements make a better campus experience for everyone.</p><button className="welcome-link" onClick={() => setShowForm(true)}>Share a campus concern <ArrowUpRight size={15}/></button></div><div className="welcome-art"><div className="art-circle circle-one"/><div className="art-circle circle-two"/><div className="art-icon"><Wrench size={37}/></div><span className="art-spark spark-one">✦</span><span className="art-spark spark-two">✧</span></div><div className="welcome-bottom-line"/></section>
      <div className="section-intro"><div><span className="section-kicker">AT A GLANCE</span><h3>Your campus overview</h3></div><span className="updated-label"><Activity size={14}/> Live from your workspace</span></div>
      <section className="stats">
        <Stat icon={ClipboardList} label="Total issues" value={issues.length} tone="blue" detail="All reported concerns"/>
        <Stat icon={Clock3} label="In progress" value={count('In Progress')} tone="amber" detail="Currently being handled"/>
        <Stat icon={CheckCircle2} label="Resolved" value={count('Resolved')} tone="green" detail="Successfully completed"/>
      </section>
      {showForm && <section className="panel form-panel animate-in" id="report-form"><div className="panel-heading"><div><span className="section-kicker">NEW REQUEST</span><h3>Report a campus issue</h3><p className="panel-subtitle">Give the campus team the details they need to help.</p></div><button className="icon-btn close-form" onClick={() => setShowForm(false)} aria-label="Close form"><X size={19}/></button></div><form className="issue-form" onSubmit={createIssue}>
        <label>Issue title<input required minLength={3} maxLength={100} value={form.title} onChange={e => setForm({...form,title:e.target.value})} placeholder="Give your issue a clear title"/></label>
        <label>Category<select value={form.category} onChange={e => setForm({...form,category:e.target.value})}>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
        <label>Location<div className="input-with-icon"><MapPin size={16}/><input required value={form.location} onChange={e => setForm({...form,location:e.target.value})} placeholder="Where is the issue located?"/></div></label>
        <label>Priority<select value={form.priority} onChange={e => setForm({...form,priority:e.target.value})}><option>Low</option><option>Medium</option><option>High</option></select></label>
        <label className="wide">Description<textarea required minLength={5} rows={4} maxLength={1000} value={form.description} onChange={e => setForm({...form,description:e.target.value})} placeholder="Describe what happened and any details that may help…"/></label>
        <div className="wide form-footer"><span className="form-hint"><ShieldCheck size={14}/> Your report will be shared with campus administrators.</span><div className="form-actions"><button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button><button className="primary" disabled={busy}>{busy ? <><span className="spinner"/> Submitting</> : <>Submit report <ArrowUpRight size={16}/></>}</button></div></div>
      </form></section>}
      <section className="panel issues-panel"><div className="panel-heading issue-heading"><div><span className="section-kicker">TRACK & MANAGE</span><h3>{isAdmin ? 'All reported issues' : 'Your reported issues'}</h3><p className="panel-subtitle">{isAdmin ? 'Review campus concerns and keep progress moving.' : 'Follow the status of the concerns you have shared.'}</p></div><span className="issue-count">{visibleIssues.length} {visibleIssues.length === 1 ? 'issue' : 'issues'}</span></div>
        <div className="toolbar"><div className="search-box"><Search size={17}/><input aria-label="Search issues" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search issues, locations…"/>{search && <button onClick={() => setSearch('')} aria-label="Clear search"><X size={14}/></button>}</div><div className="filter-controls"><label className="filter-select"><Filter size={14}/><select aria-label="Filter by status" value={filter} onChange={e => setFilter(e.target.value)}>{['All',...statuses].map(s => <option key={s}>{s}</option>)}</select><ChevronDown size={14}/></label><label className="filter-select priority-filter"><ArrowDownUp size={14}/><select aria-label="Filter by priority" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>{['All','High','Medium','Low'].map(s => <option key={s}>{s === 'All' ? 'Priority' : s}</option>)}</select><ChevronDown size={14}/></label></div></div>
        {visibleIssues.length === 0 ? <div className="empty"><div className="empty-illustration"><div><ClipboardList size={29}/></div><span>✦</span></div><h3>{issues.length === 0 ? 'A clear start' : 'No matching issues'}</h3><p>{issues.length === 0 ? (isAdmin ? 'There are no campus reports yet. New reports will appear here.' : 'You have not submitted an issue yet. When you do, you can track its progress here.') : 'Try adjusting your search or filters to find what you are looking for.'}</p>{issues.length === 0 && !isAdmin && <button className="secondary-btn" onClick={() => setShowForm(true)}><Plus size={15}/> Report your first issue</button>}</div> : <div className="issue-list">{visibleIssues.map(issue => <IssueCard key={issue.id} issue={issue} isAdmin={!!isAdmin} onStatus={updateStatus}/>)}</div>}
      </section>
      <footer className="app-footer"><span>Campus<span>Connect</span></span><span>Making campus life better, together.</span><span><ShieldCheck size={13}/> Secure workspace</span></footer>
    </main>
  </div>
}

function Stat({icon:Icon,label,value,tone,detail}:{icon:LucideIcon,label:string,value:number,tone:string,detail:string}) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20}/></div><div className="stat-copy"><p>{label}</p><strong>{value}</strong><span>{detail}</span></div><div className={`stat-accent ${tone}`}/></article>
}
function IssueCard({issue,isAdmin,onStatus}:{issue:Issue,isAdmin:boolean,onStatus:(id:string,status:string)=>void}) {
  const statusClass = issue.status.toLowerCase().replace(' ','-')
  const priorityClass = issue.priority.toLowerCase()
  const date = new Date(issue.created_at).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'})
  return <article className="issue-card"><div className="issue-leading"><div className="issue-symbol"><Wrench size={19}/></div></div><div className="issue-info"><div className="issue-title-line"><strong>{issue.title}</strong><span className={`status ${statusClass}`}><i/>{issue.status}</span></div><div className="issue-meta"><span>{issue.category}</span><i/><span><MapPin size={12}/>{issue.location}</span><i/><span><CalendarDays size={12}/>{date}</span></div><p className="description">{issue.description}</p></div><div className="issue-end"><span className={`priority ${priorityClass}`}>{issue.priority} priority</span>{isAdmin ? <label className="status-control"><span>Update status</span><select aria-label={`Update status for ${issue.title}`} value={issue.status} onChange={e => onStatus(issue.id,e.target.value)}>{statuses.map(s => <option key={s}>{s}</option>)}</select></label> : <span className="tracking-label"><Activity size={13}/> Tracking</span>}</div></article>
}
function SetupScreen() {
  return <main className="setup-page"><div className="setup-card"><div className="brand-symbol"><GraduationCap size={24}/></div><span className="section-kicker">ONE-TIME SETUP</span><h1>Connect your database.</h1><p>Your Supabase project credentials are not configured. Add your project URL and anon/public key to a local <code>.env</code> file, then restart the development server.</p><ol><li>Open the Supabase Dashboard and select your project.</li><li>Open Project Settings → API and copy the Project URL and anon key.</li><li>Add them to <code>.env</code> in the project root.</li><li>Restart the development server.</li></ol><p className="setup-security"><ShieldCheck size={15}/> Never put your Supabase service-role key in frontend code.</p></div></main>
}
