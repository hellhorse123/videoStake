// import {useDispatch, useSelector} from 'react-redux'
// import { userData } from '../../redux/actions'

// import Modal from '../../Components/modal-downloads/Modal';
// import {Button} from '../../Components/button/Button';

import React, { useContext, useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import Avatar from "react-avatar";

import Grid from "@mui/material/Grid";

import { MyContext } from "../../MyContext";
import Navigation from "../../layout/navigation/navigation";
import "./Cabinet.scss";
import Header from "../../layout/header/Header";
import { Modal } from "../../Modal/Modal";
import { CardDataModal } from "../../Modal/CardDataModal";
// import skeleton from '../../img/skeleton.svg';
// import monkeyLoader from '../../img/monkeyLoader.gif'
import CabinetPreloader from "../../Components/common/CabinetPreloader/CabinetPreloader";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

// const CabinetContext = React.createContext()

const Button = styled.button`
  float: right;
  display: block;
  line-height: 20px;
  height: 50px;
  min-width: 220px;
  padding: 10px 24px;
  overflow: hidden;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
  text-shadow: 0 100px 0 #fff, 1px 76px 10px #000;
  color: #fff;
  background: #fbbc05;
  border: 0;
  /* border-right: 2px solid #FFF;
    border-left: 2px solid #FFF; */

  transition: all 0.3s ease-in-out;

  :hover {
    // text-shadow: 0 50px 0 #fff, 1px 51px 20px #fff;
    // margin-top: -100px;
    // height: 150px;
    background: #6751b3;
  }
`;

function ReadMore({ children, maxCharacterCount = 100 }) {
  const text = children;
  const [isTruncated, setIsTruncated] = useState(true);
  const resultString = isTruncated ? text.slice(0, maxCharacterCount) : text;

  function toggleIsTruncated() {
    setIsTruncated(!isTruncated);
  }
  return (
    <p className="has-text-left">
      {resultString}
      {text.length < 100 ? null : (
        <div className="rmb">
          <span onClick={toggleIsTruncated} className="read-more-button">
            {isTruncated ? "ЕЩЁ" : "СКРЫТЬ"}
          </span>
        </div>
      )}
    </p>
  );
}

const Cabinet = () => {
  const [showModal, setShowModal] = useState(false);
  const [showCardDataModal, setShowCardDataModal] = useState(false);
  let [error, setError] = useState(null);
  let [earned, setEarned] = useState(0);

  useEffect(() => {
    fetch("/api/user/my/earn")
      .then((result) => (result = result.json()))
      .then((result) => {
        setEarned(result);
      });
  }, []);

  const openModal = () => {
    setShowModal((prev) => !prev);
  };

  const openCardDataModal = () => {
    setShowCardDataModal((prev) => !prev);
  };

  const { isAuthorized, isFetching, userData, videos } = useContext(MyContext);
  console.log(
    isAuthorized,
    isFetching,
    userData,
    videos,
    userData?.subscribers,
    earned
  );



  if (error) return <div>{`Error: ${error.message}`}</div>; // ?????

  if (isFetching) {
    return <CabinetPreloader />;
  }
  if (!isAuthorized) {
    return <Redirect to="/logreg1" />;
  } else
    return (
      <>
        <Header />
        <div className="Max">
          <Row>
            <Col sm={2}>
              <Navigation key="navigation" />
            </Col>
            <Col>
              <div className="CabinetBox">
                <div className="ProfileInfo">
                  <Avatar
                    className="ProfileImg"
                    name={userData.nickname}
                    size="68"
                  />
                  <div className="ChannelName">
                    {userData.nickname}
                    <br />
                    <p>
                      Количество подписчиков: &nbsp;
                      {userData?.subscribers?.length}
                    </p>
                    {/* <p>
                      Данные карты: &nbsp;
                      {userData?.cardNumber}
                    </p> */}
                  </div>
                  <div className="ccd">
                    <Grid item>
                      <Grid container direction="column" style={{ gap: 10 }}>
                        <Grid item>
                          <button className="CardDataButton"
                            style={{
                              background: userData?.cardNumber
                                ? "#fbbc05"
                                : "#EA4335",
                            }}
                            onClick={openCardDataModal}
                          >
                            Платежные данные
                          </button>
                        </Grid>
                        <Grid item>
                          <Button onClick={openModal}>Добавить Видео</Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </div>
                <Grid container className="State">
                  <Grid container justifyContent="center">
                    <h5>Ваш заработок:</h5>
                  </Grid>
                  <Grid container justifyContent="center" style={{ gap: 100 }}>
                    <Grid
                      container
                      xs
                      justifyContent="center"
                      style={{ gap: 10, textAlign: "center" }}
                    >
                      <Grid
                        item
                        container
                        direction="column"
                        xs
                        style={{ gap: 10 }}
                      >
                        <Grid item xs>
                          <h4>{earned.earnedTotal}</h4>
                        </Grid>
                        <Grid item xs>
                          За все время
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        container
                        direction="column"
                        xs
                        style={{ gap: 10 }}
                      >
                        <Grid item xs>
                          <h4>{earned.earnedTotalFromMyVideos}</h4>
                        </Grid>
                        <Grid item xs>
                          Мои видео
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        container
                        direction="column"
                        xs
                        style={{ gap: 10 }}
                      >
                        <Grid item xs>
                          <h4>{earned.earnedTotalFromMyViews}</h4>
                        </Grid>
                        <Grid item xs>
                          Мои просмотры
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      xs
                      justifyContent="center"
                      style={{ gap: 10, textAlign: "center" }}
                    >
                      <Grid
                        item
                        container
                        direction="column"
                        xs
                        style={{ gap: 10 }}
                      >
                        <Grid item xs>
                          <h4>{earned.earnedTotalPerPeriod}</h4>
                        </Grid>
                        <Grid item xs>
                          В этом месяце
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        container
                        direction="column"
                        xs
                        style={{ gap: 10 }}
                      >
                        <Grid item xs>
                          <h4>{earned.earnedPerPeriodFromMyVideos}</h4>
                        </Grid>
                        <Grid item xs>
                          Мои видео
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        container
                        direction="column"
                        xs
                        style={{ gap: 10 }}
                      >
                        <Grid item xs>
                          <h4>{earned.earnedPerPeriodFromMyViews}</h4>
                        </Grid>
                        <Grid item xs>
                          Мои просмотры
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* <Dropdown options={options} value={defaultOption}  placeholder="Select an option" /> */}
                </Grid>
                <div className="MyVideos">
                  <p className="heading">Мои Видео</p>
                  {videos.err === "There is no videos" ? null : (
                    <div className="VideoList">
                      {Object.keys(videos).map((key) => (
                        <div className="VideoContainer">
                          <div key={key} className="container">
                            <a href={"./watch" + videos[key]._id}>
                              <div className="thumbnail">
                                <img
                                  className="previmg"
                                  src={videos[key].coverURL}
                                  alt="PreviewImg"
                                />
                              </div>
                            </a>

                            <div className="body">
                              {/* <div className="body__img"></div> */}
                              <div className="title1">
                                <p>{videos[key].videoname}</p>

                                {console.log(videos[key])}
                              </div>
                              <div className="title2">
                                {/* <p>{videos[key].channelName}</p> */}
                                <p>
                                  {new Date(
                                    videos[key].creationDate
                                  ).toLocaleDateString()}
                                </p>
                                <ReadMore maxCharacterCount={100}>
                                  {videos[key].description}
                                </ReadMore>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Col>
            <Modal showModal={showModal} setShowModal={setShowModal} />
            <CardDataModal
              showCardDataModal={showCardDataModal}
              setShowCardDataModal={setShowCardDataModal}
              cardData={userData?.cardNumber}
            />
          </Row>
        </div>
      </>
    );
};
export default Cabinet;
