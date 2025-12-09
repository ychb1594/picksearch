# 픽서치 랜딩 페이지

AI 설문조사 플랫폼 '픽서치'의 랜딩 페이지입니다.

## 주요 변경사항

- ✅ Base44 SDK 완전 제거
- ✅ 카카오톡 로그인 통합
- ✅ 독립적인 프론트엔드 구조
- ✅ 모든 불필요한 의존성 제거

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## Vercel 배포 🚀

가장 빠르고 쉬운 배포 방법입니다!

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

자세한 배포 가이드는 `VERCEL_DEPLOYMENT.md` 파일을 참고하세요.

## 카카오톡 로그인 설정

1. [Kakao Developers](https://developers.kakao.com/)에서 앱을 생성하세요
2. JavaScript 키를 발급받으세요
3. `src/pages/LandingPage.jsx` 파일에서 다음 부분을 수정하세요:

```javascript
window.Kakao.init('YOUR_KAKAO_JAVASCRIPT_KEY'); // 여기에 발급받은 키를 입력
```

4. Redirect URI를 설정하세요 (예: `http://localhost:5173/`)

## 기술 스택

- React 18
- Vite
- TailwindCSS
- Framer Motion
- Lucide React Icons
- Kakao JavaScript SDK

## 프로젝트 구조

```
├── src/
│   ├── components/
│   │   └── ui/           # UI 컴포넌트 (Button, Badge, Card)
│   ├── lib/
│   │   └── utils.js      # 유틸리티 함수
│   ├── pages/
│   │   └── LandingPage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 기능

- 📱 반응형 디자인 (모바일 최적화)
- 🎨 인터랙티브 애니메이션
- 🔐 카카오톡 소셜 로그인
- ⚡ 빠른 로딩 속도
- 🎯 실시간 데모 애니메이션

## 라이센스

© 2025 Pick Search. All rights reserved.
