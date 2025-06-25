import axios from 'axios';
// import MainHeader from 'components/common/atomic/main/mainHeader.js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectMenu from '../components/lobby/SelectMenu';
// import Modal from '../components/modal';
import styled from 'styled-components';
import MainHeader from '../components/common/MainHeader';

const Lobby = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.REACT_APP_BACK_API_URL;

  //   const [isModalOpen, setModalOpen] = useState(false);
  //   const [currentElement, setCurrentElement] = useState(null);
  const [roomName, setRoomName] = useState('');

  const [tutorialStarted, setTutorialStarted] = useState(false); // 중복 방지

  //   const closeModal = () => {
  //     setModalOpen(false);
  //     setCurrentElement(null);
  //   };

  const goToPlay = () => {
    setRoomName('PLAY');
    navigate('/lobby/playtype');
  };

  const goToTutorial = async () => {
    if (tutorialStarted || sessionStorage.getItem('tutorialStarted') === 'true')
      return;
    setTutorialStarted(true);
    sessionStorage.setItem('tutorialStarted', 'true');

    try {
      const response = await axios.post(
        `${backendUrl}/api/rooms/tutorial`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
            UserId: sessionStorage.getItem('userId'),
            Nickname: sessionStorage.getItem('nickname'),
          },
          withCredentials: true,
        },
      );

      const roomData = response.data;
      setRoomName('Tutorial');
      navigate('/lobby/tutorial', { state: { roomData } });
    } catch (error) {
      console.error('튜토리얼 생성 실패:', error);
      setTutorialStarted(false);
      sessionStorage.removeItem('tutorialStarted');
    }
  };

  const goToRanking = () => {
    setRoomName('Rankings');
    navigate('/lobby/ranking');
  };

  const goToSettings = () => {
    setRoomName('Setting');
    navigate('/lobby/settings');
  };

  //   const logout = async () => {
  //     try {
  //       await axios.patch(
  //         `${backendUrl}/api/users/logout`,
  //         {},
  //         {
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
  //             UserId: sessionStorage.getItem('userId'),
  //             Nickname: sessionStorage.getItem('nickname'),
  //           },
  //         },
  //       );

  //       sessionStorage.clear();
  //       navigate('/login');
  //     } catch (error) {
  //       console.error('로그아웃 에러:', error);
  //     }
  //   };

  return (
    <>
      <MainHeader roomName={roomName} />
      {/* <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        children={currentElement}
      /> */}

      <div className="buttonContainer">
        <MainMenuWrapper>
          <SelectMenu mainMenu="PLAY" handleClick={goToPlay} />
          <SelectMenu mainMenu="TUTORIAL" handleClick={goToTutorial} />
          <SelectMenu mainMenu="RANKINGS" handleClick={goToRanking} />
          <SelectMenu mainMenu="SETTINGS" handleClick={goToSettings} />
        </MainMenuWrapper>
      </div>
    </>
  );
};

export default Lobby;

const MainMenuWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
