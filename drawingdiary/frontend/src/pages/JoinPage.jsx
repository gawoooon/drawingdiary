import React, { useState, useRef } from 'react';
import styled from "styled-components";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import LongField from '../components/inputField/LongField';
import ShortField from '../components/inputField/ShortField';
import LoginBtn from '../components/LoginBtn';

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 800;
  padding: 10px 0;
`;

const JoinBox = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 600px;
  height: 750px;
`;

const InnerBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: inherit;
  height: auto;
  min-height: 240px;
  margin: 10px 0;
`;

const MoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 400px;
  height: 48px;
  margin: 20px 0;
  background-color: rgba(106, 156, 253, 0.5);
  border-radius: 10px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background-color: rgba(106, 156, 253, 0.3);
  }
`;

const InputSection = styled.div`
  width: inherit;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const InputStyle = styled.input`
  display: flex;
  width: 296px;
  height: 44px;
  margin: 5px 0;
  border: 0.0625rem solid rgb(237, 237, 237);
  border-radius: 10px;
  outline: none;
  font-size: 14px;
  padding: 0 20px;
  &:focus {
    border-color: rgba(106, 156, 253, 0.5);
  }
`;

const PhoneInputStyle = styled.input`
  height: 44px;
  width: 296px;
  margin: 5px 0;
  border: 0.0625rem solid rgb(237, 237, 237);
  border-radius: 10px;
  outline: none;
  font-size: 14px;
  padding: 0 20px;
  &:focus {
    border-color: rgba(106, 156, 253, 0.5);
  }
`;

const SelectMonthContainer = styled.select`
  display: flex;
  width: 126px;
  height: 48px;
  margin: 6px;
  border: 0.0625rem solid rgb(237, 237, 237);
  border-radius: 10px;
  outline: none;
  font-size: 14px;
  padding: 0 20px;
  &:focus {
    border-color: rgba(106, 156, 253, 0.5);
  }
`;

const SelectGenderContainer = styled.select`
  display: flex;
  width: 410px;
  height: 48px;
  margin: 6px;
  border: 0.0625rem solid rgb(237, 237, 237);
  border-radius: 10px;
  outline: none;
  font-size: 14px;
  padding: 0 20px;
  &:focus {
    border-color: rgba(106, 156, 253, 0.5);
  }
`;

const BirthDayContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ConfilmPasswordStyle = styled.input`
  display: flex;
  width: 368px;
  height: 44px;
  margin: 6px;
  border: 0.0625rem solid rgb(237, 237, 237);
  border-radius: 10px;
  outline: none;
  font-size: 14px;
  padding: 0 20px;
  &:focus {
    border-color: rgba(106, 156, 253, 0.5);
  }
`;

const MessageContainer = styled.div`
  width: 400px;
  height: 14px;
`;

const Message = styled.div`
  font-size: 14px;
  color: red;
