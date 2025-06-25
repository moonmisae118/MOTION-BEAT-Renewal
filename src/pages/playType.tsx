import axios from 'axios';
import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import friendPlay from '../assets/img/lobby/friendPlay.png';
import randomPlay from '../assets/img/lobby/randomPlay.png';
import PopupRectangle from '../assets/img/popupRectangle.png';
import StartGameBtn from '../assets/img/startGameBtn.png';
import MainHeader from '../components/common/MainHeader.js';
import { useAudio } from '../components/common/UseSoundManager.js';

interface RoomResponse {
  code: string;
  [key: string]: any;
}

const Playtype: React.FC = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.REACT_APP_BACK_API_URL;
  const [code, setCode] = useState<string>('');
  const myNickname = sessionStorage.getItem('nickname') ?? '';
  const [playFriends, setPlayFriends] = useState<boolean>(true);
  const [isRoomAvailable, setIsRoomAvaliable] = useState<boolean>(true);
  const { playNormalSFX } = useAudio();

  const handleClickSound = () => {
    playNormalSFX('start.mp3', { volume: 1 });
  };

  const handleMatchingClick = async () => {
    handleClickSound();
    try {
      const response = await axios.post<RoomResponse>(
        `${backendUrl}/api/rooms/match`,
        { type: 'match' },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
            UserId: sessionStorage.getItem('userId') ?? '',
            Nickname: sessionStorage.getItem('nickname') ?? '',
          },
        },
      );

      const joinRoomData = {
        nickname: myNickname,
        code: response.data.code,
      };

      //   socket.emit('joinRoom', joinRoomData);
      navigate('/room', { state: { roomData: response.data } });
    } catch (error) {
      console.error('Error random room', error);
    }
  };

  const handlePlayFriendsClick = () => {
    setPlayFriends(!playFriends);
  };

  const handleDevClick = () => {
    setIsRoomAvaliable(!isRoomAvailable);
  };

  const inRoom = async () => {
    handleClickSound();
    try {
      const response = await axios.post<RoomResponse>(
        `${backendUrl}/api/rooms/create`,
        { type: 'codeGame' },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
            UserId: sessionStorage.getItem('userId') ?? '',
            Nickname: sessionStorage.getItem('nickname') ?? '',
          },
        },
      );

      const joinRoomData = {
        nickname: myNickname,
        code: response.data.code,
      };

      //   socket.emit('joinRoom', joinRoomData);
      navigate('/room', { state: { roomData: response.data } });
    } catch (error) {
      console.error('Error in Room:', error);
    }
  };

  const goRoom = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleClickSound();
    try {
      const response = await axios.patch<RoomResponse>(
        `${backendUrl}/api/rooms/join/${code}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
            UserId: sessionStorage.getItem('userId') ?? '',
            Nickname: sessionStorage.getItem('nickname') ?? '',
          },
        },
      );

      const joinRoomData = {
        nickname: myNickname,
        code: response.data.code,
      };

      //   socket.emit('joinRoom', joinRoomData);
      navigate('/room', { state: { roomData: response.data } });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const message = error.response.data?.message;
        alert(message);
      } else {
        console.error('Error go Room:', error);
      }
    }
  };

  return (
    <>
      <MainHeader roomName="PLAY" />
      {playFriends ? (
        <GameTypeBox>
          <GameType onClick={handleMatchingClick}>
            <h1>랜덤 매칭</h1>
            <div>
              <img src={randomPlay} alt="랜덤 매칭" />
            </div>
          </GameType>
          <GameType onClick={handlePlayFriendsClick}>
            <h1>친구와 함께하기</h1>
            <div>
              <img src={friendPlay} alt="친구와 함께하기" />
            </div>
          </GameType>
        </GameTypeBox>
      ) : (
        <GameTypeBox>
          <GameType>
            <h1>방 만들기</h1>
            <BtnBtn onClick={inRoom}>생성</BtnBtn>
          </GameType>
          <RoomType>
            <h1>방 참여하기</h1>
            <form onSubmit={goRoom}>
              <JoinCode>
                <input
                  type="text"
                  placeholder="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </JoinCode>
              <BtnBtn type="submit">입장</BtnBtn>
            </form>
          </RoomType>
        </GameTypeBox>
      )}
    </>
  );
};

export default Playtype;

const GameTypeBox = styled.div`
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
`;

const GameType = styled.div`
  width: 457px;
  height: 486px;
  background-image: url('${PopupRectangle}');
  margin: 0 20px;
  text-align: center;

  &:hover {
    border: 7.5px solid rgb(252, 228, 250);
    border-radius: 30px;
    box-shadow: 0 0 30px 10px rgb(255, 255, 255);
  }

  h1 {
    font-size: 50px;
    font-family: 'Pretendard';
    color: white;
    margin-top: 60px;
  }

  div {
    width: 230px;
    height: 230px;
    margin: 50px auto;
  }

  button {
    margin-top: 210px;
  }
`;

const RoomType = styled.div`
  width: 457px;
  height: 486px;
  background-image: url('${PopupRectangle}');
  margin: 0 20px;
  text-align: center;

  h1 {
    font-size: 50px;
    font-family: 'Pretendard';
    color: white;
    margin-top: 60px;
  }
`;

const BtnBtn = styled.button`
  width: 397px;
  height: 100px;
  background-image: url('${StartGameBtn}');
  color: white;
  font-size: 50px;
  border-radius: 32px;
  font-family: 'Pretendard';
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
  border: none;

  &:before {
    content: '';
    background-color: rgba(255, 255, 255, 0.5);
    height: 100%;
    width: 3em;
    display: block;
    position: absolute;
    top: 0;
    left: -4.5em;
    transform: skewX(-45deg) translateX(0);
    transition: none;
  }

  &:hover:before {
    transform: skewX(-45deg) translateX(13em);
    transition: all 0.5s ease-in-out;
  }
`;

const JoinCode = styled.div`
  width: 396px;
  height: 70px;
  border-radius: 100px;
  background-color: rgba(0, 0, 0, 0.5);
  border: 1px solid #ffffff;
  margin: 70px auto;

  input {
    width: 90%;
    font-family: 'Pretendard';
    font-weight: bold;
    font-size: 32px;
    color: white;
    border: none;
    background-color: transparent;
    outline: none;
    text-align: center;
    line-height: 1.9;
  }
`;
