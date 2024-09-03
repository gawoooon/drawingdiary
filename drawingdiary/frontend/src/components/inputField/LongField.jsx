import styled from "styled-components";

const InputStyle = styled.input`
    display: flex;
    width: 368px;
    height: 44px;
    margin: 6px;
    border: 0.0625rem solid rgba(237, 237, 237, 0.8);
    border-radius: 10px;
    outline: none;
    font-size: 14px;
    padding: 0 20px;
    &:focus {
    border-color: rgba(106, 156, 253, 0.5);
    }
`;

const LongField = ({ id, type, value, onChange, placeholder }) => {

    return(
        <InputStyle
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    )
};

export default LongField;