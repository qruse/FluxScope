<!-- Claude's draft checklist (AGENTS §7). Claude writes every article from research-claude.md, research-argon.md and
     research-codex.md. Rules live in AGENTS.md and editorial/QUALITY.md; list here only mistakes drafts actually repeated.
     Add a mistake when it recurs; drop it when it stops occurring. -->
# 쓰기 전에
- 최신 게시 글 한 편(`https://hslab.space/api/posts?lang=ko` 맨 위, `&slug=`로 ko·en)으로 문체와 구조를 맞춘다
- 세 조사 파일을 합치고, 엇갈리면 1차 출처를 직접 연다. 글쓴이 경험·의견은 사용자가 준 문장만 쓴다

# 본문 그림
- 형식을 섞는다 (10/23): 막대 차트는 최대 1장, 나머지는 타임라인·흐름도, 픽토그램·표 그림, 그리고 `source` 1장 이상(공식 문서·정부 자료·우리 프로젝트 페이지를 직접 캡처해 핵심만 자름, 강조는 "added by HSL"). 언론사·남의 사진은 쓰지 않음
- 글마다 Codex 일러스트 1장을 본문 중간에 넣는다 (10/26): codex.md에 `{{scene}}`·영어 라벨을 채워 조사와 함께 요청, `architecture`로 선언, 캡션은 짧은 그림 제목만
- 차트는 `chart_style_reference.py` 색·글꼴. 그린 뒤 직접 열어 확인
- 그림에 글자를 많이 넣지 않는다 (10/26 사용자 "그림에 텍스트가 너무 많음"): 제목 한 줄(6단어 안팎)과 항목당 1–4단어 라벨·숫자만. 부제, 항목별 설명 문장, 출처·각주 줄은 그림에 넣지 말고 캡션과 본문으로. 표 그림은 2열 정도. `source` 캡처는 강조할 한두 줄과 문서 제목만 자르고 위아래 설명 글자는 넣지 않음. Codex 일러스트는 예외로 그대로 둠

# 지난 초안들이 반복한 실수
- 불릿 하나에 두세 문장, 또는 "~했는데, ~이고, ~했음"으로 이어 붙인 긴 한 문장. 불릿 하나엔 사실 하나와 링크 1–2개, 한국어 70자 안팎(링크 제외) (10/23 사용자 "문장이 길다")
- 글쓴이가 하지 않은 의견·구매·사용 경험을 지어내기 ("내 기준엔 …를 고르겠음", "…를 샀는데")
- 출처가 '시장 해설'이라고 한 걸 기관의 판단처럼 쓰기, 몇 주 전 사건을 '방아쇠'라고 단정하기
- 비교 단위 섞기(서비스끼리 비교하는데 모델명 라벨 등), 질문과 무관한 제품 자랑
- 표의 다른 줄 숫자 가져오기, 문서가 특정 조건에서만 말한 기능을 일반화하기
- 옵션·플래그 설명 같은 설정 잡담, 링크에 `?authuser=` 같은 추적·계정 파라미터 남기기
- 그림 내용이 실제 과정·역할과 다름
- Q&A를 `###` 제목으로 쓰기 (`- **Q. …?**` + 들여쓴 답)

# 끝내기 전에
`publish-post.mjs en ko --dry-run`이 `✔ validation passed`, 리뷰 기록에 실제로 한 확인과 남은 한계, 보조 AI가 틀린 점과 소요 시간
