# ⚡ 빠른 시작 가이드

## 1️⃣ 로컬에서 실행하기 (5분)

### 1단계: 프로젝트 준비
```bash
# 압축 해제
tar -xzf landing-page.tar.gz
cd landing-page

# 의존성 설치
npm install
```

### 2단계: 카카오 키 설정
```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 수정
# VITE_KAKAO_JS_KEY=your_key_here
```

### 3단계: 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속!

---

## 2️⃣ Vercel에 배포하기 (3분) 🚀

### 방법 A: CLI 사용 (가장 빠름)

```bash
# Vercel CLI 설치 (처음 한 번만)
npm install -g vercel

# 로그인
vercel login

# 배포!
vercel --prod
```

끝! 🎉

### 방법 B: GitHub 연동

1. GitHub에 레포지토리 생성
2. 코드 푸시:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```
3. [Vercel](https://vercel.com)에서 Import
4. 배포 완료!

---

## 3️⃣ 카카오 로그인 설정 (5분) 🔐

### 1. 앱 생성
1. [Kakao Developers](https://developers.kakao.com/) 접속
2. '내 애플리케이션' > '애플리케이션 추가하기'
3. 앱 이름 입력 후 생성

### 2. 키 발급
1. 생성한 앱 선택
2. '앱 키' 메뉴에서 **JavaScript 키** 복사

### 3. 플랫폼 등록
1. '플랫폼' 메뉴
2. 'Web 플랫폼 등록'
3. 도메인 입력:
   - 로컬: `http://localhost:5173`
   - Vercel: `https://your-app.vercel.app`

### 4. Redirect URI
1. '카카오 로그인' 메뉴
2. '활성화 설정' ON
3. 'Redirect URI 등록':
   - 로컬: `http://localhost:5173/`
   - Vercel: `https://your-app.vercel.app/`

### 5. 환경 변수 설정

**로컬 (.env 파일):**
```env
VITE_KAKAO_JS_KEY=1234567890abcdef1234567890abcdef
```

**Vercel (대시보드):**
1. 프로젝트 > Settings > Environment Variables
2. `VITE_KAKAO_JS_KEY` 추가
3. 값 입력 후 Save
4. 재배포 (Deployments > Redeploy)

---

## 🎯 체크리스트

### 로컬 개발
- [ ] npm install 완료
- [ ] .env 파일 생성
- [ ] 카카오 키 입력
- [ ] npm run dev 실행
- [ ] 로그인 테스트

### Vercel 배포
- [ ] 배포 완료
- [ ] 도메인 확인
- [ ] 카카오 플랫폼에 도메인 추가
- [ ] 카카오 Redirect URI 추가
- [ ] Vercel 환경 변수 설정
- [ ] 재배포
- [ ] 프로덕션에서 로그인 테스트

---

## 🆘 문제 해결

### 카카오 SDK 에러
```
Cannot read property 'init' of undefined
```
→ 페이지 새로고침, 캐시 삭제

### Redirect URI mismatch
```
error: redirect_uri_mismatch
```
→ 카카오 개발자 콘솔에서 URI 확인 (HTTP/HTTPS, 마지막 / 포함 여부)

### 환경 변수가 안 보임
```
import.meta.env.VITE_KAKAO_JS_KEY is undefined
```
→ 변수명이 `VITE_`로 시작하는지 확인
→ 개발 서버 재시작

---

## 📚 더 자세한 가이드

- 카카오 로그인: `KAKAO_LOGIN_SETUP.md`
- Vercel 배포: `VERCEL_DEPLOYMENT.md`
- 전체 문서: `README.md`

---

## 🎉 완료!

이제 픽서치 랜딩 페이지가 준비되었습니다!

문의사항: biz@picketing.ai
