import { useState, useEffect, useMemo, useCallback } from "react";

/* ═══════════════════════ ROLES & AUTH ═══════════════════════ */
const ROLES = {
  admin:{label:"Admin",color:"#A78BFA",access:["dashboard","commercial","consultoria","mentoring","production","tasks","admin","notifications"],desc:"Acesso total ao CRM"},
  sdr:{label:"SDR",color:"#60A5FA",access:["dashboard","commercial","tasks","notifications"],desc:"Pipeline comercial — vê apenas seus leads"},
};

const INIT_USERS = [
  {id:"u1",name:"Gabriela",email:"gabrielasuanad@gmail.com",password:"22832329Gabi@",role:"admin",avatar:"G",active:true,approved:true,createdAt:"2025-01-01"},
  {id:"u0",name:"Maria Rita",email:"mariaritaalves45@gmail.com",password:"admin2025@",role:"admin",avatar:"M",active:true,approved:true,createdAt:"2025-01-01"},
  {id:"u2",name:"Sarah",email:"sarah@gs.com",password:"gs2025",role:"sdr",avatar:"S",active:true,approved:true,createdAt:"2025-01-15"},
  {id:"u3",name:"Ana",email:"ana@gs.com",password:"gs2025",role:"sdr",avatar:"A",active:true,approved:true,createdAt:"2025-02-01"},
  {id:"u4",name:"Lucas",email:"lucas@gs.com",password:"gs2025",role:"sdr",avatar:"L",active:true,approved:true,createdAt:"2025-02-10"},
  {id:"u5",name:"Marina",email:"marina@gs.com",password:"gs2025",role:"sdr",avatar:"M",active:true,approved:true,createdAt:"2025-03-01"},
];

/* ═══════════════════════ CONSULTORIA PIPELINE ═══════════════════════ */
const CONSULT_STAGES = [
  "Clientes","Análise Inicial","Visagismo","Biótipo / Tipologia Física",
  "Análise de Estilo","Apresentação Estratégica","Apresentação do Dossiê Estratégico",
  "Apresentação de Guia de Medidas","Análise de Guarda-Roupa (Online)",
  "Análise de Guarda-Roupa (Presencial)","Análise de Peças por Foto",
  "Personal Shopping","Curadoria de Peças","Etiqueta e Comportamento",
  "Análise Olfativa","Montagem de Looks","Sessão de Fotos","Finalizados"
];
const CONSULT_CHECKLISTS = {
  "Clientes":["Contrato assinado","Dados cadastrados","Plano definido"],
  "Análise Inicial":["Questionário preenchido","Fotos recebidas","Análise realizada","Relatório enviado"],
  "Visagismo":["Análise facial realizada","Recomendações definidas","Apresentação ao cliente"],
  "Biótipo / Tipologia Física":["Análise de biótipo","Tipologia definida","Orientações entregues"],
  "Análise de Estilo":["Estilo identificado","Paleta de cores","Referências montadas"],
  "Apresentação Estratégica":["Dossiê preparado","Apresentação realizada","Feedback do cliente"],
  "Apresentação do Dossiê Estratégico":["Dossiê finalizado","Entrega ao cliente","Aprovação recebida"],
  "Apresentação de Guia de Medidas":["Medidas coletadas","Guia montado","Apresentação feita"],
  "Análise de Guarda-Roupa (Online)":["Fotos recebidas","Análise realizada","Relatório enviado"],
  "Análise de Guarda-Roupa (Presencial)":["Visita agendada","Análise presencial","Relatório entregue"],
  "Análise de Peças por Foto":["Fotos recebidas","Peças analisadas","Feedback enviado"],
  "Personal Shopping":["Lista de compras","Shopping realizado","Peças aprovadas"],
  "Curadoria de Peças":["Seleção de peças","Combinações montadas","Entrega ao cliente"],
  "Etiqueta e Comportamento":["Conteúdo preparado","Sessão realizada","Material entregue"],
  "Análise Olfativa":["Perfil olfativo","Recomendações","Apresentação feita"],
  "Montagem de Looks":["Looks montados","Fotos dos looks","Guia entregue"],
  "Sessão de Fotos":["Sessão agendada","Fotos realizadas","Fotos entregues"],
  "Finalizados":["Relatório final","Feedback coletado","Depoimento solicitado"],
};
const PLANS = ["Essencial","Premium","VIP","Personalizado"];

/* ═══════════════════════ COMMERCIAL PIPELINE (UPDATED) ═══════════════════════ */
const COMMERCIAL_STAGES = ["Lead","Em contato","Reunião agendada","Negociação","Contrato","Pagamento","Fechado","Perdido"];
const LEAD_ORIGINS = ["Instagram","LinkedIn","Indicação","Google","Evento","Outro"];

/* ═══════════════════════ OTHER CONSTANTS ═══════════════════════ */
const MAX_CRIT = 3;
const CLIENT_TYPES = ["Empresário","Médico","Consultora","Visagista","Outro"];
const DELIVERY_TYPES = ["Vídeo","Arte","Site","Texto","Outro"];
const MENTORING_STAGES = ["Onboarding","Diagnóstico & Base","Posicionamento","Estratégia","Estrutura Digital","Comercial","Tráfego & Leads","Escala & Otimização","Finalização"];
const MENTORING_CL = {
  "Onboarding":["Contrato assinado","Acesso entregue","Reunião boas-vindas","Materiais enviados"],
  "Diagnóstico & Base":["Questionário preenchido","Análise posicionamento","Relatório diagnóstico","Feedback cliente"],
  "Posicionamento":["Público-alvo definido","Tom de voz","Identidade visual","Proposta de valor"],
  "Estratégia":["Plano de ação","Metas definidas","Cronograma aprovado","KPIs"],
  "Estrutura Digital":["Perfis otimizados","Bio e destaques","Template conteúdo","Calendário editorial"],
  "Comercial":["Script vendas","Funil conversão","Precificação","Follow-up"],
  "Tráfego & Leads":["Campanha configurada","Público definido","Criativos aprovados","Pixel instalado"],
  "Escala & Otimização":["Métricas analisadas","Otimizações","Processo documentado","Equipe treinada"],
  "Finalização":["Relatório final","Reunião encerramento","Depoimento","Plano continuidade"],
};
const PROD_STAGES = ["Solicitação","Em produção","Revisão","Entregue"];
const KANBAN = ["Entrada","Hoje","Em execução","Aguardando","Concluído"];
const TASK_ST = ["Não iniciado","Em andamento","Aguardando","Concluído"];
const PRIOS = ["Crítica","Importante","Baixa"];
const RISKS = ["Verde","Amarelo","Vermelho"];

let _id=200;const uid=()=>`id_${++_id}`;
const td=()=>new Date().toISOString().slice(0,10);
const ad=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x.toISOString().slice(0,10);};
const ov=(d)=>d&&d<td();
const fmt=(v)=>v?`R$ ${Number(v).toLocaleString("pt-BR",{minimumFractionDigits:2})}`:"—";

/* ═══════════════════════ SEED ═══════════════════════ */
const sLeads=()=>[
  {id:uid(),name:"Dr. Ricardo Almeida",origin:"Instagram",sdr:"Sarah",stage:"Reunião agendada",notes:"Cirurgião plástico",value:4500,createdAt:"2025-04-10",lastInteraction:"2025-04-22",history:["10/04 — Lead captado via Instagram","15/04 — Primeiro contato por DM","22/04 — Reunião agendada para 28/04"]},
  {id:uid(),name:"Carla Mendes",origin:"Indicação",sdr:"Ana",stage:"Em contato",notes:"Quer escalar consultoria",value:3200,createdAt:"2025-04-18",lastInteraction:"2025-04-20",history:["18/04 — Indicação recebida","20/04 — Mensagem enviada"]},
  {id:uid(),name:"Patricia Souza",origin:"Google",sdr:"Sarah",stage:"Negociação",notes:"10 anos exp.",value:6800,createdAt:"2025-04-05",lastInteraction:"2025-04-25",history:["05/04 — Lead via Google","10/04 — Reunião realizada","25/04 — Proposta enviada, em negociação"]},
];

