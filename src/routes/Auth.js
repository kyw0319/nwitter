import React from 'react';
import { getAuth, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';

function Auth() {
  const provider = new GoogleAuthProvider(); // Google이 제공한는 개체를 생성합니다. (공식문서 : Google 제공업체 객체의 인스턴스를 생성합니다.)
  const auth = getAuth();

  signInWithRedirect(auth, provider);

  return <div>Auth</div>;
}
export default Auth;
