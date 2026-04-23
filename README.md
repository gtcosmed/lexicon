# GT-CnT Website

> **AIの速度に、人間の責任を加える。**  
> 한일 비즈니스 번역·통역 서비스 공식 웹사이트

---

## 개요 / Overview

GT-CnT(Guaranteed Translation — Connect next Trust)의 공식 웹사이트입니다.  
**한국어 / 日本語** 언어 전환을 지원하는 정적(static) 사이트입니다.

---

## 기능 / Features

- 🌐 **한국어 ↔ 日本語 언어 전환** — 상단 내비게이션에서 즉시 전환, 선택값 로컬 저장
- 📱 **반응형 디자인** — 모바일 / 태블릿 / 데스크톱 완전 대응
- 📋 **번역·통역 문의 폼** — 방향 선택, 분야 선택, 글자수 카운터 포함
- ✅ **스크롤 애니메이션** — Intersection Observer 기반 페이드업 효과
- ⚡ **외부 의존성 없음** — Vanilla JS, CSS 변수, Google Fonts만 사용

---

## 폴더 구조 / Project Structure

```
gt-cnt-website/
├── index.html          # 메인 페이지 (한/일 이중언어)
├── css/
│   └── style.css       # 전체 스타일시트
├── js/
│   └── main.js         # 언어 전환 + 인터랙션 로직
├── assets/             # 이미지, 아이콘 등 정적 자산 (필요 시 추가)
└── README.md
```

---

## 실행 방법 / Getting Started

별도 빌드 도구 없이 바로 열 수 있습니다.

```bash
# 1. 저장소 클론
git clone https://github.com/your-username/gt-cnt-website.git
cd gt-cnt-website

# 2. 로컬 서버 실행 (아무 방법이나 가능)
npx serve .
# 또는
python3 -m http.server 8080
# 또는 VS Code의 Live Server 확장 사용
```

브라우저에서 `http://localhost:8080` 접속.

---

## GitHub Pages 배포 / Deploy to GitHub Pages

1. GitHub에 저장소 생성 후 push
2. **Settings → Pages → Source**: `main` 브랜치, `/ (root)` 선택
3. 저장 후 `https://your-username.github.io/gt-cnt-website/` 에서 확인

---

## 커스터마이징 / Customization

| 항목 | 위치 |
|------|------|
| 브랜드 색상 | `css/style.css` — `:root` CSS 변수 |
| 한국어 텍스트 | `index.html` — `data-ko` 속성 |
| 일본어 텍스트 | `index.html` — `data-ja` 속성 |
| 연락처 정보 | `index.html` — footer & consult 섹션 |
| 서비스 항목 | `index.html` — `#services` 섹션 |

---

## 기술 스택 / Tech Stack

- **HTML5** — 시멘틱 마크업
- **CSS3** — CSS 변수, Flexbox, Grid, 애니메이션
- **Vanilla JavaScript** — 빌드 도구 불필요
- **Google Fonts** — Noto Sans KR / JP, Noto Serif KR / JP

---

## 라이선스 / License

© 2025 GT-CnT. All rights reserved.
