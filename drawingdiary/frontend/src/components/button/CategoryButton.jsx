import styled from "styled-components"
import React from "react";

const ButtonStyle = styled.button `
    height: 40px;
    width: 60px;
    margin-left: 10px;
    background-color: rgba(106, 156, 253, 0.3);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    color: black;
    font-size: 13px;
    text-align: center;
`;

const CategoryButton = ({ text, onClick }) => {
    return (
        <ButtonStyle type="button" onClick={onClick}>
            {text}
        </ButtonStyle>
    )
}

export default CategoryButton