const sConsult=()=>[
  {id:uid(),name:"PEDRO EUSTÁQUIO",plan:"Premium",stage:1,stageChecklist:{0:[true,true,true],1:[false,false,false,false]},responsible:"Ana",startDate:"2025-03-15"},
  {id:uid(),name:"JACKSON FELIPE CAISS",plan:"VIP",stage:2,stageChecklist:{0:[true,true,true],1:[true,true,true,true],2:[true,false,false]},responsible:"Ana",startDate:"2025-02-20"},
  {id:uid(),name:"JARDIR SARAIVA SALES",plan:"Premium",stage:4,stageChecklist:{0:[true,true,true],1:[true,true,true,true],2:[true,true,true],3:[true,true,true],4:[false,false,false]},responsible:"Gabriela",startDate:"2025-01-10"},
  {id:uid(),name:"RODRIGO DE SOUTO",plan:"Essencial",stage:5,stageChecklist:{0:[true,true,true],1:[true,true,true,true],2:[true,true,true],3:[true,true,true],4:[true,true,true],5:[false,false,false]},responsible:"Ana",startDate:"2025-02-23"},
  {id:uid(),name:"BRUNNO PEREIRA",plan:"VIP",stage:16,stageChecklist:{},responsible:"Gabriela",startDate:"2025-03-05"},
  {id:uid(),name:"WELLINGTON",plan:"Premium",stage:16,stageChecklist:{},responsible:"Ana",startDate:"2025-03-16"},
];
const sClients=()=>[
  {id:uid(),name:"Dra. Fernanda Costa",type:"Médico",stage:2,stageChecklist:{0:[true,true,true,true],1:[true,true,true,true],2:[true,false,false,false]},responsible:"Gabriela",startDate:"2025-03-01"},
  {id:uid(),name:"Roberto Dias",type:"Empresário",stage:4,stageChecklist:{0:[true,true,true,true],1:[true,true,true,true],2:[true,true,true,true],3:[true,true,true,true],4:[false,false,false,false]},responsible:"Ana",startDate:"2025-02-10"},
];
const sProd=()=>[
  {id:uid(),type:"Arte",title:"Posts Instagram - Dra. Fernanda",requester:"Gabriela",responsible:"Marina",stage:"Em produção",priority:"Importante",risk:"Verde",deadline:ad(td(),3),briefing:"5 posts feed",createdAt:td()},
  {id:uid(),type:"Vídeo",title:"Reels - Roberto Dias",requester:"Ana",responsible:"Lucas",stage:"Solicitação",priority:"Crítica",risk:"Amarelo",deadline:ad(td(),1),briefing:"3 reels",createdAt:td()},
];
const sTasks=()=>[
  {id:uid(),title:"Ligar para Dr. Ricardo",responsible:"Sarah",priority:"Crítica",status:"Não iniciado",risk:"Verde",deadline:td(),kanban:"Hoje",module:"Comercial"},
  {id:uid(),title:"Enviar proposta Patricia",responsible:"Gabriela",priority:"Crítica",status:"Em andamento",risk:"Amarelo",deadline:ad(td(),1),kanban:"Em execução",module:"Comercial"},
  {id:uid(),title:"Análise Inicial Pedro Eustáquio",responsible:"Ana",priority:"Importante",status:"Não iniciado",risk:"Verde",deadline:ad(td(),3),kanban:"Entrada",module:"Consultoria"},
  {id:uid(),title:"Visagismo Jackson Felipe",responsible:"Ana",priority:"Importante",status:"Em andamento",risk:"Verde",deadline:ad(td(),5),kanban:"Em execução",module:"Consultoria"},
  {id:uid(),title:"Configurar pixel campanha",responsible:"Marina",priority:"Crítica",status:"Em andamento",risk:"Vermelho",deadline:ad(td(),-1),kanban:"Em execução",module:"Produção"},
];

/* ═══════════════════════ ICONS ═══════════════════════ */
const I=({n,s=18,c="currentColor"})=>{const p={
dashboard:<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
commercial:<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
consultoria:<><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></>,
mentoring:<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>,
production:<><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
tasks:<><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
admin:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
alert:<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
check:<><polyline points="20 6 9 17 4 12"/></>,
plus:<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
x:<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
chevron:<><polyline points="9 18 15 12 9 6"/></>,
lock:<><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
eye:<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
eyeOff:<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></>,
logout:<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
user:<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
shield:<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
edit:<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
mail:<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
clock:<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
userPlus:<><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></>,
bell:<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
dollar:<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
};return<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{p[n]}</svg>};

