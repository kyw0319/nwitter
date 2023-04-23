import { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
} from 'firebase/firestore'; // const firestore = getFirestore(); 로 firebase 얻고 시작.
import { Button } from 'react-bootstrap'; //css!!!!!!!!!!!!

function Home(props) {
  const initializedApp = props.initializedApp;
  const db = getFirestore(initializedApp);
  //로그아웃 부분 시작
  const auth = props.auth;
  const setIsLoggedIn = props.setIsLoggedIn;
  const isLoggedIn = props.isLoggedIn; //user 정보 포함
  const [nweet, setNweet] = useState('');
  const [nweets, setNweets] = useState([]);
  async function getNweets() {
    const NweetsRef = collection(db, 'Nweets');
    const querySnapshot = await getDocs(NweetsRef); //db에 보낸 요청query에 대한 응답을 스냅샷한 결과.
    const anArray = [];
    console.log('querySnapshot!!!!!!!!(아래)');
    console.log(querySnapshot);
    querySnapshot.forEach((doc) => {
      console.log('doc.id : (아래)');
      console.log(doc.id);
      console.log('isLoggedIn : (아래)');
      console.log(isLoggedIn);
      const anObj = {
        ...doc.data(),
        nweetId: doc.id,
      };
      anArray.push(anObj);
    });
    setNweets(anArray);
  }
  useEffect(() => {
    console.log('라우팅 통과한 auth.currentUser 값');
    console.log(auth.currentUser);
    getNweets();
    const NweetsRef = collection(db, 'Nweets'); //여기부터 onSnapshot 리스너 추가코드.
    const q = query(NweetsRef);
    onSnapshot(q, (snapShot) => {
      //change이벤트리스너를 db에 추가하는 개념임.
      console.log('스냅샷 작동.');
      console.log(snapShot.docs);
    });
  }, []);
  function onLogOutClick() {
    auth.signOut().then(() => {
      setIsLoggedIn(null);
    });
    console.log('로그아웃.');
  }
  //로그아웃 부분 끝
  async function onSubmit(event) {
    event.preventDefault(); // 트윗 서밋!!!!!!!!!!!!!!!!!!!!!!!
    try {
      const docRef = await addDoc(collection(db, 'Nweets'), {
        creatorId: isLoggedIn.uid,
        creatorDisplayName: isLoggedIn.displayName,
        text: nweet,
        createdAt: Date.now(),
      });
      console.log('docRef : (아래)');
      console.log(docRef);
    } catch (error) {
      console.error('Error adding document: ', error); //에러 핸들링!
    }
    setNweet(''); // 이거를 어디에 놔야 입력텍스트가 스토어에 저장된 후에 렌더링이 될까>??????????????????????????????????????????????
  }
  function onChange(event) {
    setNweet(event.target.value);
    console.log(nweet);
  }
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
      <form onSubmit={onSubmit}>
        <input
          name="tweet"
          type="text"
          placeholder="What's on your mind?"
          value={nweet}
          onChange={onChange}
          maxLength={120}
        />
        <input type="submit" value="Nweet" />
      </form>
      <div>
        {nweets.map((nweet) => (
          <div key={nweet.nweetId}>
            <h3>{nweet.creatorDisplayName}</h3>
            <h4>{nweet.text}</h4>
          </div>
        ))}
      </div>
    </>
  );
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
    // 인증상태 지속성 설정하고 바로 팝업으로 로그인 시작.
    console.log('인증상태 지속성 설정하기 직전 auth.currentUser 값.');
    console.log(auth.currentUser);
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithPopup(auth, provider);
      })
      .then((result) => {
        //외부 제공업체로 로그인 시작.
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
        //상태 변경해서 리렌더링 유도.
        setIsLoggedIn(auth.currentUser);
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
  const initializedApp = props.initializedApp;
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
          <Route
            path="/"
            element={
              <Home
                initializedApp={initializedApp}
                auth={auth}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          />
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
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(auth.currentUser);
      }
    });
  }, []);

  console.log(
    '새로고침하고 state를 auth.currentUser로 초기화 함. 초기화에 쓰인 auth.currentUser 값'
  );
  console.log(auth.currentUser);

  return (
    <Routing
      initializedApp={app}
      auth={auth}
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
    />
  );
}

export default App;
