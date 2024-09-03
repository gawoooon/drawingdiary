import styled from "styled-components";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import JSConfetti from "js-confetti";

const Container = styled.div`
    height: 450px;
    width: 700px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 30px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    h2 {
        margin-top: 50px;
        margin-bottom: 50px;
        text-align: center;
        font-weight: lighter;
    };
`;

const ButtonStyle = styled.button`
    height: 50px;
    width: 250px;
    margin-bottom: 30px;
    background-color: rgba(106, 156, 253, 0.3);
    border-radius: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border: none;
    cursor: pointer;
    color: black;
    font-size: 20px;
    font-weight: bold;
`;

const ButtonContainer = styled.div `
    display: flex;
    align-items: center;
    justify-content: center;
`;

const FinishPage = () => {

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/login');
    };

    const confettiRef = useRef(new JSConfetti());

    useEffect( () => {
        confettiRef.current.addConfetti();
    }, []);


    return(
        <Container>
            <h2>회원가입이<br/>완료되었습니다!</h2>
            <ButtonContainer>
                <ButtonStyle onClick={handleSubmit}>
                    로그인
                </ButtonStyle>
            </ButtonContainer>
        </Container>

    );
};

export default FinishPage;



