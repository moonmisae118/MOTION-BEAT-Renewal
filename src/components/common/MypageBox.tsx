import React, { useState } from 'react';
import styled from 'styled-components';
import mypageBoxImg from '../../assets/img/lobby/mypageBox.png';
import mypageFavorite from '../../assets/img/lobby/mypageFavorite.png';
import mypageLiBox from '../../assets/img/lobby/mypageLiBox.png';
import mypageRecently from '../../assets/img/lobby/mypageRecently.png';
import mypageTitle from '../../assets/img/lobby/mypageTitle.png';

interface Song {
  title: string;
  artist: string;
  difficulty: string;
}

const MypageBox: React.FC = () => {
  const backendUrl = import.meta.env.REACT_APP_BACK_API_URL;
  const myNickname = sessionStorage.getItem('nickname');

  const [favoriteSongList, setFavoriteSongList] = useState<Song[]>([]);
  const [recentSongList, setRecentSongList] = useState<Song[]>([]);
  const [activeTab, setActiveTab] = useState<'favorite' | 'recent'>('favorite');

  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(`${backendUrl}/api/songs/${activeTab}`, {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
  //           UserId: sessionStorage.getItem('userId')!,
  //           Nickname: sessionStorage.getItem('nickname')!,
  //         },
  //       });

  //       if (activeTab === 'favorite') {
  //         setFavoriteSongList(response.data);
  //       } else if (activeTab === 'recent') {
  //         setRecentSongList(response.data.recentlyPlayed);
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch song data:', error);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchData();
  //   }, [activeTab]);

  const handleClick = (tab: 'favorite' | 'recent') => {
    setActiveTab(tab);
  };

  return (
    <Wrapper>
      <Nickname>
        <p>{myNickname}</p>
      </Nickname>

      <MainBox>
        <FavoriteTitle onClick={() => handleClick('favorite')}>
          즐겨찾기 한 노래
        </FavoriteTitle>
        <Favorite zIndex={activeTab === 'favorite' ? 3 : 2}>
          {activeTab === 'favorite' && favoriteSongList.length > 0 && (
            <SongList>
              {favoriteSongList.map((song, index) => (
                <li key={index}>
                  <p>{song.title}</p>
                  <p>{song.artist}</p>
                  <p>{song.difficulty}</p>
                </li>
              ))}
            </SongList>
          )}
        </Favorite>

        <RecentlyTitle onClick={() => handleClick('recent')}>
          최근 플레이 한 노래
        </RecentlyTitle>
        <Recently zIndex={activeTab === 'recent' ? 3 : 2}>
          {activeTab === 'recent' && recentSongList.length > 0 && (
            <SongList>
              {recentSongList.map((song, index) => (
                <li key={index}>
                  <p>{song.title}</p>
                  <p>{song.artist}</p>
                  <p>{song.difficulty}</p>
                </li>
              ))}
            </SongList>
          )}
        </Recently>
      </MainBox>
    </Wrapper>
  );
};

export default MypageBox;

const Wrapper = styled.div`
  width: 594px;
  height: 748px;
  background-image: url('${mypageBoxImg}');
  border-radius: 20px;
  position: absolute;
  top: 50%;
  left: -1062%;
  z-index: 5;
  padding: 30px;
  color: white;
`;

const Nickname = styled.div`
  width: 522px;
  height: 56px;
  border-radius: 100px;
  background-image: url('${mypageTitle}');

  p {
    font-family: 'PretendardSemibold';
    font-size: 32px;
    margin-left: 35px;
    line-height: 1.5;
  }
`;

const MainBox = styled.div`
  width: 300px;
  height: 100px;
  border-radius: 26px;
  position: relative;
  margin-top: 60px;
`;

const Favorite = styled.div<{ zIndex: number }>`
  width: 522px;
  height: 485px;
  position: absolute;
  background-image: url('${mypageFavorite}');
  z-index: ${(props) => props.zIndex};
`;

const Recently = styled.div<{ zIndex: number }>`
  width: 522px;
  height: 485px;
  position: absolute;
  background-image: url('${mypageRecently}');
  z-index: ${(props) => props.zIndex};
`;

const FavoriteTitle = styled.span`
  font-family: 'PretendardMedium';
  font-size: 16px;
  position: absolute;
  left: 10%;
  top: 8%;
  z-index: 10;
`;

const RecentlyTitle = styled.span`
  font-family: 'PretendardMedium';
  font-size: 16px;
  margin-left: 30px;
  position: absolute;
  left: 43%;
  top: 8%;
  z-index: 10;
`;

const SongList = styled.ul`
  margin-top: 40px;
  font-size: 2rem;
  color: white;

  li {
    width: 458px;
    height: 130px;
    background-image: url('${mypageLiBox}');
    margin: 6%;
    list-style: none;
    padding-left: 20px;
  }
`;
