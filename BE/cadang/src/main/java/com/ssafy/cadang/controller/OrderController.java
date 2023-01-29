package com.ssafy.cadang.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "주문", description = "주문 관련 api 입니다.")
@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderController {

    @PostMapping
    @Operation(summary = "주문 등록", description = "신규 주문을 등록합니다.")
    public ResponseEntity<String> orderRegister(){

        return new ResponseEntity<String>("SUCCESS", HttpStatus.ACCEPTED);
    }
}