/* ═══════════════════════ CSS ═══════════════════════ */
const CSS=`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Instrument+Serif:ital@0;1&display=swap');
:root{--bg:#0B0E13;--bg2:#12151C;--bg3:#191D26;--bg4:#222732;--bd:#272D3A;--bd2:#333A49;--tx:#E6E9F0;--tx2:#959DAE;--tx3:#636B7E;--ac:#6366F1;--ac2:#818CF8;--acg:rgba(99,102,241,.12);--gn:#34D399;--gnb:rgba(52,211,153,.1);--yl:#FBBF24;--ylb:rgba(251,191,36,.1);--rd:#F87171;--rdb:rgba(248,113,113,.1);--bl:#60A5FA;--blb:rgba(96,165,250,.1);--or:#FB923C;--pk:#F472B6;--pp:#A78BFA;--sf:'Instrument Serif',Georgia,serif;--sn:'DM Sans',-apple-system,sans-serif;--r:10px;--sh:0 8px 32px rgba(0,0,0,.4)}
*{box-sizing:border-box;margin:0;padding:0}body,#root{font-family:var(--sn);background:var(--bg);color:var(--tx);min-height:100vh}
.lp{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);background-image:radial-gradient(ellipse at 30% 20%,rgba(99,102,241,.06) 0%,transparent 50%),radial-gradient(ellipse at 70% 80%,rgba(52,211,153,.04) 0%,transparent 50%)}
.lc{width:420px;max-width:94vw;background:var(--bg2);border:1px solid var(--bd);border-radius:16px;padding:36px 32px;box-shadow:var(--sh);animation:li .5s cubic-bezier(.16,1,.3,1)}
@keyframes li{from{opacity:0;transform:translateY(24px) scale(.97)}to{opacity:1;transform:none}}
.lb{text-align:center;margin-bottom:28px}.lb h1{font-family:var(--sf);font-size:26px;font-weight:400;line-height:1.2;margin-bottom:4px}.lb .su{font-size:11px;color:var(--tx3);text-transform:uppercase;letter-spacing:2px}.lb .ln{width:40px;height:2px;background:var(--ac);margin:10px auto 0;border-radius:1px}
.le{background:var(--rdb);color:var(--rd);border:1px solid rgba(248,113,113,.15);padding:9px 12px;border-radius:8px;font-size:13px;margin-bottom:14px;display:flex;align-items:center;gap:8px;animation:sk .4s}
.ls{background:var(--gnb);color:var(--gn);border:1px solid rgba(52,211,153,.15);padding:9px 12px;border-radius:8px;font-size:13px;margin-bottom:14px;display:flex;align-items:center;gap:8px}
@keyframes sk{10%,90%{transform:translateX(-2px)}20%,80%{transform:translateX(4px)}30%,50%,70%{transform:translateX(-6px)}40%,60%{transform:translateX(6px)}}
.liw{position:relative;margin-bottom:16px}.liw label{font-size:12px;color:var(--tx2);display:block;margin-bottom:5px;font-weight:500}.liw input,.liw select{width:100%;padding:11px 14px 11px 40px;background:var(--bg3);border:1px solid var(--bd);border-radius:10px;color:var(--tx);font-size:14px;font-family:var(--sn);outline:none;transition:border-color .2s,box-shadow .2s}.liw input:focus,.liw select:focus{border-color:var(--ac);box-shadow:0 0 0 3px var(--acg)}.liw .ii{position:absolute;left:13px;bottom:12px;color:var(--tx3)}.liw .tp{position:absolute;right:11px;bottom:10px;background:none;border:none;color:var(--tx3);cursor:pointer;padding:2px}.liw select{padding-left:14px}
.lbt{width:100%;padding:12px;border:none;border-radius:10px;background:var(--ac);color:#fff;font-size:15px;font-weight:600;font-family:var(--sn);cursor:pointer;transition:all .2s;margin-top:4px}.lbt:hover{background:var(--ac2);transform:translateY(-1px);box-shadow:0 4px 20px rgba(99,102,241,.3)}.lbt:active{transform:translateY(0)}.lbt:disabled{opacity:.5;cursor:default;transform:none;box-shadow:none}
.lft{text-align:center;margin-top:16px;font-size:12px;color:var(--tx3)}.lft a{color:var(--ac2);cursor:pointer;text-decoration:underline}
.app{display:flex;min-height:100vh}
.sb{width:240px;min-width:240px;background:var(--bg2);border-right:1px solid var(--bd);display:flex;flex-direction:column;position:sticky;top:0;height:100vh;z-index:10;overflow-y:auto}
.sb-b{padding:20px 16px 14px;border-bottom:1px solid var(--bd)}.sb-b h1{font-family:var(--sf);font-size:19px;font-weight:400;line-height:1.2}.sb-b span{font-size:9px;color:var(--tx3);text-transform:uppercase;letter-spacing:1.5px;display:block;margin-top:3px}
.sb-u{padding:12px 14px;border-bottom:1px solid var(--bd);display:flex;align-items:center;gap:9px}
.sb-u .av{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:#fff;flex-shrink:0}
.sb-u .ui{flex:1;min-width:0}.sb-u .un{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sb-u .ur{font-size:10px;display:inline-flex;padding:1px 6px;border-radius:4px;font-weight:600}
.sb-n{flex:1;padding:8px;display:flex;flex-direction:column;gap:1px}
.sb-n button{display:flex;align-items:center;gap:10px;padding:9px 12px;border:none;background:transparent;color:var(--tx2);font-size:13px;font-family:var(--sn);cursor:pointer;border-radius:7px;transition:all .15s;text-align:left;width:100%;font-weight:400}
.sb-n button:hover{background:var(--bg3);color:var(--tx)}.sb-n button.act{background:var(--acg);color:var(--ac2);font-weight:500}
.sb-n button .bdg{margin-left:auto;background:var(--rd);color:#fff;font-size:9px;padding:1px 6px;border-radius:10px;font-weight:700}
.sb-n button.dis{opacity:.25;pointer-events:none}.sb-n .ns{font-size:9px;color:var(--tx3);text-transform:uppercase;letter-spacing:1.2px;padding:12px 12px 3px}
.sb-f{padding:10px 14px;border-top:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between}
.sb-f button{display:flex;align-items:center;gap:5px;padding:5px 9px;border:none;background:transparent;color:var(--tx3);font-size:11px;font-family:var(--sn);cursor:pointer;border-radius:6px;transition:all .15s}
.sb-f button:hover{color:var(--rd);background:var(--rdb)}
.mn{flex:1;min-width:0}.mh{padding:16px 24px;border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;background:var(--bg);position:sticky;top:0;z-index:5}
.mh h2{font-family:var(--sf);font-size:22px;font-weight:400;letter-spacing:-.5px}.mc{padding:20px 24px}
.cd{background:var(--bg2);border:1px solid var(--bd);border-radius:var(--r);padding:16px}
.sg{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:10px;margin-bottom:20px}
.sc{background:var(--bg2);border:1px solid var(--bd);border-radius:var(--r);padding:14px 16px}.sc .sl{font-size:10px;color:var(--tx3);text-transform:uppercase;letter-spacing:.8px}.sc .sv{font-family:var(--sf);font-size:28px;font-weight:400;letter-spacing:-1px;margin-top:3px}
.pl{display:flex;gap:7px;overflow-x:auto;padding-bottom:8px}.pc{min-width:200px;max-width:240px;flex-shrink:0;background:var(--bg2);border:1px solid var(--bd);border-radius:var(--r)}.pch{padding:9px 11px;border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;font-size:11px;font-weight:600;color:var(--tx2);text-transform:uppercase;letter-spacing:.4px}.pch .ct{background:var(--bg4);padding:2px 6px;border-radius:10px;font-size:10px}.pcb{padding:5px;display:flex;flex-direction:column;gap:4px;min-height:40px}
.pch .val{font-size:10px;color:var(--gn);font-weight:700;margin-left:auto;margin-right:6px}
.lcard{background:var(--bg3);border:1px solid var(--bd2);border-radius:7px;padding:8px 10px;cursor:pointer;transition:all .15s;font-size:12px}.lcard:hover{border-color:var(--ac);transform:translateY(-1px)}.lcard .ln{font-weight:600;margin-bottom:2px;font-size:12px}.lcard .lm{font-size:10px;color:var(--tx3);display:flex;gap:5px;flex-wrap:wrap}.lcard .lm .tag{background:var(--bg4);padding:1px 5px;border-radius:3px}
.kb{display:flex;gap:7px;overflow-x:auto;padding-bottom:8px}.kc{min-width:210px;flex:1;background:var(--bg2);border:1px solid var(--bd);border-radius:var(--r)}.kch{padding:9px 11px;border-bottom:1px solid var(--bd);font-size:11px;font-weight:600;color:var(--tx2);text-transform:uppercase;letter-spacing:.4px;display:flex;align-items:center;justify-content:space-between}.kcb{padding:5px;display:flex;flex-direction:column;gap:4px;min-height:50px}
.tc{background:var(--bg3);border:1px solid var(--bd2);border-radius:7px;padding:8px 10px;font-size:12px;cursor:pointer;transition:all .15s}.tc:hover{border-color:var(--ac)}.tc .tt{font-weight:500;margin-bottom:4px}.tc .tm{display:flex;align-items:center;gap:4px;flex-wrap:wrap}
.pill{font-size:9px;padding:2px 6px;border-radius:4px;font-weight:600;text-transform:uppercase;letter-spacing:.3px;display:inline-block}
.pri-crítica{background:var(--rdb);color:var(--rd)}.pri-importante{background:var(--ylb);color:var(--yl)}.pri-baixa{background:var(--gnb);color:var(--gn)}
.rd{width:7px;height:7px;border-radius:50%;display:inline-block;flex-shrink:0}.rd-verde{background:var(--gn)}.rd-amarelo{background:var(--yl)}.rd-vermelho{background:var(--rd);box-shadow:0 0 5px var(--rd)}
.btn{padding:7px 14px;border:none;border-radius:7px;font-size:12px;font-family:var(--sn);font-weight:500;cursor:pointer;transition:all .15s;display:inline-flex;align-items:center;gap:5px}
.bp{background:var(--ac);color:#fff}.bp:hover{background:var(--ac2)}.bg{background:transparent;border:1px solid var(--bd);color:var(--tx2)}.bg:hover{border-color:var(--tx2);color:var(--tx)}.bs{padding:4px 9px;font-size:11px}.bd{background:var(--rdb);color:var(--rd)}.bd:hover{background:var(--rd);color:#fff}.bok{background:var(--gnb);color:var(--gn)}
input,select,textarea{background:var(--bg3);border:1px solid var(--bd);border-radius:7px;padding:7px 11px;color:var(--tx);font-size:13px;font-family:var(--sn);outline:none;width:100%;transition:border-color .15s}input:focus,select:focus,textarea:focus{border-color:var(--ac)}
label{font-size:11px;color:var(--tx2);display:block;margin-bottom:3px;font-weight:500}.fg{margin-bottom:12px}.fr{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.mo{position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:100;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);animation:fi .15s}
.md{background:var(--bg2);border:1px solid var(--bd);border-radius:14px;width:92%;max-width:560px;max-height:85vh;overflow-y:auto;padding:22px;box-shadow:var(--sh);animation:su .2s}
.md h3{font-family:var(--sf);font-size:20px;font-weight:400;margin-bottom:16px}.ma{display:flex;gap:7px;justify-content:flex-end;margin-top:18px}
@keyframes fi{from{opacity:0}to{opacity:1}}@keyframes su{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.cl{display:flex;flex-direction:column;gap:4px}.ci{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--tx2);cursor:pointer;padding:4px 7px;border-radius:5px;transition:background .1s}.ci:hover{background:var(--bg3)}.ci.done{color:var(--tx3);text-decoration:line-through}
.cb{width:16px;height:16px;border:2px solid var(--bd2);border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s}.cb.chk{background:var(--ac);border-color:var(--ac)}
.stb{display:flex;gap:1px;margin:8px 0}.std{flex:1;height:4px;border-radius:2px;background:var(--bg4);transition:background .2s}.std.done{background:var(--ac)}.std.cur{background:var(--ac2);box-shadow:0 0 6px var(--ac)}
.ab{display:flex;align-items:center;gap:7px;padding:8px 12px;border-radius:7px;font-size:12px;margin-bottom:10px}.aw{background:var(--ylb);color:var(--yl);border:1px solid rgba(251,191,36,.15)}.adg{background:var(--rdb);color:var(--rd);border:1px solid rgba(248,113,113,.15)}.ai{background:var(--blb);color:var(--bl);border:1px solid rgba(96,165,250,.15)}
table{width:100%;border-collapse:collapse;font-size:12px}th{text-align:left;padding:8px 10px;border-bottom:1px solid var(--bd);color:var(--tx3);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.5px}td{padding:8px 10px;border-bottom:1px solid var(--bd)}tr:hover td{background:var(--bg3)}
.wb{display:flex;align-items:center;gap:8px;margin-bottom:6px}.wb .wn{width:75px;font-size:12px;color:var(--tx2)}.wb .wt{flex:1;height:6px;background:var(--bg4);border-radius:3px;overflow:hidden}.wb .wf{height:100%;border-radius:3px;transition:width .3s}.wb .wc{font-size:11px;color:var(--tx3);width:22px;text-align:right}
.st{font-family:var(--sf);font-size:18px;font-weight:400;margin-bottom:12px;letter-spacing:-.3px}.ss{font-size:12px;color:var(--tx3);margin-bottom:12px}
.tabs{display:flex;gap:2px;margin-bottom:16px;flex-wrap:wrap}.tabs button{padding:5px 12px;border:none;background:transparent;color:var(--tx3);font-size:12px;font-family:var(--sn);cursor:pointer;border-radius:6px;transition:all .15s;font-weight:500}.tabs button.act{background:var(--acg);color:var(--ac2)}.tabs button:hover:not(.act){color:var(--tx)}
.ug{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}
.uc{background:var(--bg3);border:1px solid var(--bd2);border-radius:var(--r);padding:16px;position:relative;transition:all .15s}.uc:hover{border-color:var(--ac)}.uc .uch{display:flex;align-items:center;gap:10px;margin-bottom:10px}.uc .uca{width:40px;height:40px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;color:#fff}.uc .ucn{font-size:15px;font-weight:600}.uc .uce{font-size:11px;color:var(--tx3);display:flex;align-items:center;gap:3px}.uc .ucr{display:inline-flex;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}.uc .ucp{font-size:10px;color:var(--tx3)}.uc .ucp span{background:var(--bg4);padding:1px 5px;border-radius:3px;margin-right:3px;display:inline-block;margin-bottom:2px}.uc .ucx{display:flex;gap:5px;margin-top:8px;flex-wrap:wrap}.uc .ucs{position:absolute;top:12px;right:12px;width:8px;height:8px;border-radius:50%}
.ntf-item{background:var(--bg3);border:1px solid var(--bd2);border-radius:7px;padding:10px 12px;margin-bottom:6px;display:flex;align-items:flex-start;gap:10px;font-size:12px;transition:all .15s}.ntf-item:hover{border-color:var(--ac)}.ntf-item.unread{border-left:3px solid var(--ac)}
.ntf-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:4px}
::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--bd);border-radius:2px}`;

const Md=({children,onClose})=><div className="mo" onClick={onClose}><div className="md" onClick={e=>e.stopPropagation()}>{children}</div></div>;

