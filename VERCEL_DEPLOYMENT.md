# Vercel 배포 가이드 🚀

픽서치 랜딩 페이지를 Vercel에 배포하는 방법입니다.

## 방법 1: GitHub 연동 (추천) ⭐

### 1. GitHub 레포지토리 생성

1. [GitHub](https://github.com) 접속 후 로그인
2. 우측 상단 `+` 버튼 > `New repository` 클릭
3. Repository 이름 입력 (예: `picksearch-landing`)
4. Public 또는 Private 선택
5. `Create repository` 클릭

### 2. 코드 업로드

터미널에서 실행:

```bash
# 프로젝트 폴더로 이동
cd landing-page

# Git 초기화
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: Landing page with Kakao login"

# GitHub 레포지토리 연결 (본인의 레포지토리 URL로 변경)
git remote add origin https://github.com/YOUR_USERNAME/picksearch-landing.git

# 푸시
git branch -M main
git push -u origin main
```

### 3. Vercel에서 배포

1. [Vercel](https://vercel.com) 접속
2. `Sign Up` 또는 `Log In` (GitHub 계정으로 로그인 추천)
3. `Add New...` > `Project` 클릭
4. GitHub 레포지토리 선택 (`picksearch-landing`)
5. `Import` 클릭
6. 프로젝트 설정:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
7. `Deploy` 클릭

### 4. 배포 완료! 🎉

- 몇 분 후 배포가 완료됩니다
- Vercel이 자동으로 도메인을 생성합니다 (예: `picksearch-landing.vercel.app`)
- 이후 GitHub에 푸시하면 자동으로 재배포됩니다

---

## 방법 2: Vercel CLI 사용

### 1. Vercel CLI 설치

```bash
npm install -g vercel
```

### 2. 로그인

```bash
vercel login
```

이메일 또는 GitHub 계정으로 로그인합니다.

### 3. 프로젝트 폴더로 이동

```bash
cd landing-page
```

### 4. 배포

```bash
# 첫 배포 (설정 진행)
vercel

# 프로덕션 배포
vercel --prod
```

### 5. 질문에 답변

```
? Set up and deploy "~/landing-page"? [Y/n] y
? Which scope do you want to deploy to? Your Account
? Link to existing project? [y/N] n
? What's your project's name? picksearch-landing
? In which directory is your code located? ./
? Want to override the settings? [y/N] n
```

### 6. 배포 완료!

터미널에 배포된 URL이 표시됩니다.

---

## 방법 3: 드래그 앤 드롭 배포

### 1. 빌드

```bash
cd landing-page
npm install
npm run build
```

`dist` 폴더가 생성됩니다.

### 2. Vercel에 드래그 앤 드롭

1. [Vercel](https://vercel.com) 접속 및 로그인
2. `Add New...` > `Project` 클릭
3. 하단 `Deploy without Git` 선택
4. `dist` 폴더를 드래그 앤 드롭
5. 프로젝트 이름 입력
6. `Deploy` 클릭

---

## 카카오 로그인 설정 업데이트 🔐

배포 후 Vercel에서 제공한 도메인으로 카카오 개발자 설정을 업데이트해야 합니다.

### 1. Vercel 도메인 확인

배포 완료 후 Vercel 대시보드에서 도메인을 확인합니다.
- 예: `https://picksearch-landing.vercel.app`

### 2. 카카오 개발자 콘솔 업데이트

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 앱 선택
3. **플랫폼 설정**:
   - 'Web 플랫폼 등록' 또는 기존 플랫폼 수정
   - 사이트 도메인: `https://picksearch-landing.vercel.app`
   
4. **Redirect URI 설정**:
   - 'Redirect URI 등록'
   - `https://picksearch-landing.vercel.app/` 추가

### 3. 테스트

1. Vercel 도메인으로 접속
2. 카카오 로그인 버튼 클릭
3. 정상 작동 확인

---

## 커스텀 도메인 설정 (선택사항) 🌐

### 1. Vercel 프로젝트 설정

1. Vercel 대시보드에서 프로젝트 선택
2. `Settings` > `Domains` 메뉴
3. `Add` 클릭
4. 도메인 입력 (예: `www.picksearch.com`)

### 2. DNS 설정

도메인 제공업체(가비아, 후이즈 등)에서:

#### A 레코드 설정:
```
Type: A
Name: @
Value: 76.76.21.21
```

#### CNAME 레코드 설정:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. 카카오 개발자 설정 업데이트

커스텀 도메인으로 플랫폼 및 Redirect URI를 업데이트합니다.

---

## 환경 변수 설정 (필요시) 🔧

### Vercel 대시보드에서 설정

1. 프로젝트 선택
2. `Settings` > `Environment Variables`
3. 변수 추가:
   - `VITE_KAKAO_JS_KEY`: 카카오 JavaScript 키
   - `VITE_API_URL`: 백엔드 API URL (나중에 추가 시)

### 코드에서 사용

```javascript
// vite.config.js 또는 코드에서
const kakaoKey = import.meta.env.VITE_KAKAO_JS_KEY;
```

---

## 자동 배포 설정 ✨

GitHub 연동 시 자동으로 설정됩니다:

- `main` 브랜치에 푸시 → 프로덕션 배포
- 다른 브랜치에 푸시 → 프리뷰 배포
- Pull Request 생성 → 프리뷰 배포

---

## 성능 최적화 팁 ⚡

### 1. 이미지 최적화

Vercel은 자동으로 이미지를 최적화합니다.

### 2. 빌드 캐싱

Vercel이 자동으로 처리합니다.

### 3. Edge Functions

필요시 Edge Functions를 사용하여 응답 속도를 개선할 수 있습니다.

---

## 문제 해결 🔍

### 빌드 실패

```bash
# 로컬에서 빌드 테스트
npm run build
```

에러 메시지를 확인하고 수정합니다.

### 404 에러

`vercel.json`에 리다이렉트 설정:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 카카오 로그인 실패

- Redirect URI가 정확한지 확인
- HTTPS 사용 여부 확인
- 도메인이 정확히 일치하는지 확인

---

## 유용한 Vercel 기능 💡

### 1. 프리뷰 배포

브랜치마다 독립적인 URL을 생성하여 테스트할 수 있습니다.

### 2. 롤백

이전 배포 버전으로 즉시 롤백 가능합니다.

### 3. 분석

Vercel Analytics로 방문자 통계를 확인할 수 있습니다.

### 4. 로그

실시간 로그를 확인하여 디버깅할 수 있습니다.

---

## 추가 리소스 📚

- [Vercel 공식 문서](https://vercel.com/docs)
- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html)
- [Vercel CLI 문서](https://vercel.com/docs/cli)

---

## 배포 체크리스트 ✅

- [ ] GitHub 레포지토리 생성
- [ ] 코드 푸시
- [ ] Vercel 프로젝트 생성
- [ ] 배포 확인
- [ ] 카카오 개발자 설정 업데이트
- [ ] 커스텀 도메인 설정 (선택)
- [ ] 환경 변수 설정 (필요시)
- [ ] 카카오 로그인 테스트
- [ ] 성능 확인

배포 완료! 🎉
