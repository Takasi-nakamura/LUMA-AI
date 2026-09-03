import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Download, FileText, Menu, MoreHorizontal, Paperclip, Plus, Search, Send, Settings, Sparkles, Trash2, X, Pencil, RefreshCw, Globe, UserRound } from 'lucide-react';
import { MODELS, DEFAULT_SETTINGS, uid } from './config.js';
import { askOpenRouter, extractText, getApiKey, loadSettings, saveSettings, setApiKey } from './openrouter.js';
import { auth, db, firebaseConfigured } from './firebase.js';
import { createUserWithEmailAndPassword, deleteUser, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';

const STORAGE = 'luma.chats';
const readChats = () => { try { return JSON.parse(localStorage.getItem(STORAGE) || '[]'); } catch { return []; } };
const writeChats = (c) => localStorage.setItem(STORAGE, JSON.stringify(c));

function AttachmentCard({ item, onRemove }) {
  return <div className="attachment-card" onClick={() => item.dataUrl && window.open(item.dataUrl, '_blank', 'noopener,noreferrer')}>
    <div className="file-icon">{item.kind === 'image' ? <img src={item.dataUrl} alt="" /> : <FileText size={20}/>}</div>
    <div className="file-meta"><strong>{item.name}</strong><span>{item.type || 'file'}</span></div>
    {onRemove && <button className="icon-btn" onClick={(e) => { e.stopPropagation(); onRemove(); }}><X size={15}/></button>}
  </div>;
}

function CodeBlock({ children, className }) {
  const code = String(children).replace(/\n$/, '');
  const lang = className?.replace('language-', '') || '';
  const [preview, setPreview] = useState(false);
  const copy = () => navigator.clipboard?.writeText(code);
  const download = () => { const ext = lang === 'html' ? 'html' : lang === 'svg' ? 'svg' : lang === 'javascript' || lang === 'js' ? 'js' : lang === 'css' ? 'css' : 'txt'; const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([code], {type:'text/plain'})); a.download = `luma-code.${ext}`; a.click(); URL.revokeObjectURL(a.href); };
  return <div className="code-wrap"><div className="code-tools"><span>{lang || 'code'}</span><div><button onClick={copy}><Copy size={14}/>コピー</button><button onClick={download}><Download size={14}/>保存</button>{(lang==='html'||lang==='svg')&&<button onClick={()=>setPreview(!preview)}>プレビュー</button>}</div></div>{preview ? <iframe className="code-preview" title="preview" srcDoc={lang==='html' ? code : `<div>${code}</div>`}/> : <pre><code>{code}</code></pre>}</div>;
}

function Message({ message, onEdit, onRegenerate }) {
  const copy = () => navigator.clipboard?.writeText(message.content || '');
  return <div className={`message-row ${message.role}`}>
    <div className="message-bubble">
      {message.attachments?.map(a => <AttachmentCard key={a.id} item={a} />)}
      {message.role === 'assistant' ? <ReactMarkdown remarkPlugins={[remarkGfm]} components={{code: CodeBlock}}>{message.content}</ReactMarkdown> : <div className="plain-text">{message.content}</div>}
    </div>
    <div className="message-actions">
      <button onClick={copy} title="コピー"><Copy size={14}/></button>
      {message.role === 'user' ? <button onClick={()=>onEdit(message)} title="編集"><Pencil size={14}/></button> : <button onClick={()=>onRegenerate(message)} title="この地点から再生成"><RefreshCw size={14}/></button>}
    </div>
  </div>;
}

