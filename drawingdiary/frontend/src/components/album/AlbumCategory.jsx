import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useCategory } from "./CategoryList";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";
import { MdCreateNewFolder } from "react-icons/md";

const CategoryStyle = styled.select`
  width: 120px;
  height: 36px;
  margin: 10px 10px 10px 20px;
  padding-left: 6px;
  font-size: 15px;
  border: 1px solid black;
  outline: none;
  border-radius: 10px;
  align-items: center;
`;

const CategoryBox = styled.div`
  display: flex;
  align-items: center;
`;

const AlbumCategory = ({ onSelectAlbum }) => {
  const { categoryList } = useCategory();
  const { getToken } = useAuth();
  const accessToken = getToken();
  const [selectedAlbumID, setSelectedAlbumID] = useState(0);

  const fetchBaseCategory = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/album/list", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const baseIndex = response.data.findIndex(
        (item) => item.albumName === "기본"
      );
      if (baseIndex !== -1) {
        const baseID = response.data[baseIndex].albumID;
        setSelectedAlbumID(baseID);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    if (selectedAlbumID === 0) {
      fetchBaseCategory();
    }
    onSelectAlbum(selectedAlbumID);
  }, [selectedAlbumID, fetchBaseCategory]);

  const handleAlbumChange = (event) => {
    // 선택한 앨범의 ID를 상태에 저장
    setSelectedAlbumID(event.target.value);
  };

  return (
    <CategoryBox>
      <text style={{ fontSize: "16px" }}>앨범</text>
      <CategoryStyle onChange={handleAlbumChange} value={selectedAlbumID}>
        {categoryList.map((keyword) => (
          <option key={keyword.memberID} value={keyword.albumID}>
            {keyword.albumName}
          </option>
        ))}
      </CategoryStyle>
    </CategoryBox>
  );
};

export default AlbumCategory;
