import React, { useState, useEffect, useCallback } from "react";
import { Row, Col } from "react-bootstrap";
import NavigationSmall from "../../layout/navigationSmall/navigationSmall";
import WebTorrent from "webtorrent";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

import "./Watch.scss";
import Header from "../../layout/header/Header";
import Comments from "./Comments/Comments";
import Author from "./Author/Author";
// import { MyContext } from '../../MyContext'
import { WatchContext } from "./WatchContext";
// import monkeyLoader from '../../img/monkeyLoader.gif'

import RightWatchContent from "../../Components/RightWatchContent/RightWatchContent";
import { isAuthorized } from "../../redux/actions";
import { useLazyLoading } from "../../Components/common/useLazyLoading";

import useInfiniteScroll from "../../Components/common/useInfiniteScroll";
import PreloaderWatch from "../../Components/common/PreloaderWatch/PreloaderWatch";

// const Container = styled.div`
//   max-height: 100vh;
//   overflow-y: scroll;
// `;

const Watch = ({ match }) => {
  const [listItems, setListItems] = useState(
    Array.from(Array(1).keys(), (n) => n + 1)
  );
  const [isFetchingList, setIsFetchingList] =
    useInfiniteScroll(fetchMoreListItems);

  function fetchMoreListItems() {
    setTimeout(() => {
      setListItems((prevState) => [
        ...prevState,
        ...Array.from(Array(1).keys(), (n) => n + prevState.length + 1),
      ]);
      setIsFetchingList(false);
    }, 2000);
  }

  const [isFetching, setIsFetching] = useState(true);
  let [videoId, setVideoId] = useState({});
  // let [videoUrl, setVideoUrl] = useState({});
  let [torrentFile, setTorrentFile] = useState({});
  let [videoData, setVideoData] = useState({});
  let [userData, setUserData] = useState({});
  let [error, setError] = useState(null);
  window.seenSeconds = 0;

  const getVideo = async () => {
    console.log("GETVIDEO");

    let client = new WebTorrent();
    client.add(
      torrentFile,
      {
        announce: ["ws://localhost:8000"],
      },
      (torrent) => {
        torrent.addWebSeed(videoData.fileURL);

        torrent.on("warning", console.log);
        torrent.on("error", console.log);

        console.log("Got torrent metadata!");

        // Find largest file
        var largestFile = torrent.files[0];

        for (var i = 1; i < torrent.files.length; i++) {
          if (torrent.files[i].length > largestFile.length)
            largestFile = torrent.files[i];
        }

        largestFile.renderTo(".vjs-tech");

        seenCounter();
      }
    );
  };

  useEffect(() => {
    setVideoId((videoId = match.params.videoId));

    fetch("/api/user/history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoID: videoId }),
    });

    fetch("/api/video/" + videoId)
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((res) => {
        setVideoData((videoData = res));
        console.log(videoData);
        fetch(res.torrentURL)
          .then((res) => res.blob())
          .then((res) => {
            setTorrentFile((torrentFile = res));
          });

        fetch("/api/auth/isauthorized")
          .then((res3) => {
            return res3.json();
          })
          .then((res3) => {
            setUserData((userData = res3), !isFetching);
            setIsFetching(false);
            getVideo();
          });
      })
      .catch((e) => {
        console.log(e);
        setError(isFetching, e);
      });

    if (isAuthorized()) {
      window.addEventListener("unload", async function (event) {
        const data = await JSON.stringify({
          seenPercent: window.seenSeconds / videoData.duration,
          videoId: videoData._id,
        });
        fetch("/api/chain/block", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
          keepalive: true,
        });
      });
    }
  }, []);

  const seenCounter = async () => {
    const seenSecondsCounter = () => {
      const element = document.querySelector(".vjs-tech");
      if (element && !element.paused) {
        window.seenSeconds++;
      }
    };
    setInterval(seenSecondsCounter, 1000);
  };

  const [items, setItems] = useState(
    Array(1)
    //   .fill("")
  );
  const appendItems = useCallback(() => {
    setItems([
      ...items,
      ...Array(1),
      // .fill("")
    ]);
  }, [items, setItems]);

  const [onScroll, containerRef] = useLazyLoading({
    onIntersection: appendItems,
    delay: 1200,
  });

  const videoIdCC = match.params.videoId;
  const videoData1 = videoData;

  console.log(
    "VideoData",
    videoData,
    "VideoData1:",
    videoData1,
    "userData",
    userData,
    "videoIdCC",
    videoIdCC
  );

  const videoElement = document.getElementsByTagName("video")[0];
  if (videoElement !== undefined) {
    videoElement.volume = 0.4;
    setTimeout(sayHi, 200);
  }

  function sayHi() {
    if (videoElement.buffered.length === 0) {
      window.location.reload();
    }
  }

  if (isFetching) return <PreloaderWatch />;
  //  <img src={monkeyLoader} alt="Loading..." />

  if (error) return <div>{`Error: ${error.message}`}</div>;

  return (
    <>
      <Header />
      {/* <Container ref={containerRef} onScroll={onScroll}  items={items}> */}

      <div className="Max">
        <Row>
          <Col sm={8}>
            <Row>
              <Col sm={1}>
                <NavigationSmall key="NavigationSmall" />
              </Col>
            </Row>
            <div className="WatchBox">
              <div className="Block">
                <div className="PlayerContainer">
                  <div className="player_wrap">
                    <video
                      id="video11"
                      preload="auto"
                      //onLoad={getVideo()}
                      className="vjs-tech"
                      width="100%"
                      // muted="true"
                      // autoplay
                    >
                      <img
                        className="img"
                        width="168"
                        src="../../img/VStake.svg"
                        alt=""
                      />
                    </video>
                  </div>
                </div>
                {console.log(
                  "InWatch",
                  videoIdCC,
                  isFetching,
                  videoData,
                  videoData1,
                  userData
                )}
                <WatchContext.Provider
                  value={{
                    videoIdCC,
                    isFetching,
                    videoData1,
                    userData,
                  }}
                >
                  <Author />
                  <Comments />
                </WatchContext.Provider>
              </div>
            </div>
          </Col>

          <Col sm={4}>
            {/* {items.map(_id => ( */}

            {listItems.map((listItem) => (
              <div className="rwc">
                <WatchContext.Provider
                  value={{
                    videoData1,
                  }}
                >
                  <RightWatchContent />
                </WatchContext.Provider>
              </div>
            ))}

            {isFetchingList && "Fetching more list items..."}

            {/* ))} */}
          </Col>
        </Row>
      </div>
      {/* </Container> */}
    </>
  );
};

export default withRouter(Watch);
