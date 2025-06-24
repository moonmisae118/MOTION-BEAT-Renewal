import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BackArrow from '../assets/img/backArrow.png';
import LoginBox from '../assets/img/divBox/loginBox.png';
import emailIcon from '../assets/img/emailIcon.png';
import pwIcon from '../assets/img/pwIcon.png';

interface LoginFormData {
  email: string;
  pw: string;
}

interface LoginError {
  email?: string[];
  pw?: string[];
}

const Login: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<LoginError>({});
  // const [popupClosedByUser, setPopupClosedByUser] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleForgot = () => {
    dummyCode;
    navigate('/forgotPw');
  };
  const handleSignup = () => navigate('/signup');

  const dummyCode = () => {
    setErrors;
  };

  return (
    <>
      <LoginWrapper>
        <LoginForm>
          <LoginHeader>
            <LoginBackArrow>
              <img src={BackArrow} alt="뒤로가기" />
            </LoginBackArrow>
            <LoginTitle>LOGIN</LoginTitle>
          </LoginHeader>
          <form>
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
              {errors.email && (
                <p style={{ color: 'red' }}>{errors.email[0]}</p>
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

            <SubFuncBox>
              <div>
                <input type="checkbox" />
                <p>아이디 저장</p>
              </div>
              <p onClick={handleForgot}>비밀번호 찾기</p>
            </SubFuncBox>

            <LoginBtnBox>
              <button type="submit">LOGIN</button>
            </LoginBtnBox>

            {/* {popupClosedByUser && <p>로그인 창이 닫혔습니다. 다시 시도해 주세요.</p>} */}

            <SignupBox>
              <p onClick={handleSignup}>
                아직 회원이 아니신가요?<span>회원가입</span>
              </p>
            </SignupBox>
          </form>
        </LoginForm>
      </LoginWrapper>
    </>
  );
};

export default Login;

export const LoginWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 421px;
  height: 661px;
  background-image: url('${LoginBox}');
`;

export const LoginForm = styled.div`
  width: 80%;
  margin: 0 auto;
  text-align: center;
`;

export const LoginHeader = styled.div`
  margin: 20px 0 30px 0;
  position: relative;
`;

export const LoginBackArrow = styled.div`
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

export const LoginTitle = styled.div`
  width: 80%;
  height: 34px;
  font-size: 2rem;
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
  width: 70%;
  margin: 0 auto;

  p {
    color: #9ea3be;
    font-size: 16px;
    font-family: 'pretendard';
  }

  span {
    color: #0075ff;
    font-size: 16px;
    font-family: 'pretendard';
    margin-left: 10px;
    font-weight: 600;
    text-decoration: underline;
  }
`;
