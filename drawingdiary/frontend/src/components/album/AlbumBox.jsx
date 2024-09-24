import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useCategory } from "./CategoryList";
import Modal from "./Modal";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { CgTrash } from "react-icons/cg";

const Container = styled.section`
    width: 100%;
    height: 100%;
    margin: auto;
`;

const AlbumContainer = styled.div`
    width: 100%;
    height: 231px;
    padding: 2px;
    background-color: rgba(237, 237, 237, 0.5);
    border-radius: 10px;
`;

const ScrollSection = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow-x: auto;
    overflow-y: hidden;
    &::-webkit-scrollbar {
        height: 5px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #808080;
        border-radius: 4px;
    }
`;

const PictureContainer = styled.div`
    min-width: 190px;
    height: 200px;
    margin: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    
    &:hover {
        img {
            transform: scale(1.05);
        }
    }
`;

const DateText = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    border-radius: 10px;

    img {
        width: 180px;
        height: 180px;
        border-radius: 10px;
        margin: 5px;
        transition: transform 0.2 ease;
    }
`;

const AlbumHeaders = styled.div`
    width: 100%;
    height: 20px;
    margin: 10px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const CategoryName = styled.div`
    font-size: 20px;
`;

const TrashIcon = styled(CgTrash)`
    color: #3d3d3d;
    border-radius: 50%;
    padding: 5px;
    &:hover {
        background-color: #b7b7b7;
    }
`;

function AlbumBox({ onErrorMessage }) {
    const { removeCategory } = useCategory();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [data, setData] = useState([]);

    const navigate = useNavigate();
    const [checkList, setCheckList] = useState(false);

    const { memberID, getToken } = useAuth();
    const accessToken = getToken();
    
    const fetchAlbum = async () => {
        try {
            const response = await axios.get('http://drawingdiary.kro.kr/api/album/all', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            const newData = response.data.map(entry => ({
                albumID: entry.albumID,
                name: entry.name,
                images: entry.images.map(img => ({
                    date: img.date,
                    imageFile: img.imageFile
                }))
            }));
            setData(newData);
        } catch (error) {
            console.log("error: ", error);
        }
    };

    const showDetails = async (selectedDate) => {
        try {
            const response = await axios.get(`http://drawingdiary.kro.kr/api/diary/${selectedDate}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const dataArray = response.data;

            const diaryText = dataArray.text;
            const weather = dataArray.weather;
            const albumName = dataArray.albumName;
            const formattedDate = dataArray.date.split("-");
            const currentYear = formattedDate[0];
            const month = formattedDate[1];
            const day = formattedDate[2];
            const image = dataArray.imageURL;
            const comment = dataArray.comment;
            const style = dataArray.styleName;
            const sentiment = dataArray.sentiment;

            navigate(`/showDiary/${memberID}/${currentYear}${month}${day}`, {
                state: { date: { currentYear, month, day }, diaryData: { weather, albumName, diaryText, style, image, comment, sentiment } },
            });
        } catch(error) {
            console.log("error: ", error);
        }
    };

    const handleShowDetails = (selectedDate) => {
        showDetails(selectedDate);
    }

    const handleDeleteClick = (category) => {
        setIsModalOpen(true);
        setCurrentCategory(category);
        console.log("category: ", category);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    
    const handleConfirmDelete = async () => {
        setIsModalOpen(false);
        removeCategory(currentCategory, onErrorMessage);
    };

    useEffect(() => {
        if(!checkList) {
            fetchAlbum();
            setCheckList(!checkList);
        }
    }, [checkList]);
    
    return (
        <Container>
            {data.map((categoryEntry) => (
                <div key={categoryEntry.name}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'baseline',
                        }}>
                        <AlbumHeaders isOpen={categoryEntry.albumID}>
                            <CategoryName>{categoryEntry.name}</CategoryName>
                            <TrashIcon size={20} onClick={() => handleDeleteClick(categoryEntry.albumID)} />
                        </AlbumHeaders>
                    </div>

                    <Modal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        onConfirm={handleConfirmDelete}
                    />
                    {categoryEntry.albumID && (
                        <AlbumContainer>
                            {categoryEntry.images.length > 0 ? (
                                <ScrollSection>
                                    {categoryEntry.images.map((item, index) => (
                                        <PictureContainer key={index} onClick={() => handleShowDetails(item.date)}>
                                            <DateText>
                                                <img src={item.imageFile} alt="Album" />
                                                {item.date}
                                            </DateText>
                                        </PictureContainer>
                                    ))}
                                </ScrollSection>
                            ) : (
                                <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                    color: '#1f1f1f'
                                }}>
                                    앨범에 일기를 추가하려면 먼저 작성하세요.
                                </div>
                            )}
                        </AlbumContainer>
                    )}
                </div>
            ))}
        </Container>
    );
};

export default AlbumBox;
