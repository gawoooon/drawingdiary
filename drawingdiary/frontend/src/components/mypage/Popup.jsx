import axios from "axios";
import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { RiLock2Fill } from "react-icons/ri";
import {
  MdOutlinePhoneIphone,
  MdEmail,
  MdCheckCircle,
  MdClear,
} from "react-icons/md";
import { useAuth } from "../../auth/AuthContext";

// 팝업창
const BackgroundOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1); /* 어두운 배경 색상 */
  z-index: 999; /* 모달보다 낮은 z-index를 설정하여 모달 위로 올라오도록 함 */
`;

const PopupBox = styled.div`
  width: 500px;
  height: 750px;
  background-color: white;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 40px;
  box-sizing: border-box;
`;

// 팝업창 상단
const PopupTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 7%;
`;

const PopupTopText = styled.div`
  font-size: 20px;
`;

const PopupTopCloseBtn = styled.button`
  border: none;
  font-size: 20px;
  cursor: pointer;
  background-color: white;
`;

// 팝업창 하단 - 수정 버튼
const PopupBottom = styled.div`
  width: 100%;
  height: 7%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupBottomEditBtn = styled.button`
  width: 420px;
  height: 48px;
  background-color: rgba(106, 156, 253, 0.5);
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  &:hover {
    background-color: rgba(106, 156, 253, 0.3);
  }
`;

// 팝업창 중단
const PopupBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 86%;
  box-sizing: border-box;
  padding: 10px 0;
`;

// 프로필
const ProfileTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  width: 100%;
  height: 17%;
  background-color: white;
  margin-bottom: 20px;
  padding: 0 20px 20px 20px;
  box-sizing: border-box;
`;

// 프로필 이미지
const ProfileImgBox = styled.div`
  display: flex;
  width: 80px;
  height: 80px;
  align-items: end;
`;

const ProfileImg = styled.img`
  height: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 50px;
  object-fit: cover;
`;

// 프로필 이름
const ProfileName = styled.input`
  display: flex;
  align-items: end;
  width: 140px;
  height: 40px;
  font-size: 16px;
  margin: 0px 10px;
  box-sizing: border-box;
  outline: none;
  border: none;
  ::placeholder {
    color: #a3a3a3;
  }
  border-bottom: 1px solid #828282;
`;

// 프로필 이미지 업로드
const ProfileImgUpload = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 35px;
  background-color: white;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 400;
  color: #828282;
  border: 1px solid #828282;
  cursor: pointer;
`;

const HiddenFileInput = styled.input`
  /* 파일 업로드를 위한 숨겨진 input */
  display: none;
  height: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 50px;
`;

// 팝업창
const PopupLineBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 10px 10px 10px;
  width: 100%;
  height: 45px;
  box-sizing: border-box;
`;

const PopupLineIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 100%;
`;

const PopupLineInputBox = styled.div`
  display: flex;
  width: 250px;
  height: 100%;
  font-size: 12px;
  border: none;
  border-bottom: 1px solid rgba(56, 56, 56, 0.4);
`;

const PopupLineInput = styled.input`
  flex: 1;
  width: 220px;
  height: 90%;
  outline: none;
  font-size: 12px;
  border: none;
`;

const PopupLineTitle = styled.div`
  display: flex;
  align-items: center;
  width: 250px;
  height: 100%;
  font-size: 14px;
  font-weight: 400;
`;

const PopupLineBtn = styled.button`
  width: 60px;
  height: 36px;
  background-color: white;
  border: 2px solid rgba(106, 156, 253, 0.5);
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  text-align: center;
  outline: none;
  font-weight: 400;
  &:hover {
    background-color: rgba(106, 156, 253, 0.3);
    border: none;
  }
`;

const PopupLineBtnBox = styled.div`
  width: 50px;
  height: 100%;
  background-color: white;
`;

// 인증 문구
const CheckIconBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 90%;
  color: green;
`;
const LineBox = styled.div`
  width: 100%;
  height: 15px;