`;

const CreateAccount = () => {
    const [name, setName] = useState('');
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [gender, setGender] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [certificateEmail, checkCertificateEmail] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [certificatePhoneNumber, checkCertificatePhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [currentStep, setCurrentStep] = useState(1); // 현재 단계

    const navigate = useNavigate();
    const confirmPasswordRef = useRef();

    const handleSubmit = (event) => {
        event.preventDefault();

        if(currentStep === 1) {
          if(!name || !year || !month || !day || !gender) {
            setMessage("모든 입력란을 채워주세요.");
            return;
          }
          setCurrentStep(2); // 2단계로 이동
        } else if(currentStep === 2) {
          if(!userEmail || !certificateEmail || !password || !confirmPassword || !isEmailVerified) {
            setMessage("모든 입력란을 채워주세요.");
            return;
          }

          if(password !== confirmPassword) {
            setMessage("비밀번호가 일치하지 않습니다.");
            confirmPasswordRef.current.focus();
            return;
          }

          setCurrentStep(3); // 3단계로 이동
        } else if(currentStep === 3) {
          if(!userPhone || !certificatePhoneNumber || !isPhoneVerified) {
            setMessage("모든 입력란을 채워주세요.");
            return;
          }

          const birth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          const genderForm = gender === "female" ? "F" : gender === "male" ? "M" : "S";
          
          axios.post('http://drawingdiary.kro.kr/api/join', {
            name,
            email: userEmail,
            password,
            phoneNumber: userPhone,
            birth,
            gender: genderForm,
          })
          .then(response => {
            navigate('/FinishPage');
          })
          .catch(error => {
            if(error.response && error.response.status === 409) {
              setMessage(error.response.data.message);
            } else {
              console.log('Error: ', error);
            }
          });
        }
    };

    const sendEmail = async (event) => {
      event.preventDefault();
      if(userEmail !== '') {
        try {
          await axios.post('http://drawingdiary.kro.kr/api/email/codesending', { email: userEmail }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          setMessage("이메일이 전송되었습니다.");
        } catch (error) {
          console.log("error: ", error);
        }
      } else {
        setMessage("이메일을 입력해주세요!");
      }
    };

    const verifyCertification = async (event) => {
      event.preventDefault();
      if(certificateEmail !== ''){
        try {
          await axios.post('http://drawingdiary.kro.kr/api/email/verify', {
            email: userEmail,
            verificationCode: certificateEmail
          });
          setIsEmailVerified(true);
          setMessage('이메일이 인증되었습니다.')
        } catch (error) {
          console.log("error: ", error);
        }
      }
    };

    const sendPhoneVerificationCode = async (event) => {
      event.preventDefault();
      if (userPhone) {
        try {
          await axios.post('http://drawingdiary.kro.kr/api/sms/codesending-new', { phoneNumber: userPhone }, {
            headers: { 'Content-Type': 'application/json' }
          });
          setMessage("인증번호가 전송되었습니다.");
        } catch (error) {
          console.log("error: ", error);
        }
      } else {
        setMessage("전화번호를 입력해주세요!");
      }
    };

    const verifyPhoneNumber = async (event) => {
      event.preventDefault();
      if (certificatePhoneNumber) {
        try {
          await axios.post('http://drawingdiary.kro.kr/api/sms/verify-new', {
            phoneNumber: userPhone,
            code: certificatePhoneNumber
          });
          setIsPhoneVerified(true);
          setMessage('전화번호가 인증되었습니다.')
        } catch (error) {
          console.log("error: ", error);
        }
      } else {
        setMessage("인증번호를 입력해주세요!");
      }
    };

    return (
      <Body className='create-account-containers'>
        <JoinBox autoComplete="off">
          <Title>계정 만들기</Title>
          <InnerBox>
            {/* 각 단계별로 입력 필드 렌더링 */}
            {currentStep === 1 && (
              <>
                {/* 1단계: 이름, 생년월일, 성별 */}
                <LongField
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름"
                />

                <BirthDayContainer>
                  <ShortField
                    id="year"
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="연"
                  />

                  <SelectMonthContainer 
                    name='month'
                    id='month'
                    value={month}
                    onChange={ (e) => setMonth(e.target.value)}
                    style={{ color: month === "" ? '#808080' : 'initial', paddingTop: '2px' }}>
                    <option value="" disabled style={{ color: 'grey'}}>월</option>
                    {[...Array(12)].map((_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}월
                      </option>
                    ))}
                  </SelectMonthContainer>
                  
                  <ShortField
                    id="day"
                    type="text"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    placeholder="일"
                  />
                </BirthDayContainer>

                <SelectGenderContainer
                  name='gender'
                  id='gender'
                  value={gender}
                  onChange={ (e) => setGender(e.target.value)}
                  style={{ color: month === "" ? '#808080' : 'initial' }}>
                  <option value="" disabled style={{ color: 'grey'}}>성별</option>
                  <option value="female">여자</option>
                  <option value="male">남자</option>
                  <option value="secret">공개안함</option>
                </SelectGenderContainer>
              </>
            )}

            {currentStep === 2 && (
              <>
                {/* 2단계: 이메일, 비밀번호 */}
                <InputSection>
                  <InputStyle
                    id="email"
                    type="email"
                    value={userEmail}
                    onChange={ (e) => setUserEmail(e.target.value)}
                    placeholder="이메일"/>
                  <LoginBtn text="인증" onClick={sendEmail} />
                </InputSection>

                <InputSection>
                  <InputStyle
                    id="certification"
                    value={certificateEmail}
                    onChange={(e) => checkCertificateEmail(e.target.value)}
                    placeholder="인증번호 입력"/>
                  <LoginBtn text="확인" onClick={verifyCertification} />
                </InputSection>

                <LongField
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                />

                <ConfilmPasswordStyle
                  id="checkPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호 확인"
                  ref={confirmPasswordRef}
                />
              </>
            )}

            {currentStep === 3 && (
              <>
                {/* 3단계: 전화번호 인증 */}
                <InputSection>
                  <PhoneInputStyle
                    id="phone"
                    type="text"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="전화번호 입력"/>
                  <LoginBtn text="인증" onClick={sendPhoneVerificationCode} />
                </InputSection>

                <InputSection>
                  <PhoneInputStyle
                    id="phone-certification"
                    type="text"
                    value={certificatePhoneNumber}
                    onChange={(e) => checkCertificatePhoneNumber(e.target.value)}
                    placeholder="인증번호 입력"/>
                  <LoginBtn text="확인" onClick={verifyPhoneNumber} />
                </InputSection>
              </>
            )}

            {message && (
              <MessageContainer>
                <Message>{message}</Message>
              </MessageContainer>
            )}

          </InnerBox>
          <MoveButton onClick={handleSubmit}>
            {currentStep < 3 ? '다음' : '완료'}
          </MoveButton>
        </JoinBox>
      </Body>
    )
};

export default CreateAccount;
