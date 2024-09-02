import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import logoIcon from "../../assets/logoIcon.svg";
import logoTitle from "../../assets/logoTitle.svg";
import canSeeIcon from "../../assets/cansee.svg";
import noSeeIcon from "../../assets/nosee.svg";
import delPasswordIcon from "../../assets/delpassword.svg";
import YellowBtn from "../../components/YellowBtn";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePwChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const clearUsername = () => {
    setUsername("");
  };

  const clearPassword = () => {
    setPassword("");
  };

  // 입력 유효성 검사
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username && !password) {
      setMessage("ⓘ 아이디와 비밀번호를 입력해주세요.");
      return;
    } else if (!username) {
      setMessage("ⓘ 아이디를 입력해 주세요.");
      return;
    } else if (!password) {
      setMessage("ⓘ 비밀번호를 입력해 주세요.");
      return;
    }

    setMessage("");

    console.log("Submitted data:", { username, password });

    //연동
    axios
      .post("http://52.78.180.44:8080/accounts/login/", {
        username,
        password,
      })
      .then((response) => {
        console.log("Login successful", response.data);
        // 로그인 성공 후 토큰 로컬 스토리지에 저장
        if (response.data.token) {
          // 토큰 필드 확인
          localStorage.setItem("token", response.data.token); // 토큰
          localStorage.setItem("last_name", response.data.last_name); // 닉네임
          localStorage.setItem("username", username); // 아이디
          localStorage.setItem("result_id", response.data.result_id); // 유형테스트 결과
          navigate("/bakery");
        } else {
          console.error(
            "토큰이 없습니다. 서버 응답을 확인하세요.",
            response.data
          );
        }
      })
      .catch((error) => {
        console.log("Error response:", error.response);
        if (error.response) {
          console.error("Login failed", error.response.data);
          if (error.response.status === 400) {
            setMessage("ⓘ 입력한 정보를 확인해 주세요.");
          } else if (error.response.status === 401) {
            setMessage(
              error.response.data.errors.unauthorized ||
                "ⓘ 아이디와 비밀번호를 정확히 입력해주세요."
            );
          } else {
            setMessage("ⓘ 서버로부터의 응답을 처리하지 못했습니다.");
          }
        } else {
          console.error("Login error", error.message);
          setMessage("ⓘ 서버로부터 응답이 없습니다.");
        }
      });
  };

  return (
    <LoginWrap>
      <LoginBox>
        <ImgBox>
          <TitleLogo src={logoTitle} />
          <IconLogo src={logoIcon} />
        </ImgBox>
        <form onSubmit={handleSubmit}>
          <LoginFormWarp>
            <LoginForm>
              <IdBox>
                <IdInput
                  value={username}
                  placeholder="아이디"
                  onChange={handleNameChange}
                ></IdInput>
                <DelBtn type="button" onClick={clearUsername}>
                  <DelIcon src={delPasswordIcon} />
                </DelBtn>
              </IdBox>
              <LoginHrDiv />
              <PaBox>
                <PaInput
                  type={showPassword ? "static" : "password"}
                  placeholder="비밀번호"
                  value={password}
                  onChange={handlePwChange}
                ></PaInput>
                <SeeBtn type="button" onClick={togglePassword}>
                  <SeeIcon src={showPassword ? canSeeIcon : noSeeIcon} />
                </SeeBtn>
                <DelBtn type="button" onClick={clearPassword}>
                  <DelIcon src={delPasswordIcon} />
                </DelBtn>
              </PaBox>
            </LoginForm>
          </LoginFormWarp>
          {message && <Message>{message}</Message>}
          <YellowBtn txt="로그인" type="submit" width={"275px"} />
        </form>
        <Guide>
          아직 회원이 아니신가요?{" "}
          <Highlight to="/accounts/signup">회원가입하기</Highlight>
        </Guide>
      </LoginBox>
    </LoginWrap>
  );
};

export default Login;

//
// 스타일
//

const LoginWrap = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  height: 100vh;
  background-color: white;
`;

const LoginBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 300px;
  padding: 20px;
`;

const ImgBox = styled.div`
  width: 200px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TitleLogo = styled.img`
  width: 185px;
  margin-bottom: 25px;
`;

const IconLogo = styled.img`
  width: 100px;
`;

// 인풋 관련
const LoginFormWarp = styled.div`
  width: auto;
  height: auto;
  margin: 50px 0px 30px 0px;
`;

const LoginForm = styled.div`
  text-align: center;
  border-radius: 5px;
  border: 2px solid #d9d9d9;
  width: 270px;
`;

const IdInput = styled.input`
  border: none;
  width: 250px;
  height: 45px;
  outline: none;
`;

const IdBox = styled.div`
  display: flex;
  padding: 0px 10px;
`;

const LoginHrDiv = styled.div`
  border-bottom: 1px solid #d9d9d9;
  width: 100%;
`;

const PaBox = styled.div`
  display: flex;
  padding: 0px 10px;
`;

const PaInput = styled.input`
  border: 1px solid #d9d9d9;
  width: 250px;
  height: 45px;
  border: none;
  outline: none;
`;

const SeeBtn = styled.button`
  border: none;
  background-color: white;
  outline: none;
`;
const SeeIcon = styled.img``;

const DelBtn = styled.button`
  border: none;
  background-color: white;
  cursor: pointer;
  outline: none;
`;

const DelIcon = styled.img``;

const Guide = styled.div`
  margin-top: 20px;
  font-size: 12px;
  color: var(--grey);
`;

const Highlight = styled(Link)`
  color: var(--brown);
  text-decoration: underline;
  font-weight: bold;
`;

const Message = styled.div`
  margin-top: -20px;
  margin-bottom: 7px;
  font-size: 12px;
  color: red;
  padding-left: 9px;
  font-weight: 800;
`;
