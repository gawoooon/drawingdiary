import { useState } from "react";
import styled from "styled-components";
import AddCategory from "../components/album/AddCategory";
import AlbumBox from "../components/album/AlbumBox";
import { CategoryProvider } from "../components/album/CategoryList";
import Button from "../components/button/Button";
import NavBar from "../components/sidebar/NavBar";

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
  height: 100vh;
  padding-left: 260px;
  box-sizing: border-box;
`;

const AlbumContainer = styled.section`
  width: 100%;
  max-width: 1000px;
  height: 100%;
  margin-top: 20px;
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
  max-width: 1000px;
  display: flex;
  justify-content: flex-end;
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
  };

  return (
    <CategoryProvider>
      <Body>
        <SidebarContainer>
          <NavBar />
        </SidebarContainer>
        <RightSection>
          <AlbumContainer>
            <AlbumBox onErrorMessage={handleErrorMessage} />
          </AlbumContainer>
          <AddAlbum>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <Button
              text="앨범 추가"
              onClick={handleAddCategoryButtonClick}
            ></Button>
            {/* AddCategory 컴포넌트를 한 번만 렌더링하고 prop 이름을 맞춤 */}
            <AddCategory isOpen={isAddCategoryVisible} onclose={handleClose} />
          </AddAlbum>
        </RightSection>
      </Body>
    </CategoryProvider>
  );
};

export default AlbumPage;
