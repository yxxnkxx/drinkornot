package com.ssafy.cadang.dto.cafe;

import com.ssafy.cadang.dto.data.DayDataDto;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
public class DrinksForCafeDto {

    List<DrinkResponseDto> drinkableDrinks;
    List<DrinkResponseDto> nonDrinkableDrinks;

    DayDataDto dayDataDto;
    Long franchiseId;
    Long storeId;
    String storeName;

    public DrinksForCafeDto(List<DrinkResponseDto> drinkableDrinks, List<DrinkResponseDto> nonDrinkableDrinks,
                            DayDataDto dayDataDto, Long franchiseId, Long storeId, String storeName){
        this.drinkableDrinks = drinkableDrinks;
        this.nonDrinkableDrinks = nonDrinkableDrinks;
        this.dayDataDto = dayDataDto;
        this.franchiseId = franchiseId;
        this.storeId = storeId;
        this.storeName = storeName;
    }
}
