import * as React from "react";
import { useMemo, useState, useEffect } from "react";

import { Paper, Box, Grid, Card } from "@mui/material";
import Typography from "@mui/joy/Typography";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { Link, useLocation, useHistory } from "react-router-dom";
import dayjs from "dayjs";

import DailyConsumptionGraph from "../../components/util/DailyConsumptionGraph";
import PaymentCustomDrinkMenuItem from "../../components/util/PaymentCustomDrinkMenuItem";
import CustomOption from "../../components/CustomOption";

import { cafeDrinkData, newDrinkRecord } from "../../api/order";
import DailyOtherInfo from "../../components/DailyOtherInfo";

function PaymentCustomPage(props) {
  const location = useLocation();
  const history = useHistory();
  const drinkItem = props.location.state.drinkItem;
  const franchiseId = props.location.state.drinkItem.franchiseId;
  const drinkName = props.location.state.drinkItem.drinkName;
  const [drinkDetail, setDrinkDetail] = useState({
    storeId: 0,
    storeName: "",
    drinkResponseDtos: [
      {
        drinkId: 0,
        drinkName: "",
        size: "",
        vol: 0,
        img: "",
        caffeine: 0,
        sugar: 0,
        cal: 0,
        price: 0,
        shot: 0,
        whip: -1,
        franchiseId: 0,
        storeName: "",
        cnt: 0,
      },
    ],
    optionDtos: [
      {
        id: 0,
        franchiseId: 0,
        type: "",
        caffeine: 0,
        sugar: 0,
        price: 0,
        cal: 0,
      },
    ],
    dayDataDto: {
      id: 0,
      userId: 0,
      date: "",
      caffeGoal: 0,
      sugarGoal: 0,
      caffeDaily: 0,
      sugarDaily: 0,
      calDaily: 0,
      moneyDaily: 0,
      caffeSuccess: true,
      sugarSuccess: true,
    },
  });
  // console.log(drinkDetail.optionDtos)
  const basicDrink = drinkDetail.drinkResponseDtos[0];
  const [changedOtherInfo, setChangedOtherInfo] = useState({
    money: 0,
    cal: 0,
  });
  console.log(drinkDetail.optionDtos);

  // ?????? ???????????? ????????? ??????

  const [orderDetail, setOrderDetail] = useState({
    drinkId: basicDrink.drinkId,
    regDate: dayjs().format("YYYY-MM-DD"),
    caffeine: basicDrink.caffeine,
    sugar: basicDrink.sugar,
    cal: basicDrink.cal,
    price: basicDrink.price,
    shot: basicDrink.shot,
    whip: basicDrink.whip,
    sugarContent: "BASIC",
    syrup: 0,
    vanilla: 0,
    hazelnut: 0,
    caramel: 0,
    memo: "",
    storeName: location.state.franchiseName,
  });
  console.log(orderDetail)

  const [sizePrice, setSizePrice] = useState(basicDrink.price)

  useEffect(() => {
    const nowSize = drinkDetail.drinkResponseDtos.find((size) => size.drinkId === orderDetail.drinkId)
    setSizePrice(nowSize.price)
  }, [orderDetail.drinkId])

  console.log(sizePrice)
  // ?????? ?????? ????????? ?????? ??????
  const optionPriceTable = []
  {drinkDetail.optionDtos.map((option) => {
    optionPriceTable.push({'type' : option.type.toLowerCase(), 'price': option.price})
    // option.type.toLowerCase(): option.price
  })}
  console.log(optionPriceTable)


  // ????????? ?????? ????????? orderDetail ?????????
  useEffect(() => {
    setOrderDetail({
      ...orderDetail,
      drinkId: basicDrink.drinkId,
      caffeine: basicDrink.caffeine,
      sugar: basicDrink.sugar,
      cal: basicDrink.cal,
      price: basicDrink.price,
      shot: basicDrink.shot,
      whip: basicDrink.whip,
      sugarContent: "BASIC",
      storeName: location.state.franchiseName,
    });
  }, [basicDrink]);
  console.log(basicDrink);

  // ?????? ??????, ????????? ????????? ??????
  useEffect(() => {
    setChangedOtherInfo({
      money: orderDetail.price,
      cal: orderDetail.cal,
    });
  }, [orderDetail]);


  // ?????? daily + ???????????? ????????? ??????(??? ?????? ????????? & ?????????)
  const withoutCustom = {
    caffeGoal: drinkDetail.dayDataDto.caffeGoal,
    caffeDaily: drinkDetail.dayDataDto.caffeDaily + basicDrink.caffeine,
    sugarGoal: drinkDetail.dayDataDto.sugarGoal,
    sugarDaily: drinkDetail.dayDataDto.sugarDaily + basicDrink.sugar,
    calDaily: drinkDetail.dayDataDto.calDaily + basicDrink.cal,
    moneyDaily: drinkDetail.dayDataDto.moneyDaily + basicDrink.price,
  };

  //????????? ????????? ????????? ??????
  const [changeInfo, setChangeInfo] = useState({
    caffeine: 0,
    sugar: 0,
    money: 0,
    cal: 0,
  });

  // ?????????(??????) ?????? ??????
  const getRecordDate = (newValue) => {
    setOrderDetail({
      ...orderDetail,
      regDate: newValue,
    });
  };

  // ??????????????? ???????????? ??????
  const onClickOptionChangeHandler = (field, value) => {
    console.log(field, value);
    if (orderDetail[field] + value >= 0) {
      // ???????????? ?????? field?????? type????????? ???????????? ?????? ??????
      const updateOption = drinkDetail.optionDtos.find(
        (option) => option.type.toLowerCase() === field
      );
      if (updateOption.type.toLowerCase() === "whip") {
        // ?????? ?????? (true??? ????????? false??? ???????????? + ?????? ?????? ???????????? ???????????????)
        if (orderDetail.whip !== value) {
          // ????????? ???????????? ?????? ????????? ?????? ?????????
          const whipChangePrice =
          basicDrink.whip === false && value === true
            ? 500
            : basicDrink.whip === true && value === false
            ? 0
            : basicDrink.whip === false && value === false
            ? -500
            : 0;
          setOrderDetail({
            ...orderDetail,
            whip: value,
            // ?????? ?????? ????????? ????????????
            whipPrice: value * updateOption.price,
            caffeine: value
              ? orderDetail["caffeine"] + value * updateOption.caffeine
              : Math.max(orderDetail["caffeine"] - updateOption.caffeine, 0),
            sugar: value
              ? orderDetail["sugar"] + value * updateOption.sugar
              : Math.max(orderDetail["sugar"] - updateOption.sugar, 0),
            cal: value
              ? orderDetail["cal"] + value * updateOption.cal
              : Math.max(orderDetail["cal"] - updateOption.cal, 0),
            price: Math.max(orderDetail["price"] + whipChangePrice, 0),
          });
        }
      } else {
        // ????????? ??????
        setOrderDetail({
          ...orderDetail,
          [field]: orderDetail[field] + value,
          caffeine: Math.max(orderDetail["caffeine"] + value * updateOption.caffeine, 0),
          sugar: Math.max(orderDetail["sugar"] + value * updateOption.sugar, 0),
          cal: Math.max(orderDetail["cal"] + value * updateOption.cal, 0),
          price: Math.max(orderDetail["price"] + value * updateOption.price, 0),
          // caffeine
        });
      }
    }
  };

  // ????????? ????????? ?????? ?????? ?????????(?????? ?????? ?????????(?????? ????????? ????????? ????????? onClickOptionHandler?????? ????????? ?????? ???????????????))
  const onClickSizeChangeHandler = (index) => {
    setOrderDetail({
      ...orderDetail,
      drinkId: drinkDetail.drinkResponseDtos[index].drinkId,
      caffeine: drinkDetail.drinkResponseDtos[index].caffeine,
      sugar: drinkDetail.drinkResponseDtos[index].sugar,
      cal: drinkDetail.drinkResponseDtos[index].cal,
      price: drinkDetail.drinkResponseDtos[index].price,
      shot: drinkDetail.drinkResponseDtos[index].shot,
      whip: drinkDetail.drinkResponseDtos[index].whip,
      sugarContent: "BASIC",
      syrup: 0,
      vanilla: 0,
      hazelnut: 0,
      caramel: 0,
    });
    //   setPriceDetail({
    //     ...priceDetail,
    //     sizePrice: drinkDetail.drinkResponseDtos[index].price,
    // })
  };
  console.log(basicDrink.whip);
  // ?????? ?????????........????????? ?????? ????????? ??? ??? + ??????????????? ??? ???????????? ?????? ?????? ??? ????????? 0.5, 1, 1.5 ???????????????????
  const onclickSugarContentHandler = (type, value) => {
    const nowSize = drinkDetail.drinkResponseDtos.find(
      (drink) => drink.drinkId === orderDetail.drinkId
    );
    const whipOption = drinkDetail.optionDtos.find(
      (option) => option.type.toLowerCase() === "whip"
    );
    const syrupOption = drinkDetail.optionDtos.find(
      (option) => option.type.toLowerCase() === "syrup"
    );
    const vanillaOption = drinkDetail.optionDtos.find(
      (option) => option.type.toLowerCase() === "vanilla"
    );
    const hazelnutOption = drinkDetail.optionDtos.find(
      (option) => option.type.toLowerCase() === "hazelnut"
    );
    const caramelOption = drinkDetail.optionDtos.find(
      (option) => option.type.toLowerCase() === "caramel"
    );
    let standardSugar =
      nowSize.sugar +
      syrupOption.sugar * orderDetail.syrup +
      vanillaOption.sugar * orderDetail.vanilla +
      hazelnutOption.sugar * orderDetail.hazelnut +
      caramelOption.sugar * orderDetail.caramel;
    // ????????? ???????????? ????????? ??????????????? ?????? ????????? ????????? ???????????? ???????????? ?????? (????????????)
    if (basicDrink.whip === false) {
      standardSugar += whipOption.sugar * orderDetail.whip;
    }
    setOrderDetail({
      ...orderDetail,
      sugar: standardSugar * value,
      sugarContent: type,
    });
  };

  useMemo(() => {
    const getCustomData = async () => {
      await cafeDrinkData(
        franchiseId,
        drinkName,
        location.state.drinkItem.storeName,
        (res) => {
          console.log(res.data);
          return res.data;
        },
        (err) => {
          console.log(err);
        }
      ).then((data) => setDrinkDetail(data));
    };
    getCustomData();
    console.log("storeId : " + drinkDetail.storeId);
  }, []);

  console.log(orderDetail);
  console.log(withoutCustom);

  // ????????? ???????????? ?????? ????????? ??????(??? ?????? ?????? ???????????? ????????? ???????????? Math.max ?????? ??????)
  useEffect(() => {
    setChangeInfo({
      caffeine: orderDetail.caffeine - basicDrink.caffeine,
      sugar: orderDetail.sugar - basicDrink.sugar,
      money: orderDetail.price - basicDrink.price,
      cal: orderDetail.cal - basicDrink.cal,
    });
  }, [orderDetail]);
  console.log(orderDetail.sugar);
  console.log(basicDrink.sugar);

  // ?????? ?????? axios
  const addDrinkRecord = async () => {
    await newDrinkRecord(
      orderDetail,
      (res) => {
        console.log(res);
        return res;
      },
      (err) => {
        console.log(err);
      }
    )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          history.push("/mypage");
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: "000000",
  }));



  return (
    <div>
      <Typography level="h3" fontSize="xl" fontWeight="xl">
        Custom
      </Typography>
      <Grid container>
        <Box sx={{ flexGrow: 1 }} marginTop={1}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Item sx={{ fontWeight: "700" }}>{location.state.drinkItem.storeName}</Item>
            </Grid>
            {/* <Grid item xs={4}>
              <Item style={{ fontWeight: "700" }}>
                {location.state.drinkItem.branch ? location.state.drinkItem.branch : "-"}
              </Item>
            </Grid> */}
            <Grid item xs={12}>
              <PaymentCustomDrinkMenuItem data={drinkItem} getRecordDate={getRecordDate} />
            </Grid>
          </Grid>
        </Box>
      </Grid>
      {/* ?????? */}
      <Card>
        <DailyConsumptionGraph selectDrinkInfo={changeInfo} consumptionInfo={withoutCustom} />
        <DailyOtherInfo
          data={drinkDetail.dayDataDto}
          changedOtherInfo={changedOtherInfo}
        ></DailyOtherInfo>
      </Card>

      <CustomOption
        drinkDetail={drinkDetail}
        orderDetail={orderDetail}
        onClickOptionChangeHandler={onClickOptionChangeHandler}
        onClickSizeChangeHandler={onClickSizeChangeHandler}
        onclickSugarContentHandler={onclickSugarContentHandler}
      />

      <Grid item>
        <Link
          style={{ textDecoration: "none" }}
          to={{ pathname: `/payment`, state: { orderDetail, drinkItem, drinkDetail, optionPriceTable, basicDrink, sizePrice } }}
        >
          <Button
            variant="contained"
            sx={{
              borderRadius: 2,
              background: "#ffba00",
              fontSize: 16,
              fontWeight: "700",
              mt: 1,
              ml: 26,
            }}
          >
            ????????????
          </Button>
        </Link>
      </Grid>
    </div>
  );
}

export default PaymentCustomPage;
