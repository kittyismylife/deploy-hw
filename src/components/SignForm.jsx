import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import YellowBtn from "../../src/components/YellowBtn";
import TermS from "../pages/accounts/TermS";
import TermP from "../pages/accounts/TermP";
import Popup from "../components/Popup";
import styled from "styled-components";
import canSeeIcon from "../assets/cansee.svg";
import noSeeIcon from "../assets/nosee.svg";
import delPasswordIcon from "../assets/delpassword.svg";

const SignForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    last_name: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // 비밀번호 & 비밀번호 확인 지우기 버튼
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handlePwChange = (e) => {
    setPassword(e.target.value);
    handleChange(e);
  };

  const handlePw2Change = (e) => {
    setPassword2(e.target.value);
    handleChange(e);
  };

  const clearPassword = () => {
    setPassword("");
    setFormData({ ...formData, password: "" });
  };

  const clearPassword2 = () => {
    setPassword2("");
    setFormData({ ...formData, confirmPassword: "" });
  };

  // 비밀번호 & 비밀번호 보이기(토글) 버튼
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const togglePassword2 = () => {
    setShowPassword2(!showPassword2);
  };

  // 체크박스 관련
  const [allChecked, setAllChecked] = useState({
    termsAgree: false,
    privacyAgree: false,
    serviceAgree: false,
    adsAgree: false,
    marketingAgree: false,
    allChecked: false,
  });

  const [showPopup, setShowPopup] = useState({
    show: false,
    title: "",
    content: null,
  });

  const handleAllCheckedChange = () => {
    const newCheckedStatus = !allChecked.allChecked;
    setAllChecked({
      termsAgree: newCheckedStatus,
      privacyAgree: newCheckedStatus,
      serviceAgree: newCheckedStatus,
      adsAgree: newCheckedStatus,
      marketingAgree: newCheckedStatus,
      allChecked: newCheckedStatus,
    });
  };

  const handleIndividualCheck = (name) => {
    setAllChecked((prevState) => {
      const updatedState = {
        ...prevState,
        [name]: !prevState[name],
      };
      const allAreChecked = Object.keys(updatedState).every(
        (key) => updatedState[key] === true
      );
      updatedState.allChecked = allAreChecked;
      return updatedState;
    });
  };

  // 팝업
  const openPopup = (title, content) => {
    setShowPopup({ show: true, title, content });
  };

  const closePopup = () => {
    setShowPopup({ show: false, title: "", content: null });
  };

  // 유효성 검사
  const validateForm = () => {
    const newErrors = {};
    let isErrorPresent = false;

    if (!formData.username) {
      newErrors.username = "ⓘ 아이디를 입력해 주세요.";
      isErrorPresent = true;
    } else if (!/^[a-z0-9]{4,12}$/.test(formData.username)) {
      newErrors.username =
        "ⓘ 아이디는 영문 소문자와 숫자 4~12자리로 이루어져야 합니다.";
      isErrorPresent = true;
    }

    if (!formData.password) {
      newErrors.password = "ⓘ 비밀번호를 입력해 주세요.";
      isErrorPresent = true;
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,16}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "ⓘ 비밀번호는 영문, 숫자, 특수문자를 포함한 10~16자리여야 합니다.";
      isErrorPresent = true;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "ⓘ 비밀번호를 다시 한 번 입력해주세요.";
      isErrorPresent = true;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "ⓘ 비밀번호가 일치하지 않습니다.";
      isErrorPresent = true;
    }

    if (!formData.last_name) {
      newErrors.last_name = "ⓘ 이름을 입력해 주세요.";
      isErrorPresent = true;
    }

    if (formData.phone && !/^\d{10,11}$/.test(formData.phone)) {
      newErrors.phone = "ⓘ 유효한 연락처를 입력해주세요. 예) 01012345678";
      isErrorPresent = true;
    }

    setErrors(newErrors);
    return !isErrorPresent;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !allChecked.termsAgree ||
      !allChecked.privacyAgree ||
      !allChecked.serviceAgree
    ) {
      setMessage("ⓘ 필수 약관에 동의해 주세요.");
      return;
    }

    if (!validateForm()) {
      setMessage(
        "ⓘ 회원가입에 실패했습니다. 입력하신 정보를 다시 한번 확인해 주세요."
      );
      return;
    }

    const submitData = {
      username: formData.username,
      password: formData.password,
      password2: formData.confirmPassword,
      last_name: formData.last_name,
      phone: formData.phone,
    };

    // 서버에 제출
    axios
      .post("http://52.78.180.44:8080/accounts/signup/", submitData)
      .then((response) => {
        axios
          .post("http://52.78.180.44:8080/accounts/login/", {
            username: formData.username,
            password: formData.password,
          })
          .then((loginResponse) => {
            localStorage.setItem("token", loginResponse.data.token);
            localStorage.setItem("last_name", loginResponse.data.last_name);
            localStorage.setItem("username", formData.username);
            navigate("/accounts/signup-clear");
          })
          .catch((loginError) => {
            if (loginError.response && loginError.response.data) {
              setMessage(Object.values(loginError.response.data).join(" "));
            } else {
              setMessage(
                "자동 로그인에 실패했습니다. 로그인 페이지로 이동합니다."
              );
            }
            navigate("/accounts/login/");
          });

        setMessage("회원가입이 완료되었습니다.");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setMessage(Object.values(error.response.data.errors).join(" "));
        } else {
          setMessage("서버 오류!");
        }
      });
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: "" });
  };

  return (
    <>
      {/* 인풋 필드 */}
      <form onSubmit={handleSubmit}>
        <SignInputContainer>
          <SignInputWarp>
            <SignBox>
              <LabelBox htmlFor="username">
                아이디 <RequiredEnter>* 필수 입력 항목입니다.</RequiredEnter>
              </LabelBox>
              <SignInput
                id="username"
                placeholder="영문소문자/숫자,4~12자"
                value={formData.username}
                onChange={handleChange}
              />
              {/* 에러메세지 */}
              {errors.username && (
                <ErrorMessage>{errors.username}</ErrorMessage>
              )}
            </SignBox>
            <SignBox>
              <LabelBox htmlFor="password">
                비밀번호 <RequiredEnter>* 필수 입력 항목입니다.</RequiredEnter>
              </LabelBox>
              <SignInputBox>
                <SignInput
                  id="password"
                  value={password}
                  type={showPassword ? "static" : "password"}
                  placeholder="영문/숫자/특수문자 혼합,10~16자"
                  onChange={handlePwChange}
                />
                <PWSeeBtn type="button" onClick={togglePassword}>
                  <img
                    src={showPassword ? canSeeIcon : noSeeIcon}
                    alt="Toggle visibility"
                  />
                </PWSeeBtn>
                <PWDelBtn type="button" onClick={clearPassword}>
                  <img src={delPasswordIcon} alt="Clear" />
                </PWDelBtn>
              </SignInputBox>
              {/* 에러메세지 */}
              {errors.password && (
                <ErrorMessage>{errors.password}</ErrorMessage>
              )}
            </SignBox>
            <SignBox>
              <LabelBox htmlFor="password2">
                비밀번호 확인{" "}
                <RequiredEnter>* 필수 입력 항목입니다.</RequiredEnter>
              </LabelBox>
              <SignInputBox>
                <SignInput
                  id="confirmPassword"
                  value={password2}
                  type={showPassword2 ? "static" : "password"}
                  placeholder="비밀번호를 한 번 더 입력해 주세요."
                  onChange={handlePw2Change}
                />
                <PW2SeeBtn type="button" onClick={togglePassword2}>
                  <img
                    src={showPassword2 ? canSeeIcon : noSeeIcon}
                    alt="Toggle visibility"
                  />
                </PW2SeeBtn>
                <PW2DelBtn type="button" onClick={clearPassword2}>
                  <img src={delPasswordIcon} alt="Clear" />
                </PW2DelBtn>
              </SignInputBox>
              {/* 에러메세지 */}

              {errors.confirmPassword && (
                <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
              )}
            </SignBox>
            <SignBox>
              <LabelBox htmlFor="last_name">
                이름 <RequiredEnter>* 필수 입력 항목입니다.</RequiredEnter>
              </LabelBox>
              <SignInput
                id="last_name"
                placeholder="김사자"
                value={formData.last_name}
                onChange={handleChange}
              />
              {/* 에러메세지 */}

              {errors.last_name && (
                <ErrorMessage>{errors.last_name}</ErrorMessage>
              )}
            </SignBox>
            <SignBox>
              <LabelBox htmlFor="phone">연락처</LabelBox>
              <SignInput
                id="phone"
                placeholder="-없이 숫자만 입력해 주세요."
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
            </SignBox>
          </SignInputWarp>
        </SignInputContainer>

        {/* 체크박스 */}
        <AgreeContainer>
          <CheckboxItem>
            <StyledCheck
              type="checkbox"
              checked={allChecked.allChecked}
              onChange={handleAllCheckedChange}
            />
            <Allcheck htmlFor="allAgree">약관 전체 동의</Allcheck>
          </CheckboxItem>
          <StyledLine />
          <CheckboxItem>
            <StyledCheck
              type="checkbox"
              checked={allChecked.termsAgree}
              onChange={() => handleIndividualCheck("termsAgree")}
            />
            <SmallCheck htmlFor="termsAgree">
              [필수] 만 14세 이상 서비스 이용 동의
            </SmallCheck>
          </CheckboxItem>
          <CheckboxItem>
            <StyledCheck
              type="checkbox"
              checked={allChecked.privacyAgree}
              onChange={() => handleIndividualCheck("privacyAgree")}
            />
            <SmallCheck htmlFor="privacyAgree">
              [필수] 개인정보 수집/이용 동의
            </SmallCheck>
            <SeeButton
              type="button"
              onClick={() => openPopup("개인정보 수집/이용 동의", <TermP />)}
            >
              보기
            </SeeButton>
          </CheckboxItem>
          <CheckboxItem>
            <StyledCheck
              type="checkbox"
              checked={allChecked.serviceAgree}
              onChange={() => handleIndividualCheck("serviceAgree")}
            />
            <SmallCheck htmlFor="serviceAgree">
              [필수] 서비스 이용 약관
            </SmallCheck>
            <SeeButton
              type="button"
              onClick={() => openPopup("서비스 이용 약관", <TermS />)}
            >
              보기
            </SeeButton>
          </CheckboxItem>
          <CheckboxItem>
            <StyledCheck
              type="checkbox"
              checked={allChecked.adsAgree}
              onChange={() => handleIndividualCheck("adsAgree")}
            />
            <SmallCheck htmlFor="adsAgree">
              [선택] 광고성 정보 수신 동의
            </SmallCheck>
          </CheckboxItem>
          <CheckboxItem>
            <StyledCheck
              type="checkbox"
              checked={allChecked.marketingAgree}
              onChange={() => handleIndividualCheck("marketingAgree")}
            />
            <SmallCheck htmlFor="marketingAgree">
              [선택] 마케팅 정보/이용 동의
            </SmallCheck>
          </CheckboxItem>
        </AgreeContainer>
        {showPopup.show && (
          <Popup title={showPopup.title} onClose={closePopup}>
            {showPopup.content}
          </Popup>
        )}
        {/* 버튼 위 에러메세지 */}
        {message && <Message>{message}</Message>}

        {/* 가입 버튼 */}
        <YBtnBox>
          <YellowBtn
            txt="동의하고 가입하기"
            type="submit"
            width="80%"
            disabled={!allChecked.allChecked}
          />
        </YBtnBox>
      </form>
    </>
  );
};

