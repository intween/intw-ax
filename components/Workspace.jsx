'use client';
import { useState } from 'react';
import { Frame, Badge, Metric } from './Ui';
import { sources, initialRequirements } from '../modules/demo';
export default function Workspace() {
  const [rows, setRows] = useState(initialRequirements);
  const [selected, setSelected] = useState('R-01');
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('항목을 선택해 근거와 초안을 검토하세요.');
  const row = rows.find(item => item.id === selected);
  const source = sources.find(item => item.id === row.evidence);
  const linked = rows.filter(item => item.evidence).length;
  const approved = rows.filter(item => item.state === '승인 시연').length;
  const missing = rows.filter(item => !item.evidence);
  function change(patch) {
    setRows(items => items.map(item => item.id === selected ? { ...item, ...patch, state: '편집 중' } : item));
    setMessage('변경 사항은 현재 화면에만 유지됩니다. 수정 후 다시 검토해야 합니다.');
  }
  function transition(state) {
    setRows(items => items.map(item => item.id === selected ? { ...item, state } : item));
    setHistory(items => [{ id: items.length + 1, requirement: selected, state, snapshot: row.draft, evidence: source?.name || '없음' }, ...items]);
    setMessage(`${selected}: ${state}. 실제 승인이나 서버 저장은 수행되지 않았습니다.`);
  }
  return <Frame title="제안요청서 AX" subtitle="근거를 따라 작성하고, 확인한 항목만 다음 단계로 이동합니다." links={[["materials","자료 목록"],["matrix","요구사항 추적"],["editor","초안 편집"],["review","검토 이력"]]}>
    <p><Badge>합성 프로젝트 AX-DEMO-01</Badge> <Badge tone="warn">AI 작성·문서 파싱 비활성</Badge></p>
    <div className="metrics"><Metric label="근거 연결률" value={`${Math.round(linked / rows.length * 100)}%`}><progress max={rows.length} value={linked} aria-label="근거 연결률"/></Metric><Metric label="요구사항" value={`${rows.length}개`}/><Metric label="누락 증빙" value={`${missing.length}개`}/><Metric label="승인 시연" value={`${approved} / ${rows.length}`}/></div>
    <section id="materials" className="panel"><h2>01 · 프로젝트 자료</h2><p className="muted">아래 파일명·위치·문구는 모두 합성 예시입니다. 실제 파일을 업로드하거나 읽지 않습니다.</p><div className="table-wrap"><table><caption>자료 목록 / 실제 첨부 없음</caption><thead><tr><th scope="col">자료명</th><th scope="col">분류</th><th scope="col">출처 위치</th></tr></thead><tbody>{sources.map(s=><tr key={s.id}><td>{s.name}</td><td>{s.kind}</td><td>{s.location}</td></tr>)}</tbody></table></div><div className="toolbar"><button disabled>실제 문서 업로드 · 미연결</button><button disabled>AI 초안 작성 · 비활성</button></div></section>
    <section id="matrix" className="panel"><h2>02 · 요구사항 추적 매트릭스</h2><div className="table-wrap"><table><caption>합성 배점 총 100점 · 근거 연결은 적합성 확인을 대신하지 않습니다.</caption><thead><tr><th scope="col">항목</th><th scope="col">배점</th><th scope="col">필수 증빙</th><th scope="col">요구사항 출처</th><th scope="col">근거 / 상태</th><th scope="col">선택</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{r.id}<br/>{r.title}</td><td>{r.points}점</td><td>{r.proof}</td><td>{r.origin}</td><td><Badge tone={!r.evidence || !r.confirmed ? 'warn' : 'ok'}>{!r.evidence ? '확인 필요 · 증빙 없음' : !r.confirmed ? '근거 적합성 확인 필요' : r.state}</Badge></td><td><button aria-pressed={selected===r.id} onClick={()=>{setSelected(r.id);setMessage(`${r.id} 항목을 선택했습니다.`);}}>편집</button></td></tr>)}</tbody></table></div></section>
    <div className="grid"><section id="editor" className="panel"><h2>03 · {row.id} {row.title}</h2><label htmlFor="evidence">근거 자료 연결</label><select id="evidence" value={row.evidence} onChange={e=>change({evidence:e.target.value,confirmed:false})}><option value="">연결 없음 · 확인 필요</option>{sources.filter(s=>s.id!=='s1').map(s=><option value={s.id} key={s.id}>{s.name}</option>)}</select>{source ? <div className="source"><strong>합성 근거 원문</strong><p>{source.text}</p><small>{source.name} · {source.location}</small></div> : <div className="notice">확인 필요: {row.proof}를 확보하고 사실·수치의 출처를 확인하세요.</div>}<label htmlFor="draft">사용자 편집 초안 · AI 생성 아님</label><textarea id="draft" value={row.draft} maxLength={5000} onChange={e=>change({draft:e.target.value,confirmed:false})}/><p className="muted">초안 전체를 연결 근거와 대조하세요. 임의로 추가한 문장·수치의 사실 여부는 자동 판별하지 않습니다.</p><label><input type="checkbox" checked={row.confirmed} disabled={!source || !row.draft.trim()} onChange={e=>change({confirmed:e.target.checked})}/> 모든 문장과 수치의 근거 적합성을 확인함 (합성 시연)</label><div className="toolbar"><button disabled={!source || !row.confirmed || !row.draft.trim()} onClick={()=>transition('검토 대기')}>검토 요청 시연</button><button className="primary" disabled={row.state!=='검토 대기' || !row.confirmed} onClick={()=>transition('승인 시연')}>승인 시연</button></div><p role="status">{message}</p></section>
    <aside className="panel"><h2>검토 필요 항목</h2>{rows.filter(r=>r.state!=='승인 시연').map(r=><div className="source" key={r.id}><strong>{r.id} · {r.title}</strong><p>{!r.evidence ? `누락: ${r.proof}` : !r.confirmed ? '연결된 근거가 초안의 모든 내용을 뒷받침하는지 확인 필요' : `현재 상태: ${r.state}`}</p></div>)}{approved===rows.length&&<p>모든 합성 항목의 승인 시연을 마쳤습니다.</p>}<h3>제출 전 확인</h3><p>실제 고객 문서, 출력 형식, 책임자 승인은 연결되지 않았습니다. 화면의 승인은 제출 승인 효력이 없습니다.</p><button disabled>DOCX / HWPX 내보내기 · 미구현</button></aside></div>
    <section id="review" className="panel"><h2>04 · 화면 내 검토 이력</h2><p className="muted">검토 시점의 합성 문구를 보존합니다. 서버 감사 로그·실제 사용자 식별·영구 버전 관리는 미구현입니다.</p>{history.length ? <ol className="history">{history.map(h=><li key={h.id}><strong>#{h.id} {h.requirement} · {h.state}</strong><p>근거: {h.evidence}</p><p>초안 스냅샷: {h.snapshot}</p></li>)}</ol> : <p className="empty">검토 요청이나 승인 시연 후 이력이 표시됩니다.</p>}</section>
  </Frame>;
}