/* ═══════════════════════ LOCAL STORAGE ═══════════════════════ */
const LS="gs_crm_v4";const LSS="gs_crm_sess_v4";
const load=()=>{try{const d=localStorage.getItem(LS);return d?JSON.parse(d):null;}catch{return null;}};
const save=(data)=>{try{localStorage.setItem(LS,JSON.stringify(data));}catch{}};
const loadSess=()=>{try{const d=localStorage.getItem(LSS);return d?JSON.parse(d):null;}catch{return null;}};
const saveSess=(u)=>{try{if(u)localStorage.setItem(LSS,JSON.stringify(u));else localStorage.removeItem(LSS);}catch{}};

/* ═══════════════════════ AUTH PAGE ═══════════════════════ */
function AuthPage({users,onLogin,onRegister}){
  const[mode,setMode]=useState("login");
  const[email,setEmail]=useState("");const[pw,setPw]=useState("");const[showPw,setShowPw]=useState(false);
  const[name,setName]=useState("");const[role,setRole]=useState("sdr");
  const[err,setErr]=useState("");const[success,setSuccess]=useState("");const[loading,setLoading]=useState(false);

  const doLogin=()=>{setErr("");setSuccess("");if(!email||!pw){setErr("Preencha e-mail e senha.");return;}setLoading(true);
    setTimeout(()=>{const u=users.find(u=>u.email.toLowerCase()===email.toLowerCase()&&u.password===pw);
      if(!u){setErr("E-mail ou senha incorretos.");setLoading(false);return;}
      if(!u.active){setErr("Conta desativada. Fale com um admin.");setLoading(false);return;}
      onLogin(u);setLoading(false);},500);};

  const doRegister=()=>{setErr("");setSuccess("");
    if(!name||!email||pw.length<6){setErr("Preencha todos os campos. Senha mín. 6 caracteres.");return;}
    if(users.find(u=>u.email.toLowerCase()===email.toLowerCase())){setErr("E-mail já cadastrado.");return;}
    setLoading(true);setTimeout(()=>{
      onRegister({name,email,password:pw,role,avatar:name[0]?.toUpperCase(),approved:true,active:true});
      setSuccess("Conta criada! Faça login para acessar.");setName("");setEmail("");setPw("");setMode("login");setLoading(false);
    },500);};

  return<div className="lp"><div className="lc">
    <div className="lb"><h1>GS Estratégia<br/>e Imagem</h1><div className="su">CRM Interno</div><div className="ln"/></div>
    {err&&<div className="le"><I n="alert" s={14}/>{err}</div>}
    {success&&<div className="ls"><I n="check" s={14}/>{success}</div>}
    {mode==="login"?<>
      <div className="liw"><label>E-mail</label><span className="ii"><I n="mail" s={15}/></span><input type="email" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} autoFocus/></div>
      <div className="liw"><label>Senha</label><span className="ii"><I n="lock" s={15}/></span><input type={showPw?"text":"password"} placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()}/><button className="tp" onClick={()=>setShowPw(!showPw)}><I n={showPw?"eyeOff":"eye"} s={15}/></button></div>
      <button className="lbt" onClick={doLogin} disabled={loading}>{loading?"Entrando...":"Entrar"}</button>
      <div className="lft">Não tem conta? <a onClick={()=>{setMode("register");setErr("");setSuccess("");}}>Criar conta</a></div>
    </>:<>
      <div className="liw"><label>Nome completo</label><span className="ii"><I n="user" s={15}/></span><input placeholder="Seu nome" value={name} onChange={e=>setName(e.target.value)} autoFocus/></div>
      <div className="liw"><label>E-mail</label><span className="ii"><I n="mail" s={15}/></span><input type="email" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)}/></div>
      <div className="liw"><label>Senha</label><span className="ii"><I n="lock" s={15}/></span><input type={showPw?"text":"password"} placeholder="Mínimo 6 caracteres" value={pw} onChange={e=>setPw(e.target.value)}/><button className="tp" onClick={()=>setShowPw(!showPw)}><I n={showPw?"eyeOff":"eye"} s={15}/></button></div>
      <div className="fg"><label>Tipo de perfil</label><select value={role} onChange={e=>setRole(e.target.value)} style={{paddingLeft:14}}><option value="sdr">SDR</option><option value="admin">Admin</option></select></div>
      <button className="lbt" onClick={doRegister} disabled={loading}>{loading?"Criando...":"Criar Conta"}</button>
      <div className="lft">Já tem conta? <a onClick={()=>{setMode("login");setErr("");setSuccess("");}}>Fazer login</a></div>
    </>}
  </div></div>;
}

/* ═══════════════════════ NOTIFICATIONS GENERATOR ═══════════════════════ */
function genNotifs(leads,tasks,cu){
  const n=[];const now=td();
  // Overdue tasks
  tasks.filter(t=>t.status!=="Concluído"&&ov(t.deadline)&&(cu.role==="admin"||t.responsible===cu.name)).forEach(t=>{
    n.push({id:"nt_"+t.id,type:"prazo",icon:"clock",color:"var(--rd)",msg:`Tarefa atrasada: ${t.title}`,detail:`Prazo: ${t.deadline} · ${t.responsible}`,time:t.deadline,read:false});
  });
  // Tasks due in 1-2 days
  tasks.filter(t=>t.status!=="Concluído"&&!ov(t.deadline)&&(cu.role==="admin"||t.responsible===cu.name)).forEach(t=>{
    const d=Math.ceil((new Date(t.deadline)-new Date(now))/86400000);
    if(d<=2&&d>=0) n.push({id:"nt2_"+t.id,type:"prazo",icon:"clock",color:"var(--yl)",msg:`Tarefa vence ${d===0?"hoje":d===1?"amanhã":"em 2 dias"}: ${t.title}`,detail:t.responsible,time:t.deadline,read:false});
  });
  // New leads (created in last 3 days)
  leads.filter(l=>l.createdAt>=ad(now,-3)&&(cu.role==="admin"||l.sdr===cu.name)).forEach(l=>{
    n.push({id:"nl_"+l.id,type:"lead",icon:"userPlus",color:"var(--gn)",msg:`Novo lead: ${l.name}`,detail:`Origem: ${l.origin} · SDR: ${l.sdr}`,time:l.createdAt,read:false});
  });
  // Leads without interaction for 5+ days
  leads.filter(l=>l.stage!=="Fechado"&&l.stage!=="Perdido"&&l.lastInteraction&&(cu.role==="admin"||l.sdr===cu.name)).forEach(l=>{
    const d=Math.ceil((new Date(now)-new Date(l.lastInteraction))/86400000);
    if(d>=5) n.push({id:"ni_"+l.id,type:"inatividade",icon:"alert",color:"var(--or)",msg:`Lead sem interação há ${d} dias: ${l.name}`,detail:`Última: ${l.lastInteraction}`,time:l.lastInteraction,read:false});
  });
  return n.sort((a,b)=>b.time>a.time?1:-1);
}

