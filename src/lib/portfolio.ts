// Portfolio data compiled from the owner's CVs, shared by the portfolio page and its lab home entry.
// Never add the owner's real name, photo, phone, address, birth date, ID number or employer names.
import type { Lang } from '../i18n/ui';

export const portfolioEmail = 'coolwin200@gmail.com';

export function portfolio(lang: Lang) {
  const isKo = lang === 'ko';
  const L = (ko: string, en: string) => (isKo ? ko : en);

  const career = [
    { period: L('2024.12 — 현재', '2024.12 — now'), org: L('스마트팜 기업', 'Smart-farm company'), role: L('연구개발팀 선임연구원', 'Senior researcher, R&D team'), text: L('온실 환경 시계열 예측 모델(PatchTST)과 LLM Agent 기반 AI 컨설팅 리포트를 개발해 현장에 배포.', 'Built and shipped a greenhouse climate forecasting model (PatchTST) and LLM-agent consulting reports.') },
    { period: '2020.07 — 2024.11', org: L('AI 스타트업 공동창업', 'Co-founded AI startup'), role: L('데이터분석 팀장 · 기업부설연구소장', 'Data analysis lead · head of the corporate lab'), text: L('AI·빅데이터 분석 연구 총괄, 프로젝트 관리, 분석 실무, 백엔드 개발, 교육, 특허.', 'Led AI and data research, ran projects, did the analysis, built back ends, taught and filed a patent.') },
  ];

  const education = [
    { year: '2022', ko: '경영정보시스템 박사과정 수료', en: 'PhD coursework, Management Information Systems' },
    { year: '2020', ko: '경영정보시스템 석사', en: 'MS, Management Information Systems' },
    { year: '2018', ko: '경영학 학사', en: 'BBA' },
  ];

  type Domain = 'ts' | 'anomaly' | 'nlp' | 'data';
  const domains: { id: Domain; ko: string; en: string }[] = [
    { id: 'ts', ko: '시계열 예측', en: 'Forecasting' },
    { id: 'anomaly', ko: '이상 탐지', en: 'Anomaly detection' },
    { id: 'nlp', ko: '텍스트 · LLM', en: 'Text · LLM' },
    { id: 'data', ko: '데이터 분석', en: 'Data analysis' },
  ];
  const domainName = (id: Domain) => { const d = domains.find((x) => x.id === id)!; return isKo ? d.ko : d.en; };
  // `case` links a row to its write-up on the case-studies page (/portfolio/case-studies/#<case>).
  const work: { period: string; org: string; d: Domain; ko: string; en: string; case?: string }[] = [
    { period: '2025', org: L('스마트팜 기업', 'Smart-farm company'), d: 'nlp', ko: 'LLM Agent 기반 AI 컨설팅 리포트 생성', en: 'AI consulting reports written by LLM agents', case: 'report' },
    { period: '2025', org: L('스마트팜 기업', 'Smart-farm company'), d: 'ts', ko: 'AI 온실 환경 시계열 예측 모델 개발', en: 'Greenhouse climate forecasting model', case: 'greenhouse' },
    { period: '2024.06 – 2024.10', org: L('㈜오든', 'Oden'), d: 'anomaly', ko: '스마트부표 센서 바이오파울링 이상 탐지 시스템 개발', en: 'Biofouling anomaly detection for smart-buoy sensors' },
    { period: '2024.06 – 2024.07', org: L('대구디지털혁신진흥원', 'DIP'), d: 'data', ko: '지역 메가프로젝트 중복성 검토 사업 자문', en: 'Overlap review advisory for regional mega projects' },
    { period: '2023.07 – 2023.11', org: L('스마트팜 기업', 'Smart-farm company'), d: 'ts', ko: '스마트팜 온실 환경 시뮬레이션 시스템 개발', en: 'Greenhouse environment simulation for smart farms' },
    { period: '2023.06 – 2023.11', org: L('대구일보', 'Daegu Ilbo'), d: 'nlp', ko: 'LLM 기반 자동 기사 생성 프롬프트 엔지니어링', en: 'Prompt engineering for LLM-written news articles' },
    { period: '2022.08 –', org: 'KB', d: 'anomaly', ko: 'FDS(이상거래 탐지) 시스템 구축', en: 'Fraud detection system build' },
    { period: '2022.06 – 2022.10', org: L('㈜오든', 'Oden'), d: 'ts', ko: '스마트부표 수온 예측 시스템 개발 (데이터바우처)', en: 'Water-temperature forecasting for smart buoys (data voucher)' },
    { period: '2022.05 – 2022.07', org: L('대구디지털혁신진흥원', 'DIP'), d: 'data', ko: '대구시 3대 주력산업 정책보고서 분석', en: "Policy report on Daegu's three key industries" },
    { period: '2022.01 – 2022.03', org: 'KERIS', d: 'nlp', ko: '텍스트마이닝 프로젝트', en: 'Text mining project' },
    { period: '2020.06 – 2021.12', org: L('경북대학교 · DYETEC', 'KNU · DYETEC'), d: 'nlp', ko: '섬유소재 산업 빅데이터 플랫폼: 딥러닝 텍스트마이닝, 토픽모델링, 비즈니스 모델', en: 'Textile industry data platform: text mining, topic models, business models' },
    { period: '2021.02 – 2021.05', org: 'DYETEC', d: 'data', ko: '염가공 색채 예측 알고리즘 고도화', en: 'Better colour prediction for textile dyeing' },
    { period: '2020.11 – 2021.03', org: L('한국가스공사', 'KOGAS'), d: 'ts', ko: '에너지 사용량 예측 모델 고도화, 관련 알고리즘 연구', en: 'Energy-use forecasting model upgrade and algorithm research' },
    { period: '2020', org: L('노코멘트 API', 'Know Comment API'), d: 'nlp', ko: '악성 댓글 분류 API, 논문·특허로 이어짐', en: 'Abusive-comment classification API, which led to a paper and a patent' },
    { period: '2020.10 – 2020.12', org: L('한국건설기술연구원', 'KICT'), d: 'data', ko: '학습 데이터 수집·레이블링, 프로세스 관리', en: 'Training data collection, labelling and process management' },
    { period: '2020.07 – 2021.09', org: L('대구시설공단', 'Daegu Facilities Corp.'), d: 'data', ko: '나드리콜(교통약자 이동 지원) 운영 데이터 지리 분석·시각화', en: 'Geographic analysis of accessible-transport operations' },
    { period: '2019.03 – 2019.12', org: L('경북대학교', 'KNU'), d: 'data', ko: '빅데이터 분석·시각화 프로젝트와 보고서', en: 'Data analysis and visualization project with reports' },
  ];

  // Journal papers are KCI-indexed; `conf` marks a conference paper, which the KCI counts leave out.
  const papers: { date: string; venue: string; title: string; conf?: boolean }[] = [
    { date: '2024', venue: L('한국경영정보학회 추계학술대회', 'KMIS Fall Conference'), title: L('해양환경 예측을 위한 다중그룹 시계열 예측 AI 개발: 기상예보 데이터 결합 및 딥러닝 방법론 기반 해양 수온 예측', 'Multi-group time-series AI for ocean forecasting: sea-temperature prediction combining weather forecasts and deep learning'), conf: true },
    { date: '2023', venue: L('한국정보처리학회', 'KIPS'), title: L('EPC ITB 프로젝트의 위험관리를 위한 문서 조항 분류 모델 연구: 딥러닝 기반 앙상블 기법 활용', 'Clause classification for risk management in EPC ITB documents: a deep-learning ensemble approach') },
    { date: '2021', venue: L('정보시스템연구', 'The Journal of Information Systems'), title: L('섬유소재 분야 특허 기술 동향 분석: DETM & STM 텍스트마이닝 방법론 활용', 'Patent trends in textile materials with DETM and STM text mining') },
    { date: '2020', venue: L('한국정보통신학회', 'KIICE'), title: 'Bias & Hate Speech Detection Using Deep Learning: Multi-channel CNN Modeling with Attention' },
    { date: '2020', venue: L('정보시스템연구 29(3)', 'The Journal of Information Systems 29(3)'), title: L('하이웨이 네트워크 기반 CNN 모델링 및 사전 외 어휘 처리 기술을 활용한 악성 댓글 분류 연구', 'Abusive comment classification with highway-network CNNs and out-of-vocabulary handling') },
    { date: '2020', venue: L('정보시스템연구', 'The Journal of Information Systems'), title: 'LSTM-based Deep Learning for Time Series Forecasting: The Case of Corporate Credit Score Prediction' },
    { date: '2019', venue: L('인터넷전자상거래연구', 'The Journal of Internet Electronic Commerce Research'), title: 'Multi-phase Prediction Models for Crowdfunding Success: A Machine Learning Approach' },
  ];

  const awards = [
    { rank: L('AI 1위', 'AI 1st'), date: '2024', ko: 'Autonomous Greenhouse Challenge 4th Edition', en: 'Autonomous Greenhouse Challenge, 4th edition', note: L('본선 4위 · AI 부문 1위', '4th in the final · 1st for AI'), by: L('해외 대학 주최 국제 대회', 'International contest hosted by a university abroad'), top: true },
    { rank: L('1등', '1st'), date: '2022.09', ko: '스마트농업경진대회 해커톤', en: 'Smart Agriculture Hackathon', note: L('농림축산식품부 장관상', "Agriculture minister's award"), by: L('농림수산식품교육문화정보원', 'EPIS'), top: true },
    { rank: L('1등', '1st'), date: '2020.06', ko: '인공지능 경진대회 텍스트 분야', en: 'AI Competition, text track', note: L('400팀 중 종합 10위', '10th overall of 400 teams'), by: L('과학기술정보통신부', 'Ministry of Science and ICT'), top: true },
    { rank: L('2등', '2nd'), date: '2020.11', ko: 'AI CHAMPIONSHIP 2020', en: 'AI Championship 2020', note: L('대·스타 해결사 플랫폼', 'Big-and-startup solver platform'), by: L('중소벤처기업부', 'Ministry of SMEs and Startups') },
    { rank: L('루키', 'Rookie'), date: '2021.11', ko: '스타트업 어워즈', en: 'Startup Awards', note: L('회사 수상', 'Company award'), by: L('대구시', 'Daegu City') },
    { rank: L('최우수', 'Best'), date: '2019.05', ko: '최우수 논문상', en: 'Best paper award', note: L('시계열 딥러닝', 'Time-series deep learning'), by: L('한국정보시스템학회', 'KAIS') },
    { rank: L('최우수', 'Best'), date: '2018.11', ko: '최우수 논문상', en: 'Best paper award', note: L('정형 데이터 분석', 'Tabular data analysis'), by: L('한국정보시스템학회', 'KAIS') },
  ];

  const teaching: { date: string; org: string; ko: string; en: string; h?: number }[] = [
    { date: '2024', org: 'DIP', ko: '직무 리스킬링을 위한 데이터 리터러시·실무 딥러닝 분석', en: 'Data literacy and applied deep learning for reskilling' },
    { date: '2023.05 – 10', org: L('DIP · 대구은행', 'DIP · DGB'), ko: '금융 빅데이터 분석 교육', en: 'Financial data analysis course' },
    { date: '2022.08', org: L('영진직업전문학교', 'Yeungjin Vocational School'), ko: '인공지능 모델 배포', en: 'Deploying AI models' },
    { date: '2022.06 – 08', org: 'DIP', ko: '자동차 산업 AI 커리큘럼 개발·교육', en: 'AI curriculum for the automotive industry' },
    { date: '2022.05 – 09', org: L('섬유개발연구원', 'KTDI'), ko: '섬유소재 분야 인공지능 분석', en: 'AI analysis for textile materials', h: 113 },
    { date: '2022.03', org: L('영진직업전문학교', 'Yeungjin Vocational School'), ko: '인공지능 분석 실무', en: 'Applied AI analysis', h: 13 },
    { date: '2021.12 – 2022.01', org: L('라인평생원격교육원', 'LINE Lifelong Education'), ko: '빅데이터 분석 이론·실습 강의 촬영', en: 'Recorded course on data analysis', h: 40 },
    { date: '2021.12', org: 'DIP', ko: '인공지능 분석 실무자 양성', en: 'AI analyst training', h: 8 },
    { date: '2021.10 – 11', org: 'KERIS', ko: '빅데이터·인공지능 교재 280쪽 집필', en: '280-page data and AI textbook' },
    { date: '2021.09', org: 'DIP', ko: '라즈베리파이 AI 시스템 개발·탑재', en: 'AI on Raspberry Pi', h: 16 },
    { date: '2021.08', org: 'DIP', ko: '의료 이미지 분석', en: 'Medical image analysis', h: 8 },
    { date: '2021.08', org: L('경북대학교', 'KNU'), ko: '농업 분야 인공지능 활용 사례', en: 'AI in agriculture', h: 4 },
    { date: '2021.08', org: 'DIP', ko: '스마트팩토리 인공지능 시스템 개발', en: 'AI systems for smart factories', h: 16 },
    { date: '2021.08', org: 'DIP', ko: '도커 기반 LSTM 모델 텐서플로 서빙', en: 'Serving an LSTM with TensorFlow on Docker', h: 4 },
    { date: '2021.07', org: L('한국가스공사', 'KOGAS'), ko: '파이썬 기반 인공지능 시스템 개발', en: 'Building AI systems in Python', h: 40 },
    { date: '2021.07', org: L('계명대학교', 'Keimyung Univ.'), ko: '스마트팩토리 시스템 개발', en: 'Smart factory systems', h: 21 },
    { date: '2021.07', org: 'DIP', ko: 'Flask 기반 Python 서비스 배포', en: 'Deploying Python services with Flask', h: 4 },
    { date: '2021.06 – 07', org: L('영진사이버대학교', 'Yeungjin Cyber Univ.'), ko: '사례로 알아보는 빅데이터 활용 강의 촬영', en: 'Recorded course on data in practice', h: 11 },
    { date: '2021.06', org: 'DIP', ko: '금융 분야 사기 거래 탐지 시스템 개발', en: 'Building fraud detection for finance', h: 12 },
    { date: '2021.01', org: L('계명대학교', 'Keimyung Univ.'), ko: '빅데이터·인공지능 분석 특강', en: 'Data and AI lectures', h: 80 },
    { date: '2020.10', org: L('계명대학교', 'Keimyung Univ.'), ko: 'KAC 빅데이터 특강', en: 'KAC data science lectures', h: 80 },
  ];
  const hours = teaching.reduce((sum, t) => sum + (t.h ?? 0), 0);
  const longest = teaching.filter((t) => t.h).sort((a, b) => b.h! - a.h!).slice(0, 6);
  const maxHours = longest[0].h!;
  const barWidth = (h = 0) => `--w:${((h * 100) / maxHours).toFixed(1)}%`;

  const kci = papers.filter((p) => !p.conf).length;
  const stats = [
    { id: 'years', n: '6', s: '+', ko: '년차 실무', en: 'years in industry' },
    { id: 'projects', n: String(work.length), s: '', ko: '프로젝트', en: 'projects' },
    { id: 'papers', n: String(kci), s: '', ko: 'KCI 논문 · 특허 1', en: 'KCI papers · 1 patent' },
    { id: 'awards', n: String(awards.length), s: '', ko: '수상', en: 'awards' },
    { id: 'hours', n: String(hours), s: 'h+', ko: '강의', en: 'teaching' },
  ];

  const skills = [
    { ko: '모델링', en: 'Modelling', items: [L('시계열 예측', 'Forecasting'), 'Transformer (PatchTST)', L('이상 탐지', 'Anomaly detection'), L('정형 데이터', 'Tabular'), 'NLP · LLM Agent', L('비전', 'Vision'), 'XAI'] },
    { ko: '도구', en: 'Tools', items: ['Python', 'PyTorch', 'TensorFlow', 'XGBoost', 'LightGBM', 'LangGraph', 'OpenCV', 'KNIME'] },
    { ko: '배포', en: 'Shipping', items: ['Docker', 'Flask', 'NGINX', 'Linux', 'Raspberry Pi', 'Cloudflare Workers'] },
  ];


  return { career, education, domains, domainName, work, papers, kci, awards, teaching, hours, longest, barWidth, stats, skills };
}