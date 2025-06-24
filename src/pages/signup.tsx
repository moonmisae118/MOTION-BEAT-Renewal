import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BackArrow from '../assets/img/backArrow.png';
import SignupBoxImg from '../assets/img/divBox/signupBox.png';
import emailIcon from '../assets/img/emailIcon.png';
import pwIcon from '../assets/img/pwIcon.png';

interface SignupFormData {
  email: string;
  nickname: string;
  pw: string;
  pwAgain: string;
}

interface SignupError {
  email?: string[];
  nickname?: string[];
  pw?: string[];
  pwAgain?: string[];
}

const Signup: React.FC = () => {
  const backendUrl = import.meta.env.VITE_BACK_API_URL;

  const navigate = useNavigate();
  const location = useLocation();

  const [errors, setErrors] = useState<SignupError>({});
  //   const [popupClosedByUser, setPopupClosedByUser] = useState<boolean>(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const pwAgainRef = useRef<HTMLInputElement>(null);

  const dummyCode = () => {
    setErrors;
  };

  useEffect(() => {
    if (location.state?.email && emailRef.current) {
      emailRef.current.value = location.state.email;
    }
    if (location.state?.nickname && nicknameRef.current) {
      nicknameRef.current.value = location.state.nickname;
    }
  }, [location.state]);

  const handleRevert = () => {
    navigate('/login');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dummyCode;

    const formData: SignupFormData = {
      email: emailRef.current?.value.toLowerCase() || '',
      nickname: nicknameRef.current?.value || '',
      pw: pwRef.current?.value || '',
      pwAgain: pwAgainRef.current?.value || '',
    };

    try {
      await axios.post(`${backendUrl}/api/users/signup`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('회원가입 완료');
      navigate('/login');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const message =
          error.response.data?.message || 'Signup Failed: 서버오류';
        alert(message);
      } else {
        alert('Signup Failed: 네트워크 오류 발생');
      }
    }
  };

  return (
    <SignupWrapper>
      <SignupForm>
        <SignupHeader>
          <SignupBackArrow onClick={handleRevert}>
            <img src={BackArrow} alt="뒤로가기" />
          </SignupBackArrow>
          <SignupTitle>회원가입</SignupTitle>
        </SignupHeader>
        <form onSubmit={handleSubmit}>
          <FormInputWrapper>
            <p>ID</p>
            <InputBox>
              <img src={emailIcon} alt="이메일아이콘" />
              <input
                type="text"
                placeholder="motion@gmail.com"
                ref={emailRef}
              />
            </InputBox>
            {errors.email && <p style={{ color: 'red' }}>{errors.email[0]}</p>}
          </FormInputWrapper>

          <FormInputWrapper>
            <p>Nickname</p>
            <InputBox>
              <input type="text" placeholder="mobe" ref={nicknameRef} />
              <button className="duplicate" type="button">
                중복 확인
              </button>
            </InputBox>
            {errors.nickname && (
              <p style={{ color: 'red' }}>{errors.nickname[0]}</p>
            )}
          </FormInputWrapper>

          <FormInputWrapper>
            <p>Password</p>
            <InputBox>
              <img src={pwIcon} alt="비번아이콘" />
              <input type="password" placeholder="********" ref={pwRef} />
            </InputBox>
            {errors.pw && <p style={{ color: 'red' }}>{errors.pw[0]}</p>}
          </FormInputWrapper>

          <FormInputWrapper>
            <p>Password Verification</p>
            <InputBox>
              <img src={pwIcon} alt="비번아이콘" />
              <input type="password" placeholder="********" ref={pwAgainRef} />
            </InputBox>
            {!errors.pw && errors.pwAgain && (
              <p style={{ color: 'red' }}>{errors.pwAgain[0]}</p>
            )}
          </FormInputWrapper>

          <LoginBtnBox>
            <button type="submit">회원가입</button>
          </LoginBtnBox>
        </form>
      </SignupForm>
    </SignupWrapper>
  );
};

export default Signup;

export const SignupWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 421px;
  height: 780px;
  background-image: url('${SignupBoxImg}');
`;

export const SignupForm = styled.div`
  width: 80%;
  margin: 0 auto;
  text-align: center;
`;

export const SignupHeader = styled.div`
  width: 100%;
  margin: 20px 0 30px 0;
  position: relative;
`;

export const SignupBackArrow = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  left: -6%;
  top: 20%;

  img {
    width: inherit;
    height: inherit;
  }
`;

export const SignupTitle = styled.div`
  width: 80%;
  height: 34px;
  font-size: 43px;
  font-family: 'pretendard';
  color: white;
  text-align: center;
  margin: 20px auto;
  font-weight: 500;
`;

export const FormInputWrapper = styled.div`
  width: 100%;
  margin-bottom: 20px;

  p {
    font-size: 16px;
    font-family: 'pretendard';
    color: #9ea3b2;
    text-align: left;
    font-weight: bold;
    margin-bottom: 10px;
    padding-left: 5px;
  }
`;

export const InputBox = styled.div`
  width: 100%;
  height: 60px;
  border-radius: 16px;
  display: flex;
  background-color: #252932;
  align-items: center;
  padding: 0 20px;

  img {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }

  input {
    font-size: 14px;
    color: white;
    width: 80%;
    height: 34px;
    border: none;
    background-color: transparent;
    outline: none;
  }

  .duplicate {
    width: 68px;
    padding: 7px 0;
    font-size: 14px;
    border: 1px solid #d9d9d9;
    border-radius: 8px;
    font-family: 'pretendard';
    font-weight: bold;
    background: transparent;
    color: white;
    margin-left: auto;
  }
`;

export const SubFuncBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: #c8c8c8;
  font-size: 14px;
  font-family: 'pretendard';
  margin-top: 15px;

  div {
    display: flex;

    input {
      margin-right: 5px;
    }
  }
`;

export const LoginBtnBox = styled.div`
  width: 100%;
  margin-top: 30px;
  margin-bottom: 50px;

  button {
    width: 100%;
    padding: 10px 0;
    border-radius: 16px;
    background-color: #47b5b4;
    color: white;
    font-size: 30px;
    font-family: 'pretendard';
    font-weight: bold;
    border: none;
    cursor: pointer;

    &:hover {
      opacity: 0.7;
    }
  }
`;

export const SocialLogin = styled.div`
  width: 100%;
  margin: 0 auto 40px auto;
  display: flex;
  justify-content: space-around;
`;

export const SignupBox = styled.div`
  width: 58%;
  margin: 0 auto;

  p {
    color: #9ea3be;
    font-size: 14px;
    font-family: 'pretendard';
  }

  span {
    color: #0075ff;
    font-size: 14px;
    font-family: 'pretendard';
    margin-left: 10px;
    font-weight: 600;
    text-decoration: underline;
  }
`;