function SettingsPanel({ settings, setSettings, close, user, setUser, onApiSave }) {
  const [tab, setTab] = useState('account');
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [api, setApi] = useState(getApiKey()); const [notice, setNotice] = useState('');
  const update = (patch) => { const next={...settings,...patch}; setSettings(next); saveSettings(next); };
  const authAction = async (mode) => { setNotice(''); try { if (!auth) throw new Error('Firebaseが未設定です。'); if(mode==='login') await signInWithEmailAndPassword(auth,email,password); else { const c=await createUserWithEmailAndPassword(auth,email,password); await updateProfile(c.user,{displayName:settings.displayName}); } setNotice('完了しました。'); } catch(e) { setNotice(e.message); } };
  const logout = async()=>{ if(auth) await signOut(auth); setUser(null); };
  const removeAccount = async()=>{ if(!auth?.currentUser || !confirm('アカウントを完全に削除しますか？')) return; try { await deleteUser(auth.currentUser); setUser(null); setNotice('アカウントを削除しました。'); } catch(e){setNotice(e.message);} };
  return <div className="settings-overlay"><div className="settings-panel"><header><h2>設定</h2><button className="icon-btn" onClick={close}><X/></button></header><div className="settings-tabs">{[['account','アカウント'],['api','API'],['personal','パーソナルインテリジェンス'],['design','デザイン']].map(([id,label])=><button className={tab===id?'active':''} onClick={()=>setTab(id)} key={id}>{label}</button>)}</div><main>
    {tab==='account'&&<section><h3>アカウント</h3>{firebaseConfigured ? <>{user ? <><div className="account-card"><UserRound/><div><b>{user.displayName || 'Luma User'}</b><span>{user.email}</span></div></div><label>アカウント名<input value={settings.displayName} onChange={e=>update({displayName:e.target.value})}/></label><div className="row"><button className="secondary" onClick={logout}>ログアウト</button><button className="danger" onClick={removeAccount}>アカウント削除</button></div></> : <><label>メールアドレス<input type="email" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>パスワード<input type="password" value={password} onChange={e=>setPassword(e.target.value)}/></label><div className="row"><button onClick={()=>authAction('login')}>ログイン</button><button className="secondary" onClick={()=>authAction('signup')}>アカウント作成</button></div></>} </> : <p className="muted">Firebaseの環境変数を設定するとアカウント機能が有効になります。個人使用なら未設定でもローカルモードで利用できます。</p>}{notice&&<p className="notice">{notice}</p>}</section>}
    {tab==='api'&&<section><h3>OpenRouter API</h3><p className="muted">APIキーはこのブラウザのローカルストレージに保存されます。GitHubへキーは保存しません。</p><label>OpenRouter APIキー<input type="password" value={api} onChange={e=>setApi(e.target.value)} placeholder="sk-or-..."/></label><button onClick={()=>{setApiKey(api.trim());onApiSave();setNotice('APIキーを保存しました。')}}>保存</button><div className="model-list"><h4>利用モデル</h4>{MODELS.map(m=><div className="model-item" key={m.id}><div><b>{m.name}</b><span>{m.hint}</span></div><code>{m.id}</code></div>)}</div></section>}
    {tab==='personal'&&<section><h3>パーソナルインテリジェンス</h3><label>なんとAIに呼ばれますか？<input value={settings.displayName} onChange={e=>update({displayName:e.target.value})} /></label><label>カスタム指示<textarea rows="7" value={settings.customInstructions} onChange={e=>update({customInstructions:e.target.value})} placeholder="回答の好み、あなたについて知っておいてほしいことなど"/></label></section>}
    {tab==='design'&&<section><h3>デザイン</h3><label>アクセントカラー<input type="color" value={settings.accent} onChange={e=>update({accent:e.target.value})}/></label><label>テーマ<select value={settings.theme} onChange={e=>update({theme:e.target.value})}><option value="system">システム</option><option value="light">ライト</option><option value="dark">ダーク</option></select></label><label>フォント<select value={settings.font} onChange={e=>update({font:e.target.value})}><option value="system">システム</option><option value="sans">Sans</option><option value="serif">Serif</option></select></label></section>}
  </main></div></div>;
}