export default SignForm;

//
// 스타일
//

// 인풋필드 스타일
const SignInputContainer = styled.div`
  display: flex;
  justify-content: center;
`;
const SignInputWarp = styled.div`
  width: 75%;
`;
const SignBox = styled.div``;

const LabelBox = styled.label`
  font-size: 18px;
  display: flex;
  align-items: baseline;
  margin-bottom: 5px;
`;
const RequiredEnter = styled.div`
  font-size: 9px;
  color: #8a8888;
  margin-left: 7px;
`;

const SignInputBox = styled.div`
  display: flex;
  position: relative;
`;

const SignInput = styled.input`
  font-size: 14px;
  width: 94%;
  border: 2px solid #d9d9d9;
  height: 44px;
  border-radius: 5px;
  outline: none;
  padding: 0px 0px 0px 10px;
  margin-bottom: 25px;
`;

const PWSeeBtn = styled.button`
  border: none;
  background-color: white;
  position: absolute;
  top: 48.5%;
  right: 12%;
  transform: translateY(-100%);
`;

const PW2SeeBtn = styled.button`
  border: none;
  background-color: white;
  position: absolute;
  top: 48.5%;
  right: 12%;
  transform: translateY(-100%);
`;

const PWDelBtn = styled.button`
  border: none;
  background-color: white;
  cursor: pointer;
  position: absolute;
  top: 48%;
  right: 5%;
  transform: translateY(-100%);
`;

