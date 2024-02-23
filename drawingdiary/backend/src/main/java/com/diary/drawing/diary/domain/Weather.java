package com.diary.drawing.diary.domain;

import java.util.Arrays;

public enum Weather {

    none("none"),       //을 추가해서 저장되지 않았을떄 api 사용하도록 추가?
    clearsky(" clear sky"),
    fewclouds(" few clouds"),
    scatteredclouds(" scattered clouds"),
    brokenclouds(" broken clouds"),
    showerrain(" shower rain"),
    rain(" rain"),
    thunderstorm(" thunderstorm"),
    snow(" snow"),
    mist(" mist"),
    lightsnow(" light snow")
    ;

    private final String label;

    Weather(String label){
        this.label = label;
    }

    public String lable(){
        return label;
    }

    public static Weather valueOfLabel(String label){
        return Arrays.stream(values())
                .filter(value -> value.label.equals(label))
                .findAny()
                .orElse(none);
    }

}