/* ═══════════════════════ MAIN APP ═══════════════════════ */
export default function App(){
  const saved=useMemo(()=>load(),[]);
  const[users,setUsers]=useState(saved?.users||INIT_USERS);
  const[cu,setCu]=useState(()=>loadSess());
  const[page,setPage]=useState("dashboard");
  const[leads,setLeads]=useState(saved?.leads||sLeads);
  const[consult,setConsult]=useState(saved?.consult||sConsult);
  const[clients,setClients]=useState(saved?.clients||sClients);
  const[prod,setProd]=useState(saved?.prod||sProd);
  const[tasks,setTasks]=useState(saved?.tasks||sTasks);
  const[modal,setModal]=useState(null);
  const[alerts,setAlerts]=useState([]);

  useEffect(()=>{save({users,leads,consult,clients,prod,tasks});},[users,leads,consult,clients,prod,tasks]);
  const login=(u)=>{setCu(u);saveSess(u);};
  const logout=()=>{setCu(null);saveSess(null);};

  const role=cu?ROLES[cu.role]:null;
  const has=m=>role?.access?.includes(m);
  const isAdmin=cu?.role==="admin";
  const tns=useMemo(()=>users.filter(u=>u.active).map(u=>u.name),[users]);

  useEffect(()=>{if(cu&&role)setPage(role.access[0]);},[cu]);

  // SDR filter: SDRs only see their own leads
  const visibleLeads=useMemo(()=>{
    if(!cu)return[];
    if(isAdmin)return leads;
    return leads.filter(l=>l.sdr===cu.name);
  },[leads,cu,isAdmin]);

  const ot=useMemo(()=>tasks.filter(t=>t.status!=="Concluído"&&ov(t.deadline)),[tasks]);
  const notifs=useMemo(()=>cu?genNotifs(leads,tasks,cu):[],[leads,tasks,cu]);
  const unreadNotifs=notifs.filter(n=>!n.read).length;

  useEffect(()=>{const a=[];if(ot.length)a.push({t:"danger",m:`${ot.length} tarefa(s) atrasada(s)!`});setAlerts(a);},[ot]);

  // Actions
  const addLead=l=>{setLeads(p=>[...p,{...l,id:uid(),createdAt:td(),lastInteraction:td(),history:[`${td()} — Lead criado por ${cu.name}`]}]);setModal(null);};
  const updateLead=(id,u)=>setLeads(p=>p.map(x=>x.id===id?{...x,...u,lastInteraction:td()}:x));
  const moveLead=(id,stage)=>{setLeads(p=>p.map(x=>{if(x.id!==id)return x;const h=[...(x.history||[]),`${td()} — Movido para ${stage}`];return{...x,stage,lastInteraction:td(),history:h};}));};
  const addTask=t=>{setTasks(p=>[...p,{...t,id:uid()}]);setModal(null);};
  const updateTask=(id,u)=>setTasks(p=>p.map(t=>t.id===id?{...t,...u}:t));
  const addProd=item=>{setProd(p=>[...p,{...item,id:uid(),createdAt:td()}]);setModal(null);};
  const updateProd=(id,u)=>setProd(p=>p.map(x=>x.id===id?{...x,...u}:x));
  const addConsultClient=c=>{setConsult(p=>[...p,{...c,id:uid(),stage:0,stageChecklist:{0:CONSULT_CHECKLISTS[CONSULT_STAGES[0]].map(()=>false)},startDate:td()}]);setModal(null);};
  const togConsultCheck=(cid,si,ci)=>{setConsult(p=>p.map(c=>{if(c.id!==cid)return c;const cl=[...(c.stageChecklist[si]||[])];cl[ci]=!cl[ci];return{...c,stageChecklist:{...c.stageChecklist,[si]:cl}};}));};
  const advConsult=cid=>{setConsult(p=>p.map(c=>{if(c.id!==cid)return c;const ch=c.stageChecklist[c.stage]||[];if(!ch.every(Boolean))return c;const nx=c.stage+1;if(nx>=CONSULT_STAGES.length)return c;const nn=CONSULT_STAGES[nx];return{...c,stage:nx,stageChecklist:{...c.stageChecklist,[nx]:(CONSULT_CHECKLISTS[nn]||[]).map(()=>false)}};}));};
  const moveConsultTo=(cid,si)=>{setConsult(p=>p.map(c=>{if(c.id!==cid)return c;const nn=CONSULT_STAGES[si];return{...c,stage:si,stageChecklist:{...c.stageChecklist,[si]:c.stageChecklist[si]||(CONSULT_CHECKLISTS[nn]||[]).map(()=>false)}};}));};
  const advClient=cid=>{setClients(p=>p.map(c=>{if(c.id!==cid)return c;const ch=c.stageChecklist[c.stage]||[];if(!ch.every(Boolean))return c;const nx=c.stage+1;if(nx>=MENTORING_STAGES.length)return c;const nn=MENTORING_STAGES[nx];return{...c,stage:nx,stageChecklist:{...c.stageChecklist,[nx]:(MENTORING_CL[nn]||[]).map(()=>false)}};}));};
  const togCheck=(cid,si,ci)=>{setClients(p=>p.map(c=>{if(c.id!==cid)return c;const cl=[...(c.stageChecklist[si]||[])];cl[ci]=!cl[ci];return{...c,stageChecklist:{...c.stageChecklist,[si]:cl}};}));};
  const registerUser=u=>{setUsers(p=>[...p,{...u,id:uid(),createdAt:td()}]);};
  const updateUser=(id,u)=>setUsers(p=>p.map(x=>x.id===id?{...x,...u}:x));
  const togActive=id=>setUsers(p=>p.map(u=>u.id===id?{...u,active:!u.active}:u));

  if(!cu)return<><style>{CSS}</style><AuthPage users={users} onLogin={login} onRegister={registerUser}/></>;

  const vTasks=useMemo(()=>{if(isAdmin)return tasks;return tasks.filter(t=>t.responsible===cu.name);},[tasks,cu,isAdmin]);

  const navs=[
    {k:"dashboard",i:"dashboard",l:"Dashboard"},
    {k:"commercial",i:"commercial",l:"Comercial"},
    {k:"consultoria",i:"consultoria",l:"Consultoria"},
    {k:"mentoring",i:"mentoring",l:"Mentoria"},
    {k:"production",i:"production",l:"Produção"},
    {k:"tasks",i:"tasks",l:"Tarefas"},
    {k:"notifications",i:"bell",l:"Notificações"},
  ];
  const rc=ROLES[cu.role]?.color||"var(--ac)";

  const rp=()=>{if(!has(page))return<div className="cd" style={{textAlign:"center",padding:36}}><I n="lock" s={36} c="var(--tx3)"/><p style={{marginTop:10,color:"var(--tx3)",fontSize:13}}>Sem acesso a este módulo</p></div>;
    switch(page){
      case"dashboard":return<Dash {...{leads:visibleLeads,consult,clients,tasks:vTasks,ot,cu,tns,isAdmin}}/>;
      case"commercial":return<Comm {...{leads:visibleLeads,moveLead,setModal,cu,isAdmin}}/>;
      case"consultoria":return<ConsultPage {...{consult,advConsult,togConsultCheck,moveConsultTo,setModal}}/>;
      case"mentoring":return<Ment {...{clients,advClient,togCheck}}/>;
      case"production":return<Prodc {...{prod,updateProd}}/>;
      case"tasks":return<TasksPage {...{tasks:vTasks,updateTask,setModal,cu}}/>;
      case"notifications":return<NotifsPage notifs={notifs}/>;
      case"admin":return<Admin {...{users,togActive,setModal,cu,updateUser}}/>;
      default:return null;}};

  return<><style>{CSS}</style><div className="app">
    <aside className="sb">
      <div className="sb-b"><h1>GS Estratégia<br/>e Imagem</h1><span>CRM Interno</span></div>
      <div className="sb-u"><div className="av" style={{background:rc}}>{cu.avatar}</div><div className="ui"><div className="un">{cu.name}</div><div className="ur" style={{background:`${rc}22`,color:rc}}>{ROLES[cu.role]?.label}</div></div></div>
      <nav className="sb-n">
        <div className="ns">Módulos</div>
        {navs.map(n=><button key={n.k} className={`${page===n.k?"act":""} ${!has(n.k)?"dis":""}`} onClick={()=>has(n.k)&&setPage(n.k)}>
          <I n={n.i} s={16}/>{n.l}{!has(n.k)&&<I n="lock" s={11} c="var(--tx3)"/>}
          {n.k==="tasks"&&ot.length>0&&has("tasks")&&<span className="bdg">{ot.length}</span>}
          {n.k==="notifications"&&unreadNotifs>0&&<span className="bdg" style={{background:"var(--ac)"}}>{unreadNotifs}</span>}
        </button>)}
        {has("admin")&&<><div className="ns">Administração</div><button className={page==="admin"?"act":""} onClick={()=>setPage("admin")}><I n="admin" s={16}/>Usuários</button></>}
      </nav>
      <div className="sb-f"><span style={{fontSize:10,color:"var(--tx3)"}}>v4.0</span><button onClick={logout}><I n="logout" s={13}/>Sair</button></div>
    </aside>
    <main className="mn">
      <header className="mh"><h2>{page==="admin"?"Usuários":navs.find(n=>n.k===page)?.l||""}</h2>
        <div style={{display:"flex",gap:7}}>
          {page==="commercial"&&has("commercial")&&<button className="btn bp" onClick={()=>setModal("newLead")}><I n="plus" s={13}/>Novo Lead</button>}
          {page==="consultoria"&&has("consultoria")&&<button className="btn bp" onClick={()=>setModal("newConsult")}><I n="plus" s={13}/>Novo Cliente</button>}
          {page==="production"&&has("production")&&<button className="btn bp" onClick={()=>setModal("newProd")}><I n="plus" s={13}/>Nova Produção</button>}
          {page==="tasks"&&has("tasks")&&<button className="btn bp" onClick={()=>setModal("newTask")}><I n="plus" s={13}/>Nova Tarefa</button>}
        </div>
      </header>
      <div className="mc">
        {alerts.map((a,i)=><div key={i} className={`ab ${a.t==="danger"?"adg":"aw"}`}><I n="alert" s={14}/>{a.m}<button style={{marginLeft:"auto",background:"none",border:"none",color:"inherit",cursor:"pointer"}} onClick={()=>setAlerts(p=>p.filter((_,j)=>j!==i))}><I n="x" s={13}/></button></div>)}
        {rp()}
      </div>
    </main>
  </div>
  {modal==="newLead"&&<Md onClose={()=>setModal(null)}><NLF onSave={addLead} onClose={()=>setModal(null)} cu={cu}/></Md>}
  {modal==="newConsult"&&<Md onClose={()=>setModal(null)}><NCF onSave={addConsultClient} onClose={()=>setModal(null)} tns={tns}/></Md>}
  {modal==="newTask"&&<Md onClose={()=>setModal(null)}><NTF onSave={addTask} onClose={()=>setModal(null)} tns={tns}/></Md>}
  {modal==="newProd"&&<Md onClose={()=>setModal(null)}><NPF onSave={addProd} onClose={()=>setModal(null)} tns={tns}/></Md>}
  {modal?.t==="ld"&&<Md onClose={()=>setModal(null)}><LD lead={modal.d} onMove={moveLead} onUpdate={updateLead} onClose={()=>setModal(null)} isAdmin={isAdmin}/></Md>}
  {modal?.t==="cd"&&<Md onClose={()=>setModal(null)}><CCD client={modal.d} stages={CONSULT_STAGES} checklists={CONSULT_CHECKLISTS} onToggle={togConsultCheck} onAdvance={advConsult} onMoveTo={moveConsultTo} onClose={()=>setModal(null)}/></Md>}
  {modal?.t==="td"&&<Md onClose={()=>setModal(null)}><TD task={modal.d} onUpdate={updateTask} onClose={()=>setModal(null)}/></Md>}
  {modal?.t==="eu"&&<Md onClose={()=>setModal(null)}><EUF user={modal.d} onSave={updateUser} onClose={()=>setModal(null)}/></Md>}
  </>;
}

