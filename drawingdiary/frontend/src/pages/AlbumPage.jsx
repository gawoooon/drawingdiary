import styled from "styled-components";
import AlbumBox from "../components/album/AlbumBox";
import NavBar from "../components/sidebar/NavBar";
import Button from "../components/Button/Button";
import { useState } from "react";
import AddCategory from "../components/album/AddCategory";
import { CategoryProvider } from "../components/album/CategoryList";

const Body = styled.body`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100vw;
  height: 100vh;
`;

const SidebarContainer = styled.div`
    width: 260px;
    height: 100%;
    position: fixed;
`;

const RightSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: calc(100% - 260px); 
  height: inherit;
  padding-left: 520px;
  box-sizing: border-box;
`;

const AlbumContainer = styled.section`
  width: 100%;
  height: 870px;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    width: 1px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
`;

const AddAlbum = styled.div`
  width: 100%;
  position: sticky;
  display: flex;
  justify-content: end;
  align-items: center;
  margin-top: 20px;
`;

const ErrorMessage = styled.div`
  margin: 0 30px 30px 0;
  color: red;
`;

const AlbumPage = () => {
  const [isAddCategoryVisible, setAddCategoryVisible] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const handleAddCategoryButtonClick = () => {
    setAddCategoryVisible(true);
  };

  const handleClose = () => {
    setAddCategoryVisible(false);
    setErrorMessage("");
  };

  const handleErrorMessage = (message) => {
    setErrorMessage(message);
    
    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
  }

  return (
    <CategoryProvider>
        <Body>
          <SidebarContainer>
            <NavBar />
          </SidebarContainer>
          <RightSection>
            <AlbumContainer>
              <AlbumBox  onErrorMessage={handleErrorMessage}/>
            </AlbumContainer>
            <AddAlbum>
              {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
              <Button text="앨범 추가" onClick={handleAddCategoryButtonClick}></Button>
              {isAddCategoryVisible && <AddCategory onClick={handleClose} />}
              <AddCategory
                isOpen={isAddCategoryVisible}
                onclose={handleClose}
                />
            </AddAlbum>
          </RightSection>
        </Body>
    </CategoryProvider>
  );
}

export default AlbumPage;
