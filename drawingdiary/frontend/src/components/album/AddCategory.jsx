import React, { useState } from "react";
import styled from "styled-components";
import CategoryButton from "../Button/CategoryButton";
import { useCategory } from "./CategoryList";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

const ContainerBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1); // 투명한 회색 배경
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999; // ModalStyle보다 1 낮게 설정하여 모달이 위에 오도록 함
`;

const TopContent = styled.div`
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: center;
`;

const ContainerStyle = styled.div`
    width: 350px;
    height: 250px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding-top: 30px;
    z-index: 1000;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
`;

const AddItem = styled.input`
    width: 200px;
    height: 40px;
    margin: 10px 15px 10px 15px;
    padding-left: 10px;
    border: 2px solid rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    outline: none;
    font-size: 15px;
`;

const AddCategoryContainer = styled.div`
    margin-top: 55px;
    position: absolute;
    display: flex;
    justify-content: flex-end;
`;

const MessageContainer = styled.text`
    font-size: 12px;
    color: #8c8c8c;
    position: absolute;
`;

const ExitBtn = styled.button`
    font-size: 13px;
    color: gray;
    border: none;
    background-color: white;
`;



const AddCategory = ({ categoryList, isOpen, onclose }) => {

    
    const [newCategory, setNewCategory] = useState("");
    const { addCategory } = useCategory();
    const [showBlankMessage, setShowBlankMessage] = useState(false);

    if(!isOpen) return null;
    
    const handleAddButtonClick = () => {

        if (newCategory.trim() === "") {
            setShowBlankMessage(true);
            setTimeout(() => {
                setShowBlankMessage(false);
            }, 2000);
            return;
        }

        try {
            addCategory(newCategory);
            setNewCategory("");
            onclose();
        } catch (error) {
            console.error("카테고리 추가 중 에러 발생:", error);
        }

    };

    return(
        <div>
            <AddCategoryContainer>

                <ContainerBackground>

                    <ContainerStyle>
                    <TopContent>
                        <MdOutlineAddPhotoAlternate size={30} color="3d3d3d" />

                        <ExitBtn onClick={onclose} style={{ position: 'absolute', top: '10px', right: '10px' }}>
                            닫기
                        </ExitBtn>
                    </TopContent>
                        
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {showBlankMessage && (
                                <MessageContainer>
                                    카테고리를 입력해주세요.
                                </MessageContainer>
                            )}
                        </div>
                        <AddItem
                            placeholder="앨범 이름을 입력하세요."
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)} 
                        />
                        <div style={{display: 'flex', justifyContent: 'center', marginLeft: '-10px', marginBottom: '5px', marginTop: '10px'}}>
                            <CategoryButton text="추가" onClick={handleAddButtonClick} />
                        </div>
                    </ContainerStyle>
                </ContainerBackground>
            </AddCategoryContainer>
        </div>
    );
};

export default AddCategory;