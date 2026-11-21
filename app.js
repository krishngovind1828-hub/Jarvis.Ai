'use strict';
const $=id=>document.getElementById(id);
const state={recognition:null,listening:false,busy:false,voices:[]};
const log=$('chatLog');
$('workerUrl').value=localStorage.getItem('jarvis-worker-url')||'';
function status(s){$('systemStatus').textContent=s}
function add(who,text){const el=document.createElement('article');el.className='msg '+who;const name=document.createElement('span');name.textContent=who==='user'?'YOU':'J.A.R.V.I.S.';if(who==='jarvis'){const tag=document.createElement('i');tag.textContent=' • ONLINE';name.append(tag)}const p=document.createElement('p');p.textContent=text;el.append(name,p);log.append(el);log.scrollTop=log.scrollHeight}
function chooseVoice(){
 const lang=$('language').value==='hi'?'hi':'en';
 const voices=state.voices;
 const candidates=voices.filter(v=>v.lang.toLowerCase().startsWith(lang));
 const maleHints=/male|man|david|mark|daniel|george|james|aaron|ravi|hemant|madhur/i;
 const preferred=candidates.find(v=>maleHints.test(v.name))||candidates.find(v=>/en-in|hi-in/i.test(v.lang))||candidates[0]||voices.find(v=>v.lang.toLowerCase().startsWith('en'))||voices[0];
 return $('voiceSelect').value==='auto'?preferred:voices.find(v=>v.name===$('voiceSelect').value)||preferred;
}
function refreshVoices(){
 if(!('speechSynthesis'in window))return;
 state.voices=speechSynthesis.getVoices();const select=$('voiceSelect');const current=select.value;
 select.innerHTML='<option value="auto">Best available male-style voice</option>';
 const lang=$('language').value==='hi'?'hi':'en';
 state.voices.filter(v=>v.lang.toLowerCase().startsWith(lang)).forEach(v=>{const o=document.createElement('option');o.value=v.name;o.textContent=v.name+' — '+v.lang;select.append(o)});
 if([...select.options].some(o=>o.value===current))select.value=current;
 const voice=chooseVoice();$('voiceNote').textContent=voice?`Selected device voice: ${voice.name} (${voice.lang}). Voice quality is provided by your device/browser.`:'No speech voice is currently available. Install or enable a voice in your device settings.';
}
function speak(text){
 if(!$('speakReplies').checked||!window.speechSynthesis)return;
 speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);const v=chooseVoice();
 if(v)u.voice=v;u.lang=$('language').value==='hi'?'hi-IN':'en-IN';
 // A restrained pace and near-natural pitch; available voices determine realism.
 u.rate=.96;u.pitch=.88;u.volume=1;speechSynthesis.speak(u);
}
function localAnswer(text){const q=text.toLowerCase();if(/^(hi|hello|hey|नमस्ते|हेलो)\b/.test(q))return $('language').value==='hi'?'नमस्ते। मैं आपकी सहायता के लिए तैयार हूँ।':'Good day. I am at your service.';if(q.includes('time'))return 'The local time is '+new Date().toLocaleTimeString()+'.';if(q.includes('date'))return 'Today is '+new Date().toLocaleDateString()+'.';return null}
async function ask(text){
 const message=text.trim();if(!message||state.busy)return;add('user',message);$('messageInput').value='';
 const local=localAnswer(message);if(local){add('jarvis',local);speak(local);return}
 const url=$('workerUrl').value.trim().replace(/\/+$/,'');
 if(!url){const reply='My AI connection is not configured. Please connect the Neural Link endpoint.';add('jarvis',reply);speak(reply);return}
 state.busy=true;status('THINKING');
 try{const r=await fetch(url+'/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,language:$('language').value})});const data=await r.json();if(!r.ok)throw new Error(data.error||'AI service error '+r.status);const reply=data.reply||'I could not form a response.';add('jarvis',reply);speak(reply)}
 catch(e){const reply='I cannot reach the AI service right now. Check the Worker URL and deployment. '+e.message;add('jarvis',reply)}
 finally{state.busy=false;status('SYSTEM READY')}
}
function stop(){if(state.recognition){try{state.recognition.stop()}catch(e){}}state.listening=false;$('voiceStatus').textContent='STANDBY';$('reactorButton').classList.remove('active')}
function listen(){const API=window.SpeechRecognition||window.webkitSpeechRecognition;if(!API){add('jarvis','Speech recognition is unavailable in this browser. Try Chrome on Android and allow microphone access.');return}if(state.listening){stop();return}
 const rec=new API();state.recognition=rec;rec.lang=$('language').value==='hi'?'hi-IN':'en-IN';rec.continuous=false;rec.interimResults=true;let finalText='';
 rec.onstart=()=>{state.listening=true;$('voiceStatus').textContent='LISTENING';$('reactorButton').classList.add('active');status('VOICE LINK ACTIVE')};
 rec.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++){if(e.results[i].isFinal)finalText+=e.results[i][0].transcript}};
 rec.onerror=e=>{if(e.error!=='no-speech')add('jarvis','Microphone issue: '+e.error)};
 rec.onend=()=>{state.listening=false;$('voiceStatus').textContent='STANDBY';$('reactorButton').classList.remove('active');status('SYSTEM READY');if(finalText.trim())ask(finalText)};
 try{rec.start()}catch(e){add('jarvis','Could not start microphone. Check browser permission.')}
}
$('chatForm').addEventListener('submit',e=>{e.preventDefault();ask($('messageInput').value)});
$('reactorButton').addEventListener('click',listen);
$('clearChat').addEventListener('click',()=>log.replaceChildren());
$('saveWorker').addEventListener('click',()=>{const url=$('workerUrl').value.trim().replace(/\/+$/,'');$('workerUrl').value=url;localStorage.setItem('jarvis-worker-url',url);add('jarvis',url?'Neural link saved on this device.':'Neural link cleared.')});
$('language').addEventListener('change',refreshVoices);
$('testVoice').addEventListener('click',()=>speak($('language').value==='hi'?'नमस्ते। मैं जार्विस हूँ। आपकी सेवा में।':'Good evening. JARVIS is online and ready to assist you.'));
if(window.speechSynthesis){refreshVoices();speechSynthesis.onvoiceschanged=refreshVoices}
function tick(){$('clock').textContent=new Date().toLocaleTimeString([],{hour12:false})}tick();setInterval(tick,1000);
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