/* ═══════════════════════ DASHBOARD ═══════════════════════ */
function Dash({leads,consult,clients,tasks,ot,cu,isAdmin}){
  const totalValue=leads.filter(l=>l.stage!=="Perdido").reduce((s,l)=>s+(l.value||0),0);
  const closedValue=leads.filter(l=>l.stage==="Fechado").reduce((s,l)=>s+(l.value||0),0);
  return<>
    <div className="sg">
      <div className="sc"><span className="sl">Leads Ativos</span><span className="sv">{leads.filter(l=>l.stage!=="Fechado"&&l.stage!=="Perdido").length}</span></div>
      <div className="sc"><span className="sl">Pipeline Total</span><span className="sv" style={{color:"var(--bl)",fontSize:22}}>{fmt(totalValue)}</span></div>
      <div className="sc"><span className="sl">Fechados</span><span className="sv" style={{color:"var(--gn)"}}>{fmt(closedValue)}</span></div>
      <div className="sc"><span className="sl">Consultoria</span><span className="sv">{consult.filter(c=>c.stage<CONSULT_STAGES.length-1).length}</span></div>
      <div className="sc"><span className="sl">Atrasadas</span><span className="sv" style={{color:ot.length?"var(--rd)":"var(--gn)"}}>{ot.length}</span></div>
      <div className="sc"><span className="sl">Minhas Tarefas</span><span className="sv">{tasks.filter(t=>t.responsible===cu.name&&t.status!=="Concluído").length}</span></div>
    </div>
    {ot.length>0&&<div className="cd" style={{marginBottom:18}}><div className="st" style={{color:"var(--rd)"}}>Tarefas Atrasadas</div><table><thead><tr><th>Tarefa</th><th>Resp.</th><th>Prazo</th></tr></thead><tbody>{ot.slice(0,8).map(t=><tr key={t.id}><td>{t.title}</td><td>{t.responsible}</td><td style={{color:"var(--rd)"}}>{t.deadline}</td></tr>)}</tbody></table></div>}
  </>;
}

/* ═══════════════════════ COMMERCIAL (SDR FILTERED) ═══════════════════════ */
function Comm({leads,moveLead,setModal,cu,isAdmin}){
  return<>
    <div className="pl">{COMMERCIAL_STAGES.map(stage=>{const sl=leads.filter(l=>l.stage===stage);const stageVal=sl.reduce((s,l)=>s+(l.value||0),0);
    return<div className="pc" key={stage}><div className="pch"><span style={{fontSize:10}}>{stage}</span>{stageVal>0&&<span className="val">{fmt(stageVal)}</span>}<span className="ct">{sl.length}</span></div><div className="pcb">{sl.map(l=><div className="lcard" key={l.id} onClick={()=>setModal({t:"ld",d:l})}>
      <div className="ln">{l.name}</div>
      <div className="lm"><span className="tag">{l.origin}</span>{l.value>0&&<span className="tag" style={{color:"var(--gn)"}}>{fmt(l.value)}</span>}</div>
      <div className="lm" style={{marginTop:2}}><span>SDR: {l.sdr}</span><span>{l.createdAt}</span></div>
    </div>)}</div></div>})}</div>
    {isAdmin&&<div className="cd" style={{marginTop:14}}><div className="st"><I n="dollar" s={16} c="var(--gn)"/> Resumo de Valores</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:8}}>
        {COMMERCIAL_STAGES.filter(s=>s!=="Perdido").map(stage=>{const v=leads.filter(l=>l.stage===stage).reduce((s,l)=>s+(l.value||0),0);
        return<div key={stage} style={{background:"var(--bg3)",borderRadius:7,padding:10}}><div style={{fontSize:10,color:"var(--tx3)"}}>{stage}</div><div style={{fontSize:16,fontWeight:600,color:stage==="Fechado"?"var(--gn)":"var(--tx)"}}>{fmt(v)}</div></div>})}
      </div>
    </div>}
  </>;
}

/* ═══════════════════════ CONSULTORIA ═══════════════════════ */
function ConsultPage({consult,advConsult,togConsultCheck,moveConsultTo,setModal}){
  const[view,setView]=useState("pipeline");
  return<><div className="tabs"><button className={view==="pipeline"?"act":""} onClick={()=>setView("pipeline")}>Pipeline</button><button className={view==="list"?"act":""} onClick={()=>setView("list")}>Lista</button></div>
    {view==="pipeline"?
      <div className="pl">{CONSULT_STAGES.map((stage,si)=>{const items=consult.filter(c=>c.stage===si);return<div className="pc" key={stage}><div className="pch"><span style={{fontSize:10}}>{stage}</span><span className="ct">{items.length}</span></div><div className="pcb">{items.map(c=><div className="lcard" key={c.id} onClick={()=>setModal({t:"cd",d:c})}><div className="ln">{c.name}</div><div className="lm"><span className="tag">{c.plan}</span><span>{c.responsible}</span></div></div>)}</div></div>})}</div>
    :consult.map(c=>{const sn=CONSULT_STAGES[c.stage];const cl=CONSULT_CHECKLISTS[sn]||[];const ch=c.stageChecklist[c.stage]||[];const ok=ch.length>0&&ch.every(Boolean);const pct=ch.length?Math.round(ch.filter(Boolean).length/ch.length*100):0;
      return<div className="cd" key={c.id} style={{marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
          <div><div style={{fontSize:15,fontWeight:600}}>{c.name} <span className="pill" style={{background:"var(--bg4)",color:"var(--tx2)"}}>{c.plan}</span></div><div style={{fontSize:10,color:"var(--tx3)"}}>{c.responsible} · {c.startDate}</div></div>
          <button className="btn bp bs" disabled={!ok} onClick={()=>advConsult(c.id)} style={{opacity:ok?1:.35}}>Avançar <I n="chevron" s={12}/></button>
        </div>
        <div className="stb">{CONSULT_STAGES.map((s,i)=><div key={i} className={`std ${i<c.stage?"done":i===c.stage?"cur":""}`} title={s}/>)}</div>
        <div style={{fontSize:12,fontWeight:600,marginBottom:5}}>Etapa {c.stage+1}: {sn} <span style={{fontWeight:400,color:"var(--tx3)"}}>{pct}%</span></div>
        <div className="cl">{cl.map((item,i)=><div key={i} className={`ci ${ch[i]?"done":""}`} onClick={()=>togConsultCheck(c.id,c.stage,i)}><div className={`cb ${ch[i]?"chk":""}`}>{ch[i]&&<I n="check" s={11} c="#fff"/>}</div>{item}</div>)}</div>
      </div>})}
  </>;
}

/* ═══════════════════════ MENTORING ═══════════════════════ */
function Ment({clients,advClient,togCheck}){
  return<>{clients.map(c=>{const sn=MENTORING_STAGES[c.stage];const cl=MENTORING_CL[sn]||[];const ch=c.stageChecklist[c.stage]||[];const ok=ch.length>0&&ch.every(Boolean);const pct=ch.length?Math.round(ch.filter(Boolean).length/ch.length*100):0;
  return<div className="cd" key={c.id} style={{marginBottom:12}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
      <div><div style={{fontSize:15,fontWeight:600}}>{c.name}</div><div style={{fontSize:10,color:"var(--tx3)"}}>{c.type} · {c.responsible}</div></div>
      <button className="btn bp bs" disabled={!ok} onClick={()=>advClient(c.id)} style={{opacity:ok?1:.35}}>Avançar <I n="chevron" s={12}/></button>
    </div>
    <div className="stb">{MENTORING_STAGES.map((s,i)=><div key={i} className={`std ${i<c.stage?"done":i===c.stage?"cur":""}`}/>)}</div>
    <div style={{fontSize:12,fontWeight:600,marginBottom:5}}>Etapa {c.stage+1}: {sn} <span style={{fontWeight:400,color:"var(--tx3)"}}>{pct}%</span></div>
    <div className="cl">{cl.map((item,i)=><div key={i} className={`ci ${ch[i]?"done":""}`} onClick={()=>togCheck(c.id,c.stage,i)}><div className={`cb ${ch[i]?"chk":""}`}>{ch[i]&&<I n="check" s={11} c="#fff"/>}</div>{item}</div>)}</div>
  </div>})}</>;
}

/* ═══════════════════════ PRODUCTION ═══════════════════════ */
function Prodc({prod,updateProd}){
  return<div className="pl">{PROD_STAGES.map(stage=>{const items=prod.filter(p=>p.stage===stage);return<div className="pc" key={stage}><div className="pch">{stage}<span className="ct">{items.length}</span></div><div className="pcb">{items.map(p=><div className="lcard" key={p.id}>
    <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:2}}><span className={`rd rd-${p.risk.toLowerCase()}`}/><span style={{fontWeight:600,fontSize:11}}>{p.title}</span></div>
    <div className="lm"><span className="tag">{p.type}</span><span className={`pill pri-${p.priority.toLowerCase()}`}>{p.priority}</span></div>
    <div style={{fontSize:10,color:"var(--tx3)",marginTop:2}}>{p.responsible} · {ov(p.deadline)?<span style={{color:"var(--rd)"}}>Atrasado</span>:p.deadline}</div>
    <div style={{display:"flex",gap:3,marginTop:4,flexWrap:"wrap"}}>{PROD_STAGES.filter(s=>s!==p.stage).map(s=><button key={s} className="btn bg bs" style={{fontSize:9,padding:"1px 4px"}} onClick={()=>updateProd(p.id,{stage:s})}>{s}</button>)}</div>
  </div>)}</div></div>})}</div>;
}

/* ═══════════════════════ TASKS ═══════════════════════ */
function TasksPage({tasks,updateTask,setModal,cu}){
  const[f,sF]=useState("all");const[my,sMy]=useState(false);
  let fl=f==="all"?tasks:tasks.filter(t=>t.module===f);if(my)fl=fl.filter(t=>t.responsible===cu.name);
  return<><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
    <div className="tabs" style={{marginBottom:0}}>{["all","Comercial","Consultoria","Mentoria","Produção"].map(x=><button key={x} className={f===x?"act":""} onClick={()=>sF(x)}>{x==="all"?"Todas":x}</button>)}</div>
    <button className={`btn bs ${my?"bp":"bg"}`} onClick={()=>sMy(!my)}><I n="user" s={12}/>Minhas</button>
  </div>
  <div className="kb">{KANBAN.map(list=>{const items=fl.filter(t=>t.kanban===list);return<div className="kc" key={list}><div className="kch">{list}<span style={{background:"var(--bg4)",padding:"1px 6px",borderRadius:10,fontSize:10}}>{items.length}</span></div><div className="kcb">{items.sort((a,b)=>PRIOS.indexOf(a.priority)-PRIOS.indexOf(b.priority)).map(t=><div className="tc" key={t.id} onClick={()=>setModal({t:"td",d:t})}>
    <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:3}}><span className={`rd rd-${t.risk.toLowerCase()}`}/><span className="tt">{t.title}</span></div>
    <div className="tm"><span className={`pill pri-${t.priority.toLowerCase()}`}>{t.priority}</span><span style={{fontSize:10,color:"var(--tx3)"}}>{t.responsible}</span>{t.deadline&&<span style={{fontSize:10,color:ov(t.deadline)?"var(--rd)":"var(--tx3)",marginLeft:"auto"}}>{t.deadline}</span>}</div>
  </div>)}</div></div>})}</div></>;
}