export default function App(){
  const [settings,setSettings]=useState(()=>loadSettings(DEFAULT_SETTINGS));
  const [chats,setChats]=useState(readChats); const [activeId,setActiveId]=useState(null); const [sidebar,setSidebar]=useState(true); const [settingsOpen,setSettingsOpen]=useState(false); const [input,setInput]=useState(''); const [attachments,setAttachments]=useState([]); const [loading,setLoading]=useState(false); const [user,setUser]=useState(null); const [editing,setEditing]=useState(null); const fileRef=useRef(); const textareaRef=useRef();
  const active=chats.find(c=>c.id===activeId) || null;
  const currentModel=MODELS.find(m=>m.id===settings.model)||MODELS[0];
  useEffect(()=>{document.documentElement.dataset.theme=settings.theme;document.documentElement.style.setProperty('--accent',settings.accent);},[settings]);
  useEffect(()=>{ if(auth) return onAuthStateChanged(auth,setUser); },[]);
  useEffect(()=>writeChats(chats),[chats]);
  const createChat=()=>{const c={id:uid('chat'),title:'新しいチャット',messages:[],createdAt:Date.now(),updatedAt:Date.now()};setChats(p=>[c,...p]);setActiveId(c.id);setSidebar(window.innerWidth>760);};
  const updateChat=(id,patch)=>setChats(p=>p.map(c=>c.id===id?{...c,...patch,updatedAt:Date.now()}:c));
  const rename=(c)=>{const name=prompt('チャット名',c.title);if(name?.trim())updateChat(c.id,{title:name.trim()});};
  const remove=(c)=>{if(confirm(`「${c.title}」を削除しますか？`)){setChats(p=>p.filter(x=>x.id!==c.id));if(activeId===c.id)setActiveId(null);}};
  const generateTitle=async(text)=>{ if(!getApiKey()) return text.slice(0,28)+(text.length>28?'…':''); try{const r=await askOpenRouter({messages:[{role:'user',content:`次の入力から日本語の短いチャットタイトルを1つだけ作ってください。15文字以内。\n${text}`}],model:settings.model,settings:{...settings,webSearch:false}});return extractText(r).replace(/[「」\n]/g,'').slice(0,30)||text.slice(0,28);}catch{return text.slice(0,28)+(text.length>28?'…':'');}};
  const readFile=async(file)=>{const dataUrl=file.type.startsWith('image/')?await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file);}):null; return {id:uid('file'),name:file.name,type:file.type,kind:file.type.startsWith('image/')?'image':'file',dataUrl};};
  const handleFiles=async(files)=>{const next=[];for(const f of files){if(f.type.startsWith('image/')||f.type==='application/pdf'||f.type.startsWith('text/')) next.push(await readFile(f));}setAttachments(p=>[...p,...next]);};
  const send=async(customText=null, historyOverride=null)=>{const text=(customText ?? input).trim();if(!text && !attachments.length)return;if(loading)return;let c=active;if(!c){const nc={id:uid('chat'),title:'新しいチャット',messages:[],createdAt:Date.now(),updatedAt:Date.now()};setChats(p=>[nc,...p]);setActiveId(nc.id);c=nc;}
    const userMsg={id:uid('msg'),role:'user',content:text,attachments}; const history=historyOverride || [...c.messages,userMsg]; updateChat(c.id,{messages:history});setInput('');setAttachments([]);setLoading(true);
    try{const apiMessages=history.map(m=>({role:m.role,content:m.content}));const r=await askOpenRouter({messages:apiMessages,model:settings.model,settings,attachments:userMsg.attachments});const answer={id:uid('msg'),role:'assistant',content:extractText(r),model:settings.model,sources:r?.choices?.[0]?.message?.annotations||[]};updateChat(c.id,{messages:[...history,answer],title:c.messages.length===0?await generateTitle(text):c.title});}
    catch(e){updateChat(c.id,{messages:[...history,{id:uid('msg'),role:'assistant',content:`⚠️ ${e.message}`} ]});}
    finally{setLoading(false);}
  };
  const regenerate=async(msg)=>{if(!active||loading)return;const idx=active.messages.findIndex(m=>m.id===msg.id);if(idx<0)return;const prior=active.messages.slice(0,idx);const lastUser=[...prior].reverse().find(m=>m.role==='user');if(!lastUser)return;updateChat(active.id,{messages:prior});setLoading(true);try{const r=await askOpenRouter({messages:prior.map(m=>({role:m.role,content:m.content})),model:msg.model||settings.model,settings,attachments:lastUser.attachments||[]});updateChat(active.id,{messages:[...prior,{id:uid('msg'),role:'assistant',content:extractText(r),model:msg.model||settings.model}]});}catch(e){updateChat(active.id,{messages:[...prior,{id:uid('msg'),role:'assistant',content:`⚠️ ${e.message}`}]});}finally{setLoading(false);}};
  const editMessage=(msg)=>{setEditing(msg);setInput(msg.content);setTimeout(()=>textareaRef.current?.focus(),0);};
  const submitEdit=async()=>{if(!editing||!active)return;const idx=active.messages.findIndex(m=>m.id===editing.id);const prior=active.messages.slice(0,idx);setEditing(null);await send(input,prior);};
  const onSubmit=(e)=>{e.preventDefault();editing?submitEdit():send();};
  const sorted=useMemo(()=>[...chats].sort((a,b)=>b.updatedAt-a.updatedAt),[chats]);
  return <div className="app-shell">
    <aside className={`sidebar ${sidebar?'open':''}`}><div className="brand"><div className="logo">L</div><b>Luma</b><button className="icon-btn mobile-close" onClick={()=>setSidebar(false)}><X/></button></div><button className="new-chat" onClick={createChat}><Plus size={18}/>新規チャット</button><div className="chat-list"><div className="list-label">チャット</div>{sorted.map(c=><div className={`chat-item ${c.id===activeId?'active':''}`} key={c.id} onClick={()=>{setActiveId(c.id);if(window.innerWidth<760)setSidebar(false)}}><span>{c.title}</span><div className="chat-more"><button className="icon-btn" onClick={e=>{e.stopPropagation();rename(c)}}><Pencil size={14}/></button><button className="icon-btn" onClick={e=>{e.stopPropagation();remove(c)}}><Trash2 size={14}/></button></div></div>)}</div><button className="account-box" onClick={()=>setSettingsOpen(true)}><div className="avatar">{(user?.displayName||settings.displayName||'L')[0].toUpperCase()}</div><div><b>{user?.displayName||settings.displayName||'Luma'}</b><span>設定</span></div><Settings size={17}/></button></aside>
    {sidebar&&window.innerWidth<760&&<div className="scrim" onClick={()=>setSidebar(false)}/>}<main className="main"><header className="topbar"><button className="icon-btn" onClick={()=>setSidebar(!sidebar)}><Menu/></button><div className="top-model"><Sparkles size={15}/>{currentModel.name}</div><button className="icon-btn" onClick={()=>setSettingsOpen(true)}><Settings/></button></header>
      {!active ? <div className="welcome"><div className="welcome-icon"><Sparkles/></div><h1>何をしましょうか？</h1><p>Lumaは、複数のAIモデルを自由に切り替えて使えるAIワークスペースです。</p><button onClick={createChat}>新しいチャットを始める</button></div> : <div className="chat-view"><div className="messages">{active.messages.map(m=><Message key={m.id} message={m} onEdit={editMessage} onRegenerate={regenerate}/>)}{loading&&<div className="typing"><span></span><span></span><span></span></div>}</div></div>}
      <div className="composer-area"><form className="composer" onSubmit={onSubmit}>{attachments.length>0&&<div className="attachment-strip">{attachments.map(a=><AttachmentCard key={a.id} item={a} onRemove={()=>setAttachments(p=>p.filter(x=>x.id!==a.id))}/>)}</div>}<textarea ref={textareaRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();onSubmit(e)}}} placeholder={editing?'メッセージを編集…':'Lumaにメッセージを送信…'} rows="1"/><div className="composer-bottom"><input ref={fileRef} type="file" hidden multiple accept="image/*,application/pdf,text/*" onChange={e=>handleFiles([...e.target.files])}/><button type="button" className="icon-btn" onClick={()=>fileRef.current?.click()} title="ファイル添付"><Paperclip/></button><div className="composer-spacer"/><label className="search-toggle"><input type="checkbox" checked={settings.webSearch} onChange={e=>{const next={...settings,webSearch:e.target.checked};setSettings(next);saveSettings(next)}}/><Globe size={15}/>Web検索</label><select value={settings.model} onChange={e=>{const next={...settings,model:e.target.value};setSettings(next);saveSettings(next)}}>{MODELS.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select><button className="send-btn" disabled={loading||(!input.trim()&&!attachments.length)}>{editing?<Pencil size={17}/>:<Send size={17}/>}</button></div></form><div className="composer-note">LumaはAIの回答を誤ることがあります。重要な情報は確認してください。</div></div>
    </main>{settingsOpen&&<SettingsPanel settings={settings} setSettings={setSettings} close={()=>setSettingsOpen(false)} user={user} setUser={setUser} onApiSave={()=>setSettingsOpen(false)}/>}</div>;
}
