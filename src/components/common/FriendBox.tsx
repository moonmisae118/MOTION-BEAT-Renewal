import React, { useState } from 'react';
import styled from 'styled-components';
import FriendBoxUI from '../../assets/img/lobby/friendBox.png';
import FriendOne from '../../assets/img/lobby/friendOne.png';
import Plus from '../../assets/img/lobby/plus.png';

interface Friend {
  nickname: string;
  online: boolean;
}

const FriendBox: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);

  const dummyCode = () => {
    setFriends;
  };

  return (
    <Wrapper>
      <Header>
        <span>친구</span>
        <img src={Plus} alt="플러스" />
      </Header>
      <Body>
        <List onClick={dummyCode}>
          {friends.map((friend) => (
            <ListItem key={friend.nickname}>
              <div>{friend.nickname}</div>
              {friend.online ? <p>🟢 온라인</p> : <p>🔴 오프라인</p>}
            </ListItem>
          ))}
        </List>
      </Body>
    </Wrapper>
  );
};

export default FriendBox;

const Wrapper = styled.div`
  width: 420px;
  height: 602px;
  padding: 30px;
  background-image: url('${FriendBoxUI}');
  background-repeat: no-repeat;
  background-size: cover;
  color: white;
  font-family: 'LexendMega';
  position: absolute;
  left: -295%;
  top: 105%;
  z-index: 5;
`;

const Header = styled.div`
  width: 360px;
  display: flex;
  justify-content: space-between;
  margin: 10px 0 30px 0;

  span {
    font-size: 20px;
    font-weight: 400;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

const Body = styled.div`
  width: 380px;
  position: absolute;
  right: 10px;
`;

const List = styled.ul`
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  width: 356px;
  height: 100px;
  display: flex;
  justify-content: space-between;
  background-image: url('${FriendOne});
  background-repeat: no-repeat;
  background-size: cover;
  padding: 20px;
  font-weight: 400;
  margin-bottom: 20px;
  list-style: none;

  div {
    font-size: 22px;
    line-height: 2.7;
    font-family: 'Pretendard';
  }

  p {
    font-size: 18px;
    line-height: 3.3;
  }
`;
