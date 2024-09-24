import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';

export const CategoryContext = React.createContext();

function useCategoryList (){
    const [categoryList, setCategoryList] = useState([]);
    const { memberID, getToken } = useAuth(); // 로그인한 상태에서 사용자의 memberID를 불러옴
    const accessToken = getToken();

    const fetchCategoryList = useCallback(async () => {
        if(memberID) {// 로그인 상태 확인
            try {
                const response = await axios.get(`http://drawingdiary.kro.kr/api/album/list`, {  //[가원] api /{memberID} 사용X로 수정
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const fetchedCategoryList = response.data;
                setCategoryList(fetchedCategoryList);
            } catch (error) {
                console.error("카테고리 리스트를 불러오는 중 에러 발생: ", error);
            }
        }
    }, [memberID]);
    
    useEffect(() => {
        // 카테고리 리스트를 불러오기
        fetchCategoryList();
    }, [memberID, fetchCategoryList]);

    const addCategory = async (newCategory) => {
 
        if (newCategory && !categoryList.some(category => category.albumName === newCategory)) {
            try {
                await axios.post('http://drawingdiary.kro.kr/api/album', {
                    albumName: newCategory,
                }, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                window.location.replace('/album');

            } catch (error) {
                console.log("카테고리 추가 중 에러 발생: ", error);
            }
        };
    };

    //카테고리 삭제 함수
    const removeCategory = async (categoryToRemove, onError) => {

        if(categoryToRemove) {
            try {
                await axios.delete(`http://drawingdiary.kro.kr/api/album/${categoryToRemove}`, {
                    headers : {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                window.location.replace('/album');
            } catch (error) {
                if (error.response.data.errorCode === 600) {
                    console.log("에러코드: ", error.response.data.errorCode);
                    onError("기본 카테고리는 삭제할 수 없습니다."); // 에러 상태 업데이트
                } else {
                    onError("카테고리 삭제 중 에러 발생"); // 일반 에러 처리
                }
            }
        }

    };

    return { categoryList, addCategory,  removeCategory };
};

const CategoryProvider = ({ children }) => {
    const { categoryList, addCategory, removeCategory } = useCategoryList();
    return(
        <CategoryContext.Provider value={ {categoryList, addCategory, removeCategory }}>
            {children}
        </CategoryContext.Provider>
    );
};

const useCategory = () => useContext(CategoryContext);

export { CategoryProvider, useCategory, useCategoryList };

