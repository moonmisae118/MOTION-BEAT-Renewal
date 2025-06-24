import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import FriendBtnNonClick from '../../assets/img/lobby/friendsBtn.png';
import FriendBtnClick from '../../assets/img/lobby/friendsBtnClick.png';
import MypageBtnNonClick from '../../assets/img/lobby/mypageBtn.png';
import MypageBtnClick from '../../assets/img/lobby/mypageBtnClick.png';
import FriendBox from './FriendBox';
import MypageBox from './MypageBox';

const HeaderBtn: React.FC = () => {
  const [openFriends, setOpenFriends] = useState<boolean>(false);
  const [openMypage, setOpenMypage] = useState<boolean>(false);

  const friendToggle = () => setOpenFriends((prev) => !prev);
  const myPageToggle = () => setOpenMypage((prev) => !prev);

  return (
    <BtnWrapper>
      <RelativeBox>
        <FriendsBtn $open={openFriends} onClick={friendToggle} />
        {openFriends && <FriendBox />}
      </RelativeBox>
      <RelativeBox>
        <MypageBtn $open={openMypage} onClick={myPageToggle} />
        {openMypage && <MypageBox />}
      </RelativeBox>
    </BtnWrapper>
  );
};

export default HeaderBtn;

const BtnWrapper = styled.div`
  display: flex;
`;

const RelativeBox = styled.div`
  position: relative;
`;

const btnBaseStyle = css`
  width: 90px;
  height: 90px;
  border-radius: 75px;
  background-repeat: no-repeat;
  background-size: cover;
  transition: 0.2s;
`;

const FriendsBtn = styled.div<{ $open: boolean }>`
  ${btnBaseStyle};
  margin-right: 20px;
  background-image: ${({ $open }) =>
    `url(${$open ? FriendBtnClick : FriendBtnNonClick})`};
`;

const MypageBtn = styled.div<{ $open: boolean }>`
  ${btnBaseStyle};
  background-image: ${({ $open }) =>
    `url(${$open ? MypageBtnClick : MypageBtnNonClick})`};
`;
