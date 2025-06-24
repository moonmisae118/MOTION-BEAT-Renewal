import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import SelectBar from '../../assets/img/lobby/selectBar.png';

interface SelectMenuProps {
  mainMenu: string;
  handleClick: (menu: string) => void;
}

const SelectMenu: React.FC<SelectMenuProps> = ({ mainMenu, handleClick }) => {
  const hoverEffectAudioRef = useRef<HTMLAudioElement | null>(null);
  const clickEffectAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    hoverEffectAudioRef.current?.load();
    clickEffectAudioRef.current?.load();
  }, []);

  const handleMouseEnter = () => {
    const audio = hoverEffectAudioRef.current;
    if (audio) {
      audio.volume = 1;
      audio.play().catch((error) => {
        console.error('Error playing hover audio:', error);
      });
    }
  };

  const handleClickMenu = () => {
    const audio = clickEffectAudioRef.current;
    if (audio) {
      audio.volume = 1;
      audio.play().catch((error) => {
        console.error('Error playing click audio:', error);
      });
    }

    setTimeout(() => {
      handleClick(mainMenu);
    }, 300);
  };

  return (
    <>
      <audio ref={hoverEffectAudioRef} src="/keySound/system/menuHover.mp3" />
      <audio ref={clickEffectAudioRef} src="/keySound/system/start.mp3" />
      <SelectMenuWrapper
        onMouseEnter={handleMouseEnter}
        onClick={handleClickMenu}
      >
        <SelectBars>
          <img src={SelectBar} alt="왼쪽 테두리" />
        </SelectBars>
        <SelectCategory>
          <span>{mainMenu}</span>
        </SelectCategory>
        <SelectBars>
          <img src={SelectBar} alt="오른쪽 테두리" />
        </SelectBars>
      </SelectMenuWrapper>
    </>
  );
};

export default SelectMenu;

const SelectMenuWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  cursor: pointer;

  &:hover div {
    display: flex;
  }

  &:hover span {
    transition: 0.3s;
    filter: brightness(150%);
  }
`;

const SelectBars = styled.div`
  width: 100px;
  height: 10px;
  display: none;
  align-items: center;
  opacity: 0.9;

  img {
    width: 100%;
    height: auto;
  }
`;

const SelectCategory = styled.div`
  padding: 0 20px;

  span {
    font-size: 3rem;
    font-weight: bold;
    color: white;
    font-family: 'pretendard';
  }
`;