/* ═══════════════════════ NOTIFICATIONS ═══════════════════════ */
function NotifsPage({notifs}){
  const typeLabels={prazo:"Prazo",lead:"Lead",inatividade:"Inatividade",etapa:"Etapa"};
  const[filter,setFilter]=useState("all");
  const filtered=filter==="all"?notifs:notifs.filter(n=>n.type===filter);
  return<>
    <div className="tabs">{["all","prazo","lead","inatividade"].map(f=><button key={f} className={filter===f?"act":""} onClick={()=>setFilter(f)}>{f==="all"?"Todas":typeLabels[f]||f}</button>)}</div>
    {filtered.length===0&&<div style={{textAlign:"center",color:"var(--tx3)",padding:40}}>Nenhuma notificação</div>}
    {filtered.map(n=><div key={n.id} className={`ntf-item ${n.read?"":"unread"}`}>
      <div className="ntf-dot" style={{background:n.color}}/>
      <div style={{flex:1}}>
        <div style={{fontWeight:600,marginBottom:2}}>{n.msg}</div>
        <div style={{fontSize:11,color:"var(--tx3)"}}>{n.detail}</div>
      </div>
      <div style={{fontSize:10,color:"var(--tx3)",whiteSpace:"nowrap"}}>{n.time}</div>
    </div>)}
  </>;
}

