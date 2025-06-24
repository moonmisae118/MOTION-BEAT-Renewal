import { useEffect, useState } from 'react';
import loginBg0 from '../../assets/img//bg/loginpage0.png';
import loginBg1 from '../../assets/img/bg/loginpage1.png';

const MoveBg = () => {
  const [showFirstImage, setShowFirstImage] = useState(true);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const toggleImage = () => {
      setShowFirstImage((prev) => !prev);
      const randomDelay = Math.random() * 2900 + 100; // 100ms ~ 3000ms
      timeoutId = setTimeout(toggleImage, randomDelay);
    };

    toggleImage();

    return () => clearTimeout(timeoutId);
  }, []);

  const backgroundImage = showFirstImage ? loginBg0 : loginBg1;

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-no-repeat bg-cover bg-center bg-fixed z-[-2] transition-opacity duration-500 ease-in-out"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    />
  );
};

export default MoveBg;
