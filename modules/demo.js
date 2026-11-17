// 전부 창작된 합성 자료입니다. 실제 파일은 존재하지 않습니다.
export const sources = [
  { id: 's1', name: '[합성] 사업 안내.pdf', location: '3쪽 · 운영 목표', text: '교육 프로그램의 운영 절차와 품질 관리 방법을 제안한다.', kind: '요구사항 예시' },
  { id: 's2', name: '[합성] 승인 자료 예시.docx', location: '2쪽 · 운영 체계 / 문단 1', text: '샘플 운영 체계는 준비, 실행, 결과 검토의 세 단계로 구성한다.', kind: '회사 승인 자료 역할 예시' },
  { id: 's3', name: '[합성] 일정 예시.xlsx', location: '일정 시트 · A2:B4', text: '착수 협의 후 상세 일정과 담당 업무를 확정한다.', kind: '회사 승인 자료 역할 예시' },
];
export const initialRequirements = [
  { id: 'R-01', title: '사업 운영 체계', points: 30, proof: '운영 절차와 담당 업무표', origin: '[합성] 사업 안내.pdf · 3쪽', evidence: 's2', draft: '샘플 운영 체계는 준비, 실행, 결과 검토의 세 단계로 구성한다.', state: '편집 중', confirmed: false },
  { id: 'R-02', title: '수행 실적 및 증빙', points: 40, proof: '승인된 실적증명서', origin: '[합성] 사업 안내.pdf · 4쪽', evidence: '', draft: '확인 필요: 승인된 유사 실적과 실적증명서가 없습니다. 담당자에게 자료를 요청하세요.', state: '편집 중', confirmed: false },
  { id: 'R-03', title: '수행 일정', points: 30, proof: '승인된 세부 일정표', origin: '[합성] 사업 안내.pdf · 5쪽', evidence: 's3', draft: '착수 협의 후 상세 일정과 담당 업무를 확정한다.', state: '편집 중', confirmed: false },
];