/* ═══════════════════════ ADMIN ═══════════════════════ */
function Admin({users,togActive,setModal,cu,updateUser}){
  return<>
    <div className="ss">Gerencie acessos. Admins têm acesso total, SDRs veem apenas seus leads.</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
      {Object.entries(ROLES).map(([k,r])=><div key={k} className="cd" style={{padding:12}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><div style={{width:8,height:8,borderRadius:2,background:r.color}}/><span style={{fontWeight:600,fontSize:13}}>{r.label}</span></div><div style={{fontSize:10,color:"var(--tx3)"}}>{r.desc}</div></div>)}
    </div>
    <div className="st">Equipe ({users.length})</div>
    <div className="ug">{users.map(u=>{const r=ROLES[u.role];return<div className="uc" key={u.id}>
      <div className="ucs" style={{background:u.active?"var(--gn)":"var(--rd)"}}/>
      <div className="uch"><div className="uca" style={{background:r?.color||"var(--ac)"}}>{u.avatar}</div><div><div className="ucn">{u.name}</div><div className="uce"><I n="mail" s={10}/>{u.email}</div></div></div>
      <div className="ucr" style={{background:`${r?.color}22`,color:r?.color}}>{r?.label}</div>
      <div style={{fontSize:10,color:"var(--tx3)",marginBottom:6}}>Criado em: {u.createdAt}</div>
      <div className="ucp">Acesso: {r?.access?.map(a=><span key={a}>{a}</span>)}</div>
      <div className="ucx">
        <button className="btn bg bs" onClick={()=>setModal({t:"eu",d:u})}><I n="edit" s={11}/>Editar</button>
        {u.id!==cu.id&&<button className={`btn bs ${u.active?"bd":"bok"}`} onClick={()=>togActive(u.id)}>{u.active?"Desativar":"Ativar"}</button>}
      </div>
    </div>})}</div>
  </>;
}

/* ═══════════════════════ FORMS ═══════════════════════ */
function NLF({onSave,onClose,cu}){
  const[f,sF]=useState({name:"",origin:"Instagram",sdr:cu.name,stage:"Lead",notes:"",value:""});
  const s=(k,v)=>sF(p=>({...p,[k]:v}));
  return<><h3>Novo Lead</h3>
    <div className="fg"><label>Nome</label><input value={f.name} onChange={e=>s("name",e.target.value)} autoFocus/></div>
    <div className="fr">
      <div className="fg"><label>Origem</label><select value={f.origin} onChange={e=>s("origin",e.target.value)}>{LEAD_ORIGINS.map(o=><option key={o}>{o}</option>)}</select></div>
      <div className="fg"><label>Valor do Plano (R$)</label><input type="number" value={f.value} onChange={e=>s("value",Number(e.target.value))} placeholder="0.00"/></div>
    </div>
    <div className="fg"><label>Observações</label><textarea rows={2} value={f.notes} onChange={e=>s("notes",e.target.value)}/></div>
    <div className="ma"><button className="btn bg" onClick={onClose}>Cancelar</button><button className="btn bp" onClick={()=>f.name&&onSave(f)} disabled={!f.name}>Salvar Lead</button></div>
  </>;
}

function NCF({onSave,onClose,tns}){const[f,sF]=useState({name:"",plan:"Premium",responsible:tns[0]||""});const s=(k,v)=>sF(p=>({...p,[k]:v}));
return<><h3>Novo Cliente Consultoria</h3><div className="fg"><label>Nome completo</label><input value={f.name} onChange={e=>s("name",e.target.value)} autoFocus/></div><div className="fr"><div className="fg"><label>Plano</label><select value={f.plan} onChange={e=>s("plan",e.target.value)}>{PLANS.map(o=><option key={o}>{o}</option>)}</select></div><div className="fg"><label>Responsável</label><select value={f.responsible} onChange={e=>s("responsible",e.target.value)}>{tns.map(o=><option key={o}>{o}</option>)}</select></div></div><div className="ma"><button className="btn bg" onClick={onClose}>Cancelar</button><button className="btn bp" onClick={()=>f.name&&onSave(f)} disabled={!f.name}>Criar</button></div></>;}

function NTF({onSave,onClose,tns}){const[f,sF]=useState({title:"",responsible:tns[0]||"",priority:"Importante",status:"Não iniciado",risk:"Verde",deadline:ad(td(),3),kanban:"Entrada",module:"Comercial"});const s=(k,v)=>sF(p=>({...p,[k]:v}));
return<><h3>Nova Tarefa</h3><div className="fg"><label>Título</label><input value={f.title} onChange={e=>s("title",e.target.value)} autoFocus/></div><div className="fr"><div className="fg"><label>Responsável</label><select value={f.responsible} onChange={e=>s("responsible",e.target.value)}>{tns.map(o=><option key={o}>{o}</option>)}</select></div><div className="fg"><label>Prioridade</label><select value={f.priority} onChange={e=>s("priority",e.target.value)}>{PRIOS.map(o=><option key={o}>{o}</option>)}</select></div></div><div className="fr"><div className="fg"><label>Prazo</label><input type="date" value={f.deadline} onChange={e=>s("deadline",e.target.value)}/></div><div className="fg"><label>Módulo</label><select value={f.module} onChange={e=>s("module",e.target.value)}>{["Comercial","Consultoria","Mentoria","Produção"].map(o=><option key={o}>{o}</option>)}</select></div></div><div className="ma"><button className="btn bg" onClick={onClose}>Cancelar</button><button className="btn bp" onClick={()=>f.title&&onSave(f)} disabled={!f.title}>Criar</button></div></>;}

function NPF({onSave,onClose,tns}){const[f,sF]=useState({title:"",type:"Arte",requester:tns[0]||"",responsible:tns[0]||"",stage:"Solicitação",priority:"Importante",risk:"Verde",deadline:ad(td(),5),briefing:""});const s=(k,v)=>sF(p=>({...p,[k]:v}));
return<><h3>Nova Produção</h3><div className="fg"><label>Título</label><input value={f.title} onChange={e=>s("title",e.target.value)} autoFocus/></div><div className="fr"><div className="fg"><label>Tipo</label><select value={f.type} onChange={e=>s("type",e.target.value)}>{DELIVERY_TYPES.map(o=><option key={o}>{o}</option>)}</select></div><div className="fg"><label>Responsável</label><select value={f.responsible} onChange={e=>s("responsible",e.target.value)}>{tns.map(o=><option key={o}>{o}</option>)}</select></div></div><div className="fg"><label>Prazo</label><input type="date" value={f.deadline} onChange={e=>s("deadline",e.target.value)}/></div><div className="fg"><label>Briefing</label><textarea rows={2} value={f.briefing} onChange={e=>s("briefing",e.target.value)}/></div><div className="ma"><button className="btn bg" onClick={onClose}>Cancelar</button><button className="btn bp" onClick={()=>f.title&&onSave(f)} disabled={!f.title}>Criar</button></div></>;}

function EUF({user,onSave,onClose}){const[f,sF]=useState({name:user.name,email:user.email,password:user.password,role:user.role});const s=(k,v)=>sF(p=>({...p,[k]:v}));const[sp,sSp]=useState(false);
return<><h3>Editar Usuário</h3><div className="fg"><label>Nome</label><input value={f.name} onChange={e=>s("name",e.target.value)}/></div><div className="fg"><label>E-mail</label><input type="email" value={f.email} onChange={e=>s("email",e.target.value)}/></div><div className="fg"><label>Senha</label><div style={{position:"relative"}}><input type={sp?"text":"password"} value={f.password} onChange={e=>s("password",e.target.value)}/><button style={{position:"absolute",right:9,top:7,background:"none",border:"none",color:"var(--tx3)",cursor:"pointer"}} onClick={()=>sSp(!sp)}><I n={sp?"eyeOff":"eye"} s={14}/></button></div></div><div className="fg"><label>Perfil</label><select value={f.role} onChange={e=>s("role",e.target.value)}>{Object.entries(ROLES).map(([k,r])=><option key={k} value={k}>{r.label}</option>)}</select></div><div className="ma"><button className="btn bg" onClick={onClose}>Cancelar</button><button className="btn bp" onClick={()=>{onSave(user.id,{...f,avatar:f.name[0]?.toUpperCase()});onClose();}}>Salvar</button></div></>;}

/* ═══════════════════════ LEAD DETAIL (WITH HISTORY & EDIT) ═══════════════════════ */
function LD({lead,onMove,onUpdate,onClose,isAdmin}){
  const idx=COMMERCIAL_STAGES.indexOf(lead.stage);
  const can=idx<COMMERCIAL_STAGES.length-1;
  const nx=can?COMMERCIAL_STAGES[idx+1]:null;
  const[editing,setEditing]=useState(false);
  const[notes,setNotes]=useState(lead.notes||"");
  const[value,setValue]=useState(lead.value||0);
  const[newNote,setNewNote]=useState("");

  const saveEdit=()=>{onUpdate(lead.id,{notes,value:Number(value)});setEditing(false);};
  const addHistory=()=>{if(!newNote)return;const h=[...(lead.history||[]),`${td()} — ${newNote}`];onUpdate(lead.id,{history:h});setNewNote("");};

  return<><h3>{lead.name}</h3>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12,fontSize:13}}>
      <div><label>Origem</label>{lead.origin}</div>
      <div><label>Valor do Plano</label><span style={{color:"var(--gn)",fontWeight:600}}>{fmt(lead.value)}</span></div>
      <div><label>SDR Responsável</label>{lead.sdr}</div>
      <div><label>Etapa</label>{lead.stage}</div>
      <div><label>Data de Criação</label>{lead.createdAt}</div>
      <div><label>Última Interação</label>{lead.lastInteraction||"—"}</div>
    </div>

    {editing?<>
      <div className="fg"><label>Observações</label><textarea rows={2} value={notes} onChange={e=>setNotes(e.target.value)}/></div>
      <div className="fg"><label>Valor do Plano (R$)</label><input type="number" value={value} onChange={e=>setValue(e.target.value)}/></div>
      <div className="ma"><button className="btn bg" onClick={()=>setEditing(false)}>Cancelar</button><button className="btn bp" onClick={saveEdit}>Salvar</button></div>
    </>:<>
      {lead.notes&&<div style={{marginBottom:10}}><label>Observações</label><div style={{fontSize:12,color:"var(--tx2)",marginTop:2}}>{lead.notes}</div></div>}
      <button className="btn bg bs" onClick={()=>setEditing(true)} style={{marginBottom:10}}><I n="edit" s={11}/>Editar info</button>
    </>}

    <div style={{marginTop:8}}><label>Histórico de Interações</label>
      <div style={{maxHeight:150,overflowY:"auto",marginTop:4}}>
        {(lead.history||[]).map((h,i)=><div key={i} style={{fontSize:11,color:"var(--tx2)",padding:"3px 0",borderBottom:"1px solid var(--bd)"}}>{h}</div>)}
        {(!lead.history||!lead.history.length)&&<div style={{fontSize:11,color:"var(--tx3)"}}>Nenhuma interação registrada</div>}
      </div>
      <div style={{display:"flex",gap:5,marginTop:8}}>
        <input value={newNote} onChange={e=>setNewNote(e.target.value)} placeholder="Adicionar interação..." style={{flex:1,fontSize:12}} onKeyDown={e=>e.key==="Enter"&&addHistory()}/>
        <button className="btn bp bs" onClick={addHistory}>Adicionar</button>
      </div>
    </div>

    <div className="ma" style={{marginTop:14}}>
      <button className="btn bg" onClick={onClose}>Fechar</button>
      {can&&<button className="btn bp" onClick={()=>{onMove(lead.id,nx);onClose();}}>→ {nx}</button>}
    </div>
  </>;
}

function CCD({client,stages,checklists,onToggle,onAdvance,onMoveTo,onClose}){
  const sn=stages[client.stage];const cl=checklists[sn]||[];const ch=client.stageChecklist[client.stage]||[];const ok=ch.length>0&&ch.every(Boolean);
  const[moveTarget,setMoveTarget]=useState("");
  return<><h3>{client.name}</h3><div style={{fontSize:11,color:"var(--tx3)",marginBottom:8}}>{client.plan} · {client.responsible} · Etapa {client.stage+1}/{stages.length}</div>
  <div className="stb">{stages.map((s,i)=><div key={i} className={`std ${i<client.stage?"done":i===client.stage?"cur":""}`} title={s}/>)}</div>
  <div style={{fontWeight:600,margin:"6px 0",fontSize:13}}>{sn}</div>
  <div className="cl">{cl.map((item,i)=><div key={i} className={`ci ${ch[i]?"done":""}`} onClick={()=>onToggle(client.id,client.stage,i)}><div className={`cb ${ch[i]?"chk":""}`}>{ch[i]&&<I n="check" s={11} c="#fff"/>}</div>{item}</div>)}</div>
  <div style={{marginTop:12,display:"flex",gap:6,alignItems:"center"}}>
    <select value={moveTarget} onChange={e=>setMoveTarget(e.target.value)} style={{flex:1,fontSize:12}}><option value="">Mover para etapa...</option>{stages.map((s,i)=>i!==client.stage&&<option key={i} value={i}>{s}</option>)}</select>
    <button className="btn bg bs" disabled={!moveTarget} onClick={()=>{onMoveTo(client.id,parseInt(moveTarget));setMoveTarget("");onClose();}}>Mover</button>
  </div>
  <div className="ma"><button className="btn bg" onClick={onClose}>Fechar</button><button className="btn bp" disabled={!ok} style={{opacity:ok?1:.35}} onClick={()=>{onAdvance(client.id);onClose();}}>Avançar</button></div></>;}

function TD({task,onUpdate,onClose}){const[st,sSt]=useState(task.status);const[kb,sKb]=useState(task.kanban);const[rk,sRk]=useState(task.risk);
return<><h3>{task.title}</h3><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12,fontSize:13}}><div><label>Responsável</label>{task.responsible}</div><div><label>Prazo</label><span style={{color:ov(task.deadline)?"var(--rd)":"inherit"}}>{task.deadline}</span></div><div><label>Prioridade</label><span className={`pill pri-${task.priority.toLowerCase()}`}>{task.priority}</span></div><div><label>Módulo</label>{task.module}</div></div>
<div className="fr"><div className="fg"><label>Status</label><select value={st} onChange={e=>sSt(e.target.value)}>{TASK_ST.map(o=><option key={o}>{o}</option>)}</select></div><div className="fg"><label>Kanban</label><select value={kb} onChange={e=>sKb(e.target.value)}>{KANBAN.map(o=><option key={o}>{o}</option>)}</select></div></div>
<div className="fg"><label>Risco</label><select value={rk} onChange={e=>sRk(e.target.value)}>{RISKS.map(o=><option key={o}>{o}</option>)}</select></div>
<div className="ma"><button className="btn bg" onClick={onClose}>Cancelar</button><button className="btn bp" onClick={()=>{onUpdate(task.id,{status:st,kanban:kb,risk:rk});onClose();}}>Salvar</button></div></>;}
