import { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';

function Profile() {
  return <span>Profile</span>;
}

function Home(props) {
  const isLoggedIn = props.isLoggedIn;
  console.log('Home 컴포넌트에서 로깅');
  console.log(isLoggedIn);
  return <span>Home</span>;
}

function Editprofile() {
  return <span>Edit Profile</span>;
}

function Auth(props) {
  const auth = props.auth;
  const setIsLoggedIn = props.setIsLoggedIn;

  const provider = new GoogleAuthProvider();
  // Google이 제공하는 Provider 개체를 생성합니다. (공식문서 : Google 제공업체 객체의 인스턴스를 생성합니다.)

  function onGoogleClick() {
    //외부 제공업체로 로그인 시작.
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('----리다이렉트로 로그인하기 결과 받음----');
        console.log(result);
        // getRedirectResult(auth) 로 얻은 result에 있는 필요한 속성들을 참조.
        const credential = GoogleAuthProvider.credentialFromResult(result); //신용증명을 credential에 참조.
        console.log('----credential----');
        console.log(credential);
        const token = credential.accessToken; //신용증명안에 있는 accessToken을 token변수에 참조시킴. 엑세스 토큰을 얻음.
        console.log('----token----');
        console.log(token);
        const user = result.user; //혹시모르니 유저 정보도 미리 참조시킴.
        //...
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
  }

  return (
    <div>
      <button onClick={onGoogleClick}>Continue With Google</button>
    </div>
  );
}

function Routing(props) {
  const auth = props.auth;
  const isLoggedIn = props.isLoggedIn;
  const setIsLoggedIn = props.setIsLoggedIn;
  return (
    <Router>
      <Routes>
        {isLoggedIn === null ? (
          <Route
            path="/"
            element={<Auth auth={auth} setIsLoggedIn={setIsLoggedIn} />}
          />
        ) : (
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        )}
      </Routes>
    </Router>
  );
}

function App() {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: 'AIzaSyAXicknB-yFhmLb9DV-zmEOsGZzf9rMNmg',
    authDomain: 'localsns-4963b.firebaseapp.com',
    projectId: 'localsns-4963b',
    storageBucket: 'localsns-4963b.appspot.com',
    messagingSenderId: '197322686315',
    appId: '1:197322686315:web:8ae865d88d7da1d6dfd62e',
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser);

  return (
    <Routing
      auth={auth}
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
    />
  );
}

export default App;