const PW2DelBtn = styled.button`
  border: none;
  background-color: white;
  cursor: pointer;
  position: absolute;
  top: 48%;
  right: 5%;
  transform: translateY(-100%);
`;

// 에러메세지
const Message = styled.div`
  text-align: center;
  font-weight: 800;
  color: #ff3b3b;
  margin-top: 15px;
  margin-bottom: -15px;
  font-size: 12px;
`;

const ErrorMessage = styled.div`
  font-weight: 800;
  color: #ff3b3b;
  font-size: 10.5px;
  padding-top: 10px;
  margin-top: -25px;
  margin-bottom: 7px;
`;

// 버튼
const YBtnBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  padding-top: 10px;
`;

// Checkbox 관련 스타일
const AgreeContainer = styled.div`
  margin-top: 0px;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const CheckboxItem = styled.div`
  display: flex;
  justify-content: left;
  margin-left: 60px;
  width: 300px;
`;

const StyledCheck = styled.input`
  appearance: none;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 14.5px;
  height: 14.5px;
  cursor: pointer;
  margin-right: 10px;
  position: relative;

  &:checked {
    border-color: var(--yellow);

    &::after {
      content: "";
      position: absolute;
      top: 40%;
      left: 50%;
      width: 30%;
      height: 50%;
      border: solid var(--yellow);
      border-width: 0 1px 1px 0;
      transform: translate(-50%, -50%) rotate(45deg);
    }
  }
`;

const Allcheck = styled.label`
  font-size: 18px;
`;

const SmallCheck = styled.label`
  font-size: 12px;
  color: var(--grey);
  letter-spacing: -0.5px;
  line-height: 22px;
  margin-bottom: -10px;
`;

const StyledLine = styled.div`
  margin: 0px 60px 5px 60px;
  border-bottom: var(--yellow) 1px solid;
`;

const SeeButton = styled.button`
  position: absolute;
  right: 60px;
  font-size: 10px;
  text-decoration-line: none;
  color: var(--grey);
  font-weight: 500;
  border: none;
  background-color: white;
  cursor: pointer;
`;
