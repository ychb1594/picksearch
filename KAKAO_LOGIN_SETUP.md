# 카카오 로그인 설정 가이드

## 1. 카카오 개발자 계정 생성

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 카카오 계정으로 로그인
3. '내 애플리케이션' 메뉴로 이동

## 2. 애플리케이션 생성

1. '애플리케이션 추가하기' 클릭
2. 앱 이름 입력 (예: 픽서치)
3. 사업자명 입력
4. 생성 완료

## 3. JavaScript 키 발급

1. 생성한 앱 선택
2. '앱 키' 메뉴에서 **JavaScript 키** 복사
3. 예시: `1234567890abcdef1234567890abcdef`

## 4. 플랫폼 설정

1. '플랫폼' 메뉴 선택
2. 'Web 플랫폼 등록' 클릭
3. 사이트 도메인 등록:
   - 개발 환경: `http://localhost:5173`
   - 프로덕션 환경: 실제 도메인 (예: `https://yourdomain.com`)

## 5. Redirect URI 설정

1. '카카오 로그인' 메뉴 선택
2. '활성화 설정' ON
3. 'Redirect URI 등록' 클릭
4. URI 입력:
   - 개발 환경: `http://localhost:5173/`
   - 프로덕션 환경: `https://yourdomain.com/callback`

## 6. 코드에 적용

`src/pages/LandingPage.jsx` 파일 수정:

```javascript
// 7번째 줄 부근
const handleKakaoLogin = () => {
  if (window.Kakao && !window.Kakao.isInitialized()) {
    // 여기에 발급받은 JavaScript 키를 입력하세요
    window.Kakao.init('YOUR_KAKAO_JAVASCRIPT_KEY'); // ← 이 부분을 수정
  }
  // ...
}
```

**예시:**
```javascript
window.Kakao.init('1234567890abcdef1234567890abcdef');
```

## 7. 로그인 후 처리

카카오 로그인 성공 후 처리 로직을 추가하세요:

```javascript
window.Kakao.Auth.login({
  success: function(authObj) {
    console.log('카카오 로그인 성공', authObj);
    
    // 사용자 정보 가져오기
    window.Kakao.API.request({
      url: '/v2/user/me',
      success: function(response) {
        console.log('사용자 정보:', response);
        
        // 여기서 백엔드 서버로 토큰을 전송하거나
        // 사용자 정보를 저장하는 로직을 추가하세요
        
        // 예시: 로컬 스토리지에 저장
        localStorage.setItem('kakao_user', JSON.stringify(response));
        
        // 예시: 다른 페이지로 리다이렉트
        // window.location.href = '/dashboard';
      },
      fail: function(error) {
        console.error('사용자 정보 가져오기 실패:', error);
      }
    });
  },
  fail: function(err) {
    console.error('카카오 로그인 실패', err);
    alert('로그인에 실패했습니다. 다시 시도해주세요.');
  }
});
```

## 8. 동의 항목 설정 (선택사항)

1. '카카오 로그인' > '동의항목' 메뉴
2. 필요한 정보 선택:
   - 프로필 정보 (닉네임, 프로필 이미지)
   - 카카오계정 (이메일)
   - 기타 필요한 항목
3. '설정 저장'

## 9. 테스트

1. 개발 서버 실행: `npm run dev`
2. 브라우저에서 `http://localhost:5173` 접속
3. '로그인' 또는 '카카오톡으로 시작하기' 버튼 클릭
4. 카카오 로그인 팝업에서 로그인 진행
5. 개발자 도구 콘솔에서 로그 확인

## 문제 해결

### "Kakao is not defined" 오류
- `index.html`에 카카오 SDK가 제대로 로드되었는지 확인
- 페이지가 완전히 로드된 후 함수를 호출하는지 확인

### "Invalid client" 오류
- JavaScript 키가 정확한지 확인
- 플랫폼 도메인 설정이 올바른지 확인

### "Redirect URI mismatch" 오류
- Redirect URI가 정확히 일치하는지 확인
- HTTP/HTTPS 프로토콜이 일치하는지 확인

## 추가 리소스

- [카카오 로그인 가이드](https://developers.kakao.com/docs/latest/ko/kakaologin/common)
- [카카오 JavaScript SDK](https://developers.kakao.com/docs/latest/ko/javascript/getting-started)
- [카카오 개발자 포럼](https://devtalk.kakao.com/)
