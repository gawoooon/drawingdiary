package com.diary.drawing.domain.imagestyle.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;

@Entity
@Getter
@Table(name = "ImageStyle")
public class ImageStyle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long styleID;

    @Column(length = 30)
    private String styleName;

    public ImageStyle(){}

    @Builder
    public ImageStyle(String styleName, String description){
        this.styleName = styleName;
    }
}