`;

function Popup({ onClose, profileImage, profileName }) {
  const { getToken } = useAuth();
  const accessToken = getToken();
  // const navigate = useNavigate();

  // 프로필
  const [newName, setNewName] = useState("");
  const [newProfileImage, setNewProfileImage] = useState(null); // 업로드한 이미지 상태 추가

  // 문자 인증
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [phoneCertification, setPhoneCertification] = useState("");
  // const [newPhoneNumber, setNewPhoneNumber] = useState(null);
  const [verifySnsMessage, setVerifySnsMessage] = useState(null);

  // 이메일 인증
  const [newEmail, setNewEmail] = useState(null);
  const [certification, setCheckCertification] = useState("");
  const [verifyMessage, setVerifyMessage] = useState(null);

  // 비밀번호
  const [oldPassword, setOldPassword] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");

  // 파일을 base64로 변환하는 함수
  const convertToBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      const base64Image = arrayBufferToBase64(reader.result);
      callback(base64Image);
    };
    reader.onerror = (error) => {
      console.error("파일을 base64로 변환하는 중 오류가 발생했습니다.", error);
      callback(null);
    };
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // 파일 선택 시 이벤트 처리 함수
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 1024 * 1024) {
        // 파일이 너무 큰 경우
        alert("이미지 파일의 크기는 1MB 이하여야 합니다.");
        return;
      }
      convertToBase64(selectedFile, (base64Image) => {
        if (base64Image) {
          console.log(base64Image); // base64 문자열 출력
          setNewProfileImage(base64Image);
        } else {
          console.error("파일을 base64로 변환할 수 없습니다.");
        }
      });
    }
  };

  // setName을 placeholder로 보내기
  useEffect(() => {
    if (profileName) {
      setNewName(profileName);
    }
  }, []);

  // 문자 인증
  const sendPhone = async (event) => {
    event.preventDefault();
    console.log("phoneNumber: ", phoneNumber);
    if (phoneNumber !== "") {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/sms/codesending-new",
          { phoneNumber: phoneNumber },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("response", response);
      } catch (error) {
        console.log("error: ", error);
      }
    } else {
      alert("핸드폰 번호를 입력해주세요!");
    }
  };

  const verifyPhoneCertification = async (event) => {
    event.preventDefault();
    if (phoneCertification !== "") {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/sms/verify-new",
          {
            phoneNumber: phoneNumber,
            code: phoneCertification,
          }
        );
        console.log("response: ", response);
        setVerifySnsMessage(true);
      } catch (error) {
        setVerifySnsMessage(false);
        console.log("error: ", error);
      }
    }
  };

  // 이메일 인증
  const sendEmail = async (event) => {
    event.preventDefault();
    console.log("newEmail: ", newEmail);
    if (newEmail !== "") {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/email/codesending",
          { email: newEmail },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("response", response);
      } catch (error) {
        console.log("error: ", error);
      }
    } else {
      alert("이메일을 입력해주세요!");
    }
  };

  const verifyCertification = async (event) => {
    event.preventDefault();
    if (certification !== "") {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/email/verify",
          {
            email: newEmail,
            verificationCode: certification,
          }
        );
        console.log("response: ", response);
        if (response.data === true) {
          setVerifyMessage(true);
          console.log("true");
        } else {
          setVerifyMessage(false);
          console.log("false");
        }
      } catch (error) {
        console.log("error: ", error);
        setVerifyMessage(false);
      }
    }
  };

  // 비밀번호 인증
  const handleChangePassword = async () => {
    console.log(oldPassword);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/password",
        {
          oldPassword: oldPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("response: ", response);
      setPasswordMatch(true);
    } catch (error) {
      console.log("error: ", error);
      setPasswordMatch(false);
    }
  };

  // 이모티콘
  function VerificationIcon({ isValid }) {
    return (
      <CheckIconBox>
        {isValid === null ? null : isValid ? (
          <MdCheckCircle size={16} color="green" />
        ) : (
          <MdClear size={16} color="red" />
        )}
      </CheckIconBox>
    );
  }

  // 비밀번호 일치하는지 확인
  const isPasswordValid = () => {
    return newPassword === confirmPassword;
  };

  // 마이페이지 수정
  const handleEditClick = async () => {
    // 변경사항이 없을 경우
    if (
      !passwordMatch &&
      !verifyMessage &&
      !verifySnsMessage &&
      newName === profileName &&
      newProfileImage === profileImage
    ) {
      console.log(passwordMatch);
      alert("수정사항이 없습니다.");
      return;
    }
    // 비밀번호 일치 여부 확인
    if (passwordMatch === true) {
      if (!isPasswordValid()) {
        alert("비밀번호가 일치하지 않습니다!");
        return; // 실행 중단
      }
    }

    console.log(
      "이름:",
      newName,
      "비1",
      oldPassword,
      "비2",
      newPassword,
      "이메일",
      newEmail,
      "폰",
      phoneNumber,
      "이미지",
      newProfileImage
    );
    try {
      const response = await axios.patch(
        "http://localhost:8080/api/mypage",
        {
          newName: newName,
          oldPassword: oldPassword,
          newPassword: newPassword,
          newEmail: newEmail,
          newPhoneNumber: phoneNumber,
          newProfileImage: newProfileImage,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("response: ", response);
      alert("수정되었습니다!");
      window.location.reload();
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <>
      <BackgroundOverlay />
      <PopupBox>
        <PopupTop>
          <PopupTopText>기본정보</PopupTopText>
          <PopupTopCloseBtn onClick={onClose}>X</PopupTopCloseBtn>
        </PopupTop>

        <PopupBody>
          <ProfileTop>
            <ProfileImgBox>
              {newProfileImage !== null ? (
                <ProfileImg
                  src={`data:image/png;base64, ${newProfileImage}`}
                  alt="새 프로필 이미지"
                />
              ) : (
                <>
                  {profileImage !== "null" && profileImage !== null ? (
                    <ProfileImg src={profileImage} alt="프로필 이미지" />
                  ) : (
                    <ProfileImg src="/user2.png" alt="기본 이미지" />
                  )}
                </>
              )}
            </ProfileImgBox>
            <ProfileName
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <ProfileImgUpload>
              사진올리기
              <HiddenFileInput
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
            </ProfileImgUpload>
          </ProfileTop>

          <PopupLineBox>
            <PopupLineIcon>
              <MdOutlinePhoneIphone size={20} />
            </PopupLineIcon>
            <PopupLineInputBox>
              <PopupLineInput
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="새로운 전화번호 입력(11자리)"
              />
            </PopupLineInputBox>
            <PopupLineBtn onClick={(e) => sendPhone(e)}>인증</PopupLineBtn>
          </PopupLineBox>

          <PopupLineBox>
            <PopupLineIcon></PopupLineIcon>
            <PopupLineInputBox>
              <PopupLineInput
                id="phoneCertification"
                value={phoneCertification}
                onChange={(e) => setPhoneCertification(e.target.value)}
                placeholder="인증번호 입력"
              />
              <VerificationIcon
                isValid={phoneCertification !== "" ? verifySnsMessage : null}
              />
            </PopupLineInputBox>
            <PopupLineBtn onClick={(e) => verifyPhoneCertification(e)}>
              확인
            </PopupLineBtn>
          </PopupLineBox>

          {/* <PopupLineBox>
            <PopupLineIcon></PopupLineIcon>
            <PopupLineInputBox>
              <PopupLineInput
                value={newPhoneNumber}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
                placeholder="새로운 전화번호 입력 (11자리)"
              />
            </PopupLineInputBox>
            <PopupLineBtnBox></PopupLineBtnBox>
          </PopupLineBox> */}

          <LineBox />

          <PopupLineBox>
            <PopupLineIcon>
              <MdEmail size={20} />
            </PopupLineIcon>
            <PopupLineTitle>아이디 변경</PopupLineTitle>
            <PopupLineBtnBox></PopupLineBtnBox>
          </PopupLineBox>

          <PopupLineBox>
            <PopupLineIcon></PopupLineIcon>
            <PopupLineInputBox>
              <PopupLineInput
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="새로운 이메일 입력"
              />
            </PopupLineInputBox>
            <PopupLineBtn onClick={(e) => sendEmail(e)}>인증</PopupLineBtn>
          </PopupLineBox>

          <PopupLineBox>
            <PopupLineIcon></PopupLineIcon>
            <PopupLineInputBox>
              <PopupLineInput
                id="certification"
                value={certification}
                onChange={(e) => setCheckCertification(e.target.value)}
                placeholder="인증번호 입력"
              />
              <VerificationIcon
                isValid={certification !== "" ? verifyMessage : null}
              />
            </PopupLineInputBox>
            <PopupLineBtn onClick={(e) => verifyCertification(e)}>
              확인
            </PopupLineBtn>
          </PopupLineBox>
          <LineBox />

          <PopupLineBox>
            <PopupLineIcon>
              <RiLock2Fill size={20} />
            </PopupLineIcon>
            <PopupLineTitle>비밀번호 변경</PopupLineTitle>
            <PopupLineBtnBox></PopupLineBtnBox>
          </PopupLineBox>

          <PopupLineBox>
            <PopupLineIcon></PopupLineIcon>
            <PopupLineInputBox>
              <PopupLineInput
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="현재 비밀번호 입력"
              />
              <VerificationIcon
                isValid={oldPassword !== "" ? passwordMatch : null}
              />
            </PopupLineInputBox>
            <PopupLineBtn
              onClick={() => {
                handleChangePassword();
              }}
            >
              확인
            </PopupLineBtn>
          </PopupLineBox>

          <PopupLineBox>
            <PopupLineIcon></PopupLineIcon>
            <PopupLineInputBox>
              <PopupLineInput
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새로운 비밀번호 입력"
              />
            </PopupLineInputBox>
            <PopupLineBtnBox></PopupLineBtnBox>
          </PopupLineBox>

          <PopupLineBox>
            <PopupLineIcon></PopupLineIcon>
            <PopupLineInputBox>
              <PopupLineInput
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호 확인"
              />
            </PopupLineInputBox>
            <PopupLineBtnBox></PopupLineBtnBox>
          </PopupLineBox>
        </PopupBody>
        <PopupBottom>
          <PopupBottomEditBtn onClick={handleEditClick}>
            수정
          </PopupBottomEditBtn>
        </PopupBottom>
      </PopupBox>
    </>
  );
}

export default Popup;
