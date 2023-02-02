package com.ssafy.cadang.error;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ExceptionEnum {
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."),

    DATA_NOT_FOUND(HttpStatus.NOT_FOUND, "데이터를 찾을 수 없습니다."),
    DRINK_NOT_FOUND(HttpStatus.NOT_FOUND, "음료를 찾을 수 없습니다.");

    private final HttpStatus httpStatus;
    private final String message;

}