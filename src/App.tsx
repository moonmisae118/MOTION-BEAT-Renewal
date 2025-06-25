// src/App.tsx
import React, { useEffect, useRef, useState } from 'react';
import { type RouteObject, useLocation, useRoutes } from 'react-router-dom';
import './App.css';

// import { GoogleCallback } from './apis/ggl';
// import { KakaoCallback } from './apis/kko';
// import AtomicTest from './components/common/atomic/atomicTest';
// import Playtype from './components/main/playtype';
// import Ranking from './components/main/ranking';
// import Settings from './components/main/settings';
// import Drum1 from './components/mediapipe/mediapipe';
// import AddSong from './pages/addSong';
// import Admin from './pages/admin';
// import ForgotPw from './pages/forgotPw';
// import Ingame from './pages/ingame';
// import IngameTuto from './pages/ingameTuto';
// import Main from './pages/lobby';
// import Login from './pages/login';
// import NotFound from './pages/notFound';
// import Room from './pages/room';
// import Signup from './pages/signup';
// import Tutorial from './pages/tutorial';

import MoveBg from './components/common/MoveBg';
import SoundManagerProvider from './components/common/UseSoundManager';
import Lobby from './pages/lobby';
import Login from './pages/login';
import Playtype from './pages/playType';
import Signup from './pages/signup';

const routeConfig: RouteObject[] = [
  { path: '/', element: <Login /> },
  { path: '/login', element: <Login /> },
  // { path: '/forgotPw', element: <ForgotPw /> },
  { path: '/signup', element: <Signup /> },
  { path: '/lobby', element: <Lobby /> },
  { path: '/lobby/playtype', element: <Playtype /> },
  // { path: '/main/tutorial', element: <Tutorial /> },
  // { path: '/main/ranking', element: <Ranking /> },
  // { path: '/main/setting', element: <Settings /> },
  // { path: '/room', element: <Room /> },
  // { path: '/ingame', element: <Ingame /> },
  // { path: '/ingameTuto', element: <IngameTuto /> },
  // { path: '/cam/drum', element: <Drum1 /> },
  // { path: '/atomic', element: <AtomicTest /> },
  // { path: '/admin', element: <Admin /> },
  // { path: '/addSong', element: <AddSong /> },
  // { path: '*', element: <NotFound /> },
];

const App: React.FC = () => (
  <SoundManagerProvider>
    <MoveBg />
    <AppContent />
  </SoundManagerProvider>
);

const AppContent: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [wasPlaying, setWasPlaying] = useState(false);
  const { pathname } = useLocation();

  // 페이지 애니메이션
  useEffect(() => {
    if (pathname !== '/main/playtype' && pageRef.current) {
      const el = pageRef.current;
      el.classList.add('animate_content');
      const tid = setTimeout(
        () => el.classList.remove('animate_content'),
        3200,
      );
      return () => clearTimeout(tid);
    }
  }, [pathname]);

  // 커서 커스텀
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const c = document.querySelector<HTMLElement>('.custom-cursor');
      if (c) {
        c.style.left = `${e.clientX}px`;
        c.style.top = `${e.clientY}px`;
      }
    };
    document.addEventListener('mousemove', move);
    return () => document.removeEventListener('mousemove', move);
  }, []);

  // 첫 상호작용 시 배경음 재생
  useEffect(() => {
    const playOnce = () => {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = 0.6;
        audio.play().catch(console.error);
      }
    };
    document.addEventListener('click', playOnce, { once: true });
    document.addEventListener('keydown', playOnce, { once: true });
    return () => {
      document.removeEventListener('click', playOnce);
      document.removeEventListener('keydown', playOnce);
    };
  }, []);

  // 특정 경로에서 오디오 일시정지/재개
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const pauseList = ['/room', '/ingame', '/main/tutorial'];
    if (pauseList.includes(pathname)) {
      setWasPlaying(!audio.paused);
      audio.pause();
    } else if (wasPlaying && audio.paused) {
      audio.play().catch(console.error);
      setWasPlaying(false);
    }
  }, [pathname, wasPlaying]);

  const routing = useRoutes(routeConfig);

  return (
    <div ref={pageRef} className="pageEvent">
      <audio ref={audioRef} src="/bgm/kneticSona.mp3" loop />
      <div className="custom-cursor" />
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.000001 0.000001"
              numOctaves={1}
              result="warp"
              seed={1}
            />
            <feDisplacementMap
              xChannelSelector="R"
              yChannelSelector="G"
              scale={30}
              in="SourceGraphic"
              in2="warp"
            />
          </filter>
        </defs>
      </svg>
      {routing}
    </div>
  );
};

export default App;
