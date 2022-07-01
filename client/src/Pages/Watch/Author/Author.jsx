import React, { useState, useContext, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import "font-awesome/css/font-awesome.min.css";
// import { Redirect } from 'react-router-dom';
import Avatar from "react-avatar";
// import ReadMoreReact from 'read-more-react';
import { FaCopy } from "react-icons/fa";
import Clipboard from "react-clipboard.js";
import { useHistory } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";

import {
  EmailShareButton,
  FacebookShareButton,
  MailruShareButton,
  OKShareButton,
  TelegramShareButton,
  VKShareButton,
  WhatsappShareButton,
  FacebookIcon,
  VKIcon,
  OKIcon,
  TelegramIcon,
  WhatsappIcon,
  MailruIcon,
  EmailIcon,
} from "react-share";
import ClipboardJS from "clipboard";

import "./Author.scss";
// import { AuthorContext } from './AuthorContext'
import { WatchContext } from "../WatchContext";
import { MyContext } from "../../../MyContext";

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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const styleShare = {
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  borderRadius: 3,
  border: 0,
  color: "white",
  padding: "0 30px",
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
};

new ClipboardJS(".button");

const Author = () => {
  const history = useHistory();

  const { isAuthorized } = useContext(MyContext);
  const { isFetching, videoData1, userData } = useContext(WatchContext);
  const [authorData, setAuthorData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [isLiked, setIsLiked] = useState(
    videoData1?.likedBy?.includes(userData?._id)
  );
  const [isDisliked, setIsDisliked] = useState(
    videoData1?.dislikedBy?.includes(userData?._id)
  );
  const [isFavorite, setIsFavorite] = useState(
    userData?.favoritesIds?.includes(videoData1?._id)
  );
  const [isSubscribed, setIsSubscribed] = useState(
    userData?.subscribes?.includes(videoData1?.creatorID)
  );
  // const [isAuthor, setIsAuthor] = useState(false);

  const [likesCount, setLikesCount] = useState(videoData1?.likedBy?.length);
  const [dislikesCount, setDislikesCount] = useState(
    videoData1?.dislikedBy?.length
  );

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const videoAuthorId = videoData1.creatorID;
    fetch("/api/user/" + videoAuthorId)
      .then((response) => response.json())
      .then((result) => {
        console.log("result", result);
        setAuthorData(result);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  if (videoData1?.isFetching || userData?.isFetching || isFetching || isLoading)
    return <div>Loading...</div>;

  console.log(userData?.subscribes?.includes(authorData?._id));

  const subscribe = () => {
    if (!isAuthorized) return (window.location.href = "/logreg1");
    fetch("/api/user/subscribes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channelID: videoData1.creatorID }),
    })
      .then((res2) => res2.json())
      .then((result) => {
        console.log(result);
      });
    if (isSubscribed) {
      setIsSubscribed(false);
    } else {
      setIsSubscribed(true);
    }
  };

  const addToFavorite = () => {
    if (!isAuthorized) return (window.location.href = "/logreg1");
    fetch("/api/user/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoID: videoData1._id }),
    })
      .then((res2) => res2.json())
      .then((result) => {
        console.log(result);
        // const newData =
      });
    if (isFavorite) {
      setIsFavorite(false);
    } else {
      setIsFavorite(true);
    }
  };

  const like = () => {
    if (!isAuthorized) return (window.location.href = "/logreg1");
    fetch("/api/video/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoID: videoData1._id }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        // const newData =
      });

    if (isLiked) {
      setLikesCount(likesCount - 1);
      setIsLiked(false);
    } else {
      setLikesCount(likesCount + 1);
      setIsLiked(true);
      if (isDisliked) {
        setDislikesCount(dislikesCount - 1);
        setIsDisliked(false);
      }
    }
  };

  const dislike = () => {
    if (!isAuthorized) return (window.location.href = "/logreg1");
    fetch("/api/video/dislike", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoID: videoData1._id }),
    });

    if (isDisliked) {
      setDislikesCount(dislikesCount - 1);
      setIsDisliked(false);
    } else {
      setDislikesCount(dislikesCount + 1);
      setIsDisliked(true);
      if (isLiked) {
        setLikesCount(likesCount - 1);
        setIsLiked(false);
      }
    }
  };

  const shareUrl = document.location.href;
  const title = "GitHub";

  console.log(authorData, videoData1);

  return (
    <>
      <div className="AboutV">
        <div className="VideoInfo">
          <Grid container className="VideoName" justifyContent="space-between">
            <Grid container xs={5}>
              <Grid container>
                {videoData1.tags.map((tag) => (
                  <p className="tags">#{tag}</p>
                ))}
              </Grid>
              <Grid container className="NameV">
                {videoData1.videoname}
              </Grid>
              <Grid container style={{ gap: 5 }}>
                <Grid container className="DataV">
                  Количество просмотров: {videoData1.views}
                </Grid>
                <Grid container className="DataV">
                  {new Date(videoData1.creationDate).toLocaleDateString()}
                </Grid>
              </Grid>
            </Grid>
            <Grid
              container
              xs={6}
              alignItems="flex-end"
              style={{ fontSize: 20 }}
            >
              <Grid
                container
                xs
                className="ButtonsM"
                justifyContent="space-between"
                style={{ gap: 5 }}
              >
                {isLiked ? (
                  <div data-tip data-for="like" className="Like">
                    <i
                      class="fa fa-thumbs-up"
                      aria-hidden="true"
                      onClick={(e) => {
                        e.preventDefault();
                        like();
                      }}
                    >
                      <p className="text">{likesCount}</p>
                    </i>
                  </div>
                ) : (
                  <div data-tip data-for="like" className="Like">
                    <i
                      class="fa fa-thumbs-o-up"
                      aria-hidden="true"
                      onClick={(e) => {
                        e.preventDefault();
                        like();
                      }}
                    >
                      <p className="text">{likesCount}</p>
                    </i>
                  </div>
                )}
                {isDisliked ? (
                  <div data-tip data-for="dislike" className="Dislike">
                    <i
                      class="fa fa-thumbs-down"
                      aria-hidden="true"
                      onClick={(e) => {
                        e.preventDefault();
                        dislike();
                      }}
                    >
                      <p className="text">{dislikesCount}</p>
                    </i>
                  </div>
                ) : (
                  <div data-tip data-for="dislike" className="Dislike">
                    <i
                      class="fa fa-thumbs-o-down"
                      aria-hidden="true"
                      onClick={(e) => {
                        e.preventDefault();
                        dislike();
                      }}
                    >
                      <p className="text">{dislikesCount}</p>
                    </i>
                  </div>
                )}
                {isFavorite ? (
                  <div data-tip data-for="favorite" className="AddToFavorite">
                    <i
                      class="fa fa-star"
                      aria-hidden="true"
                      style={{ color: "#f7d849" }}
                      onClick={(e) => {
                        e.preventDefault();
                        addToFavorite();
                      }}
                    />
                  </div>
                ) : (
                  <div data-tip data-for="favorite" className="AddToFavorite">
                    <i
                      class="fa fa-star-o"
                      aria-hidden="true"
                      onClick={(e) => {
                        e.preventDefault();
                        addToFavorite();
                      }}
                    />
                  </div>
                )}
                <ReactTooltip
                  id="favorite"
                  place="top"
                  type="dark"
                  effect="solid"
                >
                  <span>Добавить в избранное</span>
                </ReactTooltip>

                <div className="Share">
                  <i
                    data-tip
                    data-for="letter"
                    class="fa fa-share-square-o"
                    aria-hidden="true"
                    onClick={handleOpen}
                  />
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Grid container style={{ gap: 30 }}>
                        <Grid container justifyContent="space-between">
                          <FacebookShareButton url={shareUrl}>
                            <FacebookIcon size={40} round />
                          </FacebookShareButton>
                          <VKShareButton url={shareUrl}>
                            <VKIcon size={40} round />
                          </VKShareButton>
                          <OKShareButton url={shareUrl}>
                            <OKIcon size={40} round />
                          </OKShareButton>
                          <MailruShareButton url={shareUrl}>
                            <MailruIcon size={40} round />
                          </MailruShareButton>
                          <TelegramShareButton url={shareUrl}>
                            <TelegramIcon size={40} round />
                          </TelegramShareButton>
                          <WhatsappShareButton url={shareUrl}>
                            <WhatsappIcon size={40} round />
                          </WhatsappShareButton>
                          <EmailShareButton url={shareUrl}>
                            <EmailIcon size={40} round />
                          </EmailShareButton>
                        </Grid>
                        <Grid container style={{ gap: 15 }}>
                          {/* <Grid container justifyContent="center">
                            Скопировать ссылку
                          </Grid> */}
                          <Grid container justifyContent="space-evenly">
                            <TextField
                              id="input"
                              type="text"
                              label="Скопировать ссылку"
                              sx={{ color: "#333" }}
                              value={shareUrl}
                            />
                            {/* <button
                              className="button"
                              data-clipboard-action="copy"
                              data-clipboard-target="#input"
                            >
                              <FaCopy />
                            </button> */}
                            <IconButton
                              className="button"
                              data-clipboard-action="copy"
                              data-clipboard-target="#input"
                              sx={{
                                color: "#6751b3",
                                minWidth: 56,
                                minHeight: 56
                              }}
                            >
                              <FaCopy />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  </Modal>

                  {/* 
                                <Clipboard className="shh" data-clipboard-text={window.location.href}>
                                        <i data-tip data-for='letter' class="fa fa-share-square-o" aria-hidden="true"  onClick={() => alert("Ссылка скопирована в буфер обмена")} />
                                </Clipboard> */}
                </div>

                <ReactTooltip
                  id="letter"
                  place="top"
                  type="dark"
                  effect="solid"
                >
                  <span>Поделиться</span>
                </ReactTooltip>
                <a href={"./support"}>
                  <div className="Report">
                    <i
                      data-tip
                      data-for="alarm"
                      class="fa fa-bug"
                      aria-hidden="true"
                    />
                  </div>
                </a>
                <ReactTooltip id="alarm" place="top" type="dark" effect="solid">
                  <span>Сообщить о нарушении</span>
                </ReactTooltip>

                <ReactTooltip id="like" place="top" type="dark" effect="solid">
                  <span>Нравится</span>
                </ReactTooltip>

                <ReactTooltip
                  id="dislike"
                  place="top"
                  type="dark"
                  effect="solid"
                >
                  <span>Не нравится</span>
                </ReactTooltip>

                <ReactTooltip id="feed" place="top" type="dark" effect="solid">
                  <span>Главная</span>
                </ReactTooltip>

                <ReactTooltip
                  id="cabinet"
                  place="top"
                  type="dark"
                  effect="solid"
                >
                  <span>Профиль</span>
                </ReactTooltip>

                <ReactTooltip
                  id="history"
                  place="top"
                  type="dark"
                  effect="solid"
                >
                  <span>История</span>
                </ReactTooltip>

                <ReactTooltip
                  id="favorites"
                  place="top"
                  type="dark"
                  effect="solid"
                >
                  <span>Избранное</span>
                </ReactTooltip>

                <ReactTooltip id="subs" place="top" type="dark" effect="solid">
                  <span>Подписки</span>
                </ReactTooltip>

                <ReactTooltip
                  id="support"
                  place="top"
                  type="dark"
                  effect="solid"
                >
                  <span>Поддержка</span>
                </ReactTooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            xs={12}
            className="VideoVariables"
            style={{ gap: 20 }}
          >
            <Grid
              container
              xs
              className="ChannelInfo"
              alignItems="center"
              style={{ gap: 15 }}
              onClick={() =>
                history.push(`./channel/${videoData1.channelName}`)
              }
            >
              {/* <a href={"./channel/" + videoData1.channelName}> */}
              {/* <div className="ProfileImg"> */}
              <Avatar
                className="ProfileImg"
                name={videoData1.channelName}
                size="48"
              />
              {/* </div> */}
              <Grid item direction="column" justifyContent="center">
                <Grid className="ChannelName">{videoData1.channelName}</Grid>
                {videoData1?.channelName === userData?.nickname ? (
                  <Grid style={{ fontSize: 14 }}>
                    подписчиков: {userData?.subscribers?.length}
                  </Grid>
                ) : (
                  <Grid style={{ fontSize: 14 }}>
                    подписчиков: &nbsp; {authorData.subscribers.length}
                  </Grid>
                )}
              </Grid>
              {/* </a> */}
            </Grid>

            <Grid container xs justifyContent="flex-end">
              {videoData1?.channelName === userData?.nickname ? null : (
                <div className="Subscribe">
                  {isSubscribed ? (
                    <button
                      className="SubYes"
                      onClick={(e) => {
                        e.preventDefault();
                        subscribe();
                      }}
                    >
                      Вы подписаны
                    </button>
                  ) : (
                    <button
                      className="Sub"
                      onClick={(e) => {
                        e.preventDefault();
                        subscribe();
                      }}
                    >
                      Подписаться
                    </button>
                  )}
                </div>
              )}
            </Grid>
            <Grid container style={{ marginLeft: 65 }}>
              <ReadMore maxCharacterCount={100}>
                {videoData1.description}
              </ReadMore>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
};

export default Author;
