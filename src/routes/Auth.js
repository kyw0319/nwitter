import React from 'react';
import {
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
} from 'firebase/auth';

import { auth } from 'fbase';

function Auth(props) {
  const isLoggedIn = props.isLoggedIn;
  const setIsLoggedIn = props.setIsLoggedIn;

  const provider = new GoogleAuthProvider();
  // Google이 제공하는 Provider 개체를 생성합니다. (공식문서 : Google 제공업체 객체의 인스턴스를 생성합니다.)

  //외부 제공업체로 로그인 시작.
  signInWithRedirect(auth, provider)
    .then((result) => {
      // getRedirectResult(auth) 로 얻은 result에 있는 필요한 속성들을 참조.
      const credential = GoogleAuthProvider.credentialFromResult(result); //신용증명을 credential에 참조.
      console.log('----credential----');
      console.log(credential);
      const token = credential.accessToken; //신용증명안에 있는 accessToken을 token변수에 참조시킴. 엑세스 토큰을 얻음.
      console.log('----token----');
      console.log(token);
      const user = result.user; //혹시모르니 유저 정보도 미리 참조시킴.
      //...
      setIsLoggedIn(true);
    })
    .catch((error) => {
      // 에러 핸들링

      const errorCode = error.code;
      const errorMessage = error.message;

      // The email of the user's account used. 왜 에러나지..
      // const email = error.customData.email;

      // 사용된 credential.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });

  return <div>Auth</div>;
}
export default Auth;
