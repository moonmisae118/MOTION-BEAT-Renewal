import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import RoomTitle from '../../assets/img/divBox/roomTitle.png';
import HeaderBtn from './HeaderBtn';

interface MainHeaderProps {
  roomName?: string;
}

const MainHeader: React.FC<MainHeaderProps> = ({ roomName }) => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate('/lobby');
  };

  return (
    <AllHeaderWrapper>
      <ExitRoomBtn
        style={{ visibility: roomName ? 'visible' : 'hidden' }}
        onClick={goBack}
      >
        나가기
      </ExitRoomBtn>
      <AllTitle style={{ visibility: roomName ? 'visible' : 'hidden' }}>
        {roomName}
      </AllTitle>
      <HeaderBtn />
    </AllHeaderWrapper>
  );
};

export default MainHeader;

const AllHeaderWrapper = styled.div`
  display: flex;
  position: relative;
  width: 90%;
  max-width: 1504px;
  margin: 5% auto 0 auto;
`;

const ExitRoomBtn = styled.button`
  margin: 20px 0;
  width: 205px;
  height: 62px;
  background-color: #47b5b4;
  color: white;
  font-size: 32px;
  font-weight: bold;
  border-radius: 16px;
  border: 1px solid #35383f;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    box-shadow: inset 0px 3px 5px rgba(0, 0, 0, 0.5);
    transform: translateY(2px);
  }
`;

const AllTitle = styled.h1`
  text-align: center;
  margin: 0 auto;
  width: 618px;
  height: 100px;
  background-image: url('${RoomTitle}');
  background-size: cover;
  background-position: center;
  color: white;
  font-size: 50px;
  font-weight: bold;
  line-height: 1.9;
`;
