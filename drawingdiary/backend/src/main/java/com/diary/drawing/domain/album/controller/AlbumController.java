package com.diary.drawing.domain.album.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.diary.drawing.domain.album.dto.AlbumListDTO;
import com.diary.drawing.domain.album.dto.AlbumRequestDTO;
import com.diary.drawing.domain.album.service.AlbumService;
import com.diary.drawing.global.jwt.domain.PrincipalDetails;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Album", description = "Album API")
@RestController
public class AlbumController {

    @Autowired
    private AlbumService albumService;

    /* 앨범 추가
     * @Header AccessToken
     * @param albumname
     */
    @Operation(summary = "앨범 추가")
    @PostMapping("/api/album")
    public ResponseEntity<?> addAlbum(@Valid @RequestBody AlbumRequestDTO albumDTO, @AuthenticationPrincipal PrincipalDetails principalDetails) throws Exception{

        albumService.addAlbum(albumDTO, principalDetails.getMemberID());
        return ResponseEntity.ok("앨범 추가 완료");
    }

    /* 토큰으로 앨범 삭제 api
     *
     * @Header AccessToken
     * @param 링크에 albumID
     */
    @Operation(summary = "토큰으로 앨범 삭제")
    @DeleteMapping("/api/album/{albumID}")
    public ResponseEntity<?> deleteAlbum(@PathVariable("albumID") Long albumID, @AuthenticationPrincipal PrincipalDetails principalDetails) {
        return albumService.deleteAlbum(albumID, principalDetails.getMemberID());
    }
    

    /* 앨범 리스트 넘겨주는 api
     *
     * @Header AccessToken
     * @param 링크에 memberID   + 이후에 accessToken으로 변경 예정
    */
    @Operation(summary = "멤버별 앨범 리스트")
    @GetMapping("/api/album/list")
    public ResponseEntity<?> getAlbumList(@AuthenticationPrincipal PrincipalDetails principalDetails){
        // member 존재한다면
        List<AlbumListDTO> response =  albumService.getAlbumsByMember(principalDetails.getMemberID());
        return ResponseEntity.ok(response);
    }

    /* 토큰으로 앨범 페이지 앨범 + 이미지 넘겨주는 api
     *
     * @Header AccessToken
     *
    */
    @Operation(summary = "이미지 포함 앨범전체반환")
    @GetMapping("/api/album/all")
    public ResponseEntity<?> getAlbumAll(@AuthenticationPrincipal PrincipalDetails principalDetails){
        return albumService.getAllOfAlbum(principalDetails.getMemberID());
    }
    
}
