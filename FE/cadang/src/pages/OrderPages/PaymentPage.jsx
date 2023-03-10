import React, { useState, useRef } from "react";
import { Paper, Box, Grid, Card } from "@mui/material";
import { styled } from "@mui/material/styles";
import DrinkMenuItem from "../../components/util/DrinkMenuItem";
import PaymentMoney from "../../components/PaymentMoney";
import Typography from "@mui/joy/Typography";
import CardMedia from "@mui/material/CardMedia";
import kakaopay from "../../assets/payment_icon_yellow_large.png";
import Button from "@mui/material-next/Button";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { orderItem } from "../../recoil/atom/paymentItem";
import { order } from "../../api/pay";

export default function PaymentPage(props) {
  const location = useLocation();
  const orderDetail = location.state.orderDetail;
  const drinkItem = location.state.drinkItem;
  const storeId = location.state.drinkDetail.storeId;
  const optionPriceTable = location.state.optionPriceTable;
  const sizePrice = location.state.sizePrice;
  console.log(orderDetail)
  console.log(drinkItem)
  console.log(optionPriceTable)
  console.log(sizePrice)

  // console.log("storeId : " + storeId);
  // console.log("orderDetail-syrup : " + orderDetail.syrup);
  // console.log("orderDetail-vanilla : " + orderDetail.vanilla);
  // console.log("orderDetail-hazelnut : " + orderDetail.hazelnut);
  // console.log("orderDetail-caramel : " + orderDetail.caramel);

  const kakaoPayDiv = useRef();
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: "000000",
  }));

  const item = {
    drinkId: orderDetail.drinkId,
    caffeine: orderDetail.caffeine,
    sugar: orderDetail.sugar,
    cal: orderDetail.cal,
    price: orderDetail.price,
    shot: orderDetail.shot,
    whip: orderDetail.whip,
    sugarContent: orderDetail.sugarContent,
    syrup: 0,
    vanilla: 0,
    hazelnut: 0,
    caramel: 0,
    photo: drinkItem.img,
    storeName: drinkItem.storeName,
    storeId: storeId,
  };

  const orderRegist = async () => {
    await order(
      item,
      (res) => {
        // console.log("=======!!!!!!!!!!!!!!=========");
        // console.log(res.data);
        return res.data;
      },
      (err) => console.log(err)
    ).then((data) => setDrinkAtom());
  };

  const [drinkAtom, setDrinkAtom] = useRecoilState(orderItem);
  setDrinkAtom(orderDetail);
  // console.log("drinkAtom !!!!!!!!! : " + drinkAtom.sugarContent);
  const [payItem, setPayItem] = useState({
    // ???????????? ????????? ??????
    next_redirect_pc_url: "",
    tid: "",
    // ????????? ????????? ???????????????
    params: {
      cid: "TC0ONETIME",
      partner_order_id: "partner_order_id",
      partner_user_id: "partner_user_id",
      item_name: drinkItem.drinkName,
      quantity: 1,
      total_amount: orderDetail.price,
      vat_amount: orderDetail.price * 0.1,
      tax_free_amount: 0,
      approval_url: "http://i8a808.p.ssafy.io/pay-success",
      fail_url: "http://i8a808.p.ssafy.io/pay-fail",
      cancel_url: "http://i8a808.p.ssafy.io/main",
    },
  });

  // useEffect(() => {
  //   setDrinkAtom(drink);
  //   console.log(drink);
  // }, []);

  const onClickKakaopay = (event) => {
    // console.log("??????????????? ???????????? ??????!!!!!!!!!!!!");
    const { params } = payItem;
    // console.log(params);

    // const url = "";
    if (btnActive === false) {
      alert("?????? ????????? ??????????????????.????");
    } else {
      axios({
        // ???????????? ????????? ???????????? ?????????????????? ?????? ?????? url??? ??????
        url: "https://kapi.kakao.com/v1/payment/ready",
        // ?????? ?????? API??? POST ??????????????? ??????.
        method: "POST",
        headers: {
          Authorization: `KakaoAK ${process.env.REACT_APP_KAKAOPAY_KEY}`,
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        // headers: {
        //   // ????????? developers??? ????????? admin?????? ????????? ?????? ??????.
        //   Authorization: `KakaoAK `,
        //   "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        // },
        // ????????? ???????????????
        params,
      }).then((response) => {
        // console.log(response);
        // console.log(response.data.next_redirect_pc_url);

        if (response.status === 200) {
          orderRegist();
          // ????????? ??????????????? ?????? ???????????? ????????? ??? ?????? ???
          // <Link to="response.data.next_redirect_pc_url" />;
          // console.log("orderDetail ==> " + orderDetail.drinkId);
          window.open(response.data.next_redirect_mobile_url);
          // window.open(response.data.next_redirect_pc_url);
        } else if (response.status === 404) {
          // 404 ????????????
          <Link to="/error404">error 404</Link>;
        } else if (response.status === 500) {
          // 500 ????????????
          <Link to="/error500">error500</Link>;
        }

        // ?????? data??? state ??????
        // setPayItem({ next_redirect_pc_url, tid });
      });
    }
  };

  let [btnActive, setBtnActive] = useState(false);

  const toggleActive = (e) => {
    if (btnActive === false) {
      kakaoPayDiv.current.style.backgroundColor = "#FE9A2E";
      setBtnActive((prev) => {
        return true;
      });
    } else {
      kakaoPayDiv.current.style.backgroundColor = "#FFFFFF";
      setBtnActive((prev) => {
        return false;
      });
    }

    // console.log(btnActive);
  };

  return (
    <div style={{ padding: "3%", marginTop: "3%" }}>
      {/* =========== ?????? ?????? /// ?????? ?????? ============= */}
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Item sx={{ fontWeight: "700" }}>{drinkItem.storeName}</Item>
          </Grid>
          {/* <Grid item xs={4}>
            <Item style={{ fontWeight: "700" }}>?????????</Item>
          </Grid> */}
        </Grid>
      </Box>
      {/* =============================================== */}
      <div style={{ marginTop: "3%" }}>
        <DrinkMenuItem drinkItem={drinkItem} />
      </div>
      {/* ?????? ????????? ?????? ?????? ????????? ?????? ????????? ?????? ?????? ?????? */}
      <PaymentMoney drinkItem={location.state.basicDrink} optionPriceTable={optionPriceTable} orderDetail={orderDetail} sizePrice={sizePrice}/>
      {/* ======================================== */}
      <Card style={{ background: "#ffffff" }} sx={{ p: 1, mt: "3%" }}>
        <Grid container>
          <Grid item xs={8} sx={{ boxShadow: 0, display: "flex", justifyContent: "flex-start" }}>
            <Typography
              sx={{
                display: "inline",
                fontSize: 18,
                fontWeight: "700",
              }}
            >
              ??? ?????? ??????
            </Typography>
          </Grid>
          <Grid item xs={4} sx={{ boxShadow: 0, display: "flex", justifyContent: "flex-end" }}>
            <Typography
              sx={{
                display: "inline",
                fontSize: 18,
                fontWeight: "700",
              }}
            >
              {orderDetail.price} ???
            </Typography>
          </Grid>
        </Grid>
      </Card>
      {/* ============================================= */}
      <Box
        style={{ marginTop: "10%" }}
        component="span"
        sx={{ display: "block", fontSize: 18, fontWeight: "700" }}
      >
        ?????? ??????
      </Box>
      <Card onMouseDown={toggleActive} sx={{ display: "flex", p: 1, mt: 1 }} ref={kakaoPayDiv}>
        <CardMedia component="img" sx={{ width: 100 }} image={kakaopay} alt="kakaopay" />
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: "700",
            mt: 1,
            ml: 8,
          }}
        >
          ???????????????
        </Typography>
      </Card>
      <Grid sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          onMouseDown={onClickKakaopay}
          variant="contained"
          sx={{
            borderRadius: 2,
            background: "#F7BE81",
            fontSize: 15,
            fontWeight: "700",
            mt: 3,
            ml: 24,
          }}
        >
          ????????????
        </Button>
      </Grid>
    </div>
  );
}
