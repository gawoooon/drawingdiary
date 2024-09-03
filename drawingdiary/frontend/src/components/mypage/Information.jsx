import styled from "styled-components";
import { MdOutlinePhoneIphone } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { FaBirthdayCake } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import Line from "./Line";

const InfoBox = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
`;

const InfoBtn = styled.button`
  width: 420px;
  height: 48px;
  background-color: rgba(106, 156, 253, 0.5);
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  margin-top: 30px;
  &:hover {
    background-color: rgba(106, 156, 253, 0.3);
  }
`;

function Information({
  onPopupPassword,
  profileEmail,
  profileName,
  profileBirth,
  profilePhone,
}) {
  // 전화번호를 ###-####-#### 형식으로 변경하는 함수
  const formatPhoneNumber = (phoneNumber) => {
    if (phoneNumber === null) return "전화번호를 등록해주세요";
    // 전화번호 형식 변환
    const formattedNumber = phoneNumber.replace(
      /(\d{3})(\d{4})(\d{4})/,
      "$1-$2-$3"
    );
    return formattedNumber;
  };

  return (
    <InfoBox>
      <Line icon={IoMdPerson} text={profileName} hasBorder={true} />
      <Line
        icon={MdOutlinePhoneIphone}
        text={formatPhoneNumber(profilePhone)}
        hasBorder={true}
      />
      <Line icon={MdEmail} text={profileEmail} hasBorder={true} />
      <Line icon={FaBirthdayCake} text={profileBirth} hasBorder={true} />
      <InfoBtn onClick={onPopupPassword}>수정</InfoBtn>
    </InfoBox>
  );
}

export default Information;
