import { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
} from 'firebase/firestore'; // const firestore = getFirestore(); 로 firebase 얻고 시작.
import { Button } from 'react-bootstrap'; //css!!!!!!!!!!!!

function NweetBlock(props) {
  const initializedApp = props.initializedApp;
  const db = getFirestore(initializedApp);
  const isOwner = props.isOwner;
  const nweet = props.nweet;
  const docRef = doc(db, 'Nweets', nweet.nweetId); // doc의 id!!!!!!!!!!!!!!!
  const [editing, setEditting] = useState(false);
  const { register, handleSubmit } = useForm();
  async function onDeleteClick() {
    if (isOwner) {
      await deleteDoc(docRef);
    }
  }
  function toggleEdit() {
    setEditting((prev) => !prev);
  }
  function handleInputData(data) {
    updateDoc(docRef, { text: data.nweetEditInput });
    setEditting(false);
  }
  return (
    <div>
      <h3>{nweet.creatorDisplayName}</h3>
      {editing ? (
        <>
          <form onSubmit={handleSubmit(handleInputData)}>
            <input
              {...register('nweetEditInput')}
              defaultValue={nweet.text}
              placeholder="Edit your nweet."
              required
            />
            <input type="submit" value="Edit" />
          </form>
          <button onClick={toggleEdit}>Cancel</button>
        </>
      ) : (
        <h4>{nweet.text}</h4>
      )}
      {isOwner &&
        (editing || (
          <>
            <button onClick={onDeleteClick}>Delete</button>
            <button onClick={toggleEdit}>Edit</button>
          </>
        ))}
    </div>
  );
}

function Home(props) {
  const initializedApp = props.initializedApp;
  const db = getFirestore(initializedApp);
  //로그아웃 부분 시작
  const auth = props.auth;
  const setIsLoggedIn = props.setIsLoggedIn;
  const isLoggedIn = props.isLoggedIn; //user 정보 포함
  const { register, handleSubmit, reset } = useForm();
  const [nweets, setNweets] = useState([]); //서버에서 트윗들 받아오는 배열state
  useEffect(() => {
    // 새로고침 시 home 컴포넌트 로직
    const NweetsRef = collection(db, 'Nweets'); //여기부터 onSnapshot 리스너 추가코드.
    const q = query(NweetsRef, orderBy('createdAt', 'desc'));
    onSnapshot(q, (snapshot) => {
      //change이벤트리스너를 db에 추가하는 개념임 / 변화시 실핼할 콜백이 있음. 콜백이 받는 인자snapshot은 새로 변경된 콜렉션임.
      const anArray = [];
      snapshot.forEach((doc) => {
        const anObj = {
          ...doc.data(),
          nweetId: doc.id,
        };
        anArray.push(anObj);
      });
      setNweets(anArray);
    });
  }, []);
  function onLogOutClick() {
    //로그아웃부분
    auth.signOut().then(() => {
      setIsLoggedIn(null);
    });
  }
  async function handleInputData(data) {
    const text = data.nweetInput;
    reset();
    try {
      const docRef = await addDoc(collection(db, 'Nweets'), {
        creatorId: isLoggedIn.uid,
        creatorDisplayName: isLoggedIn.displayName,
        text: text,
        createdAt: Date.now(),
      });
    } catch (error) {
      console.error('Error adding document: ', error); //에러 핸들링!
    }
  }
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
      <form onSubmit={handleSubmit(handleInputData)}>
        <input
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
          {...register('nweetInput')}
        />
        <input type="submit" value="Nweet" />
      </form>
      <div>
        {nweets.map((nweet) => {
          console.log(`NweetsBlock의 key : ${nweet.nweetId}`);
          return (
            <NweetBlock
              key={nweet.nweetId}
              nweet={nweet}
              isOwner={nweet.creatorId === isLoggedIn.uid}
              initializedApp={initializedApp}
            />
          );
        })}
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
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithPopup(auth, provider);
      })
      .then((result) => {
        //외부 제공업체로 로그인 시작.
        // getRedirectResult(auth) 로 얻은 result에 있는 필요한 속성들을 참조.
        const credential = GoogleAuthProvider.credentialFromResult(result); //신용증명을 credential에 참조.
        const token = credential.accessToken; //신용증명안에 있는 accessToken을 token변수에 참조시킴. 엑세스 토큰을 얻음.
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
