import React, { useContext, useState, useEffect } from "react";

import "./RightWatchContent.scss";
import { MyContext } from "../../MyContext";
import { WatchContext } from "../../Pages/Watch/WatchContext";
import PreloaderRightWatch from "../../Components/common/PreloaderRightWatch/PreloaderRightWatch";
// import Moment from "react-moment";

const RightWatchContent = () => {
  const { isFetching } = useContext(MyContext);

  const [videos, setVideos] = useState({});
  let [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/videos/feed")
      .then((response) => response.json())

      .then((result) => {
        console.log("result", result);
        setVideos(result)(!isFetching);
      })
      .catch((e) => {
        console.log(e);
        setError(isFetching, e);
      });
  }, []);

  if (isFetching)
    return (
      <div>
        <PreloaderRightWatch />
        <PreloaderRightWatch />
        <PreloaderRightWatch />
        <PreloaderRightWatch />
        <PreloaderRightWatch />
        <PreloaderRightWatch />
        <PreloaderRightWatch />
        <PreloaderRightWatch />
        <PreloaderRightWatch />
        <PreloaderRightWatch />
      </div>
    );

  if (error) return <div>{`Error: ${error.message}`}</div>;

  console.log(videos);

  return (
    <>
      <div className="RightWatchContainer">
        {Object.keys(videos).map((key) => (
          <a href={"./watch" + videos[key]._id} style={{ marginBottom: 10 }}>
            <div key={key} className="container">
              <div className="thumbnail">
                <img
                  className="img"
                  src={videos[key].coverURL}
                  alt="img"
                  width="100%"
                />
              </div>
              <div className="body">
                <div className="body__txt">
                  <div className="skeleton">
                    <div className="skeleton__txt1">
                      <p>{videos[key].videoname}</p>
                    </div>
                    <div className="skeleton__txt2">
                      <p>{videos[key].channelName}</p>
                      <p>
                        {new Date(
                          videos[key].creationDate
                        ).toLocaleDateString()}
                      </p>
                      <p>Количество просмотров: {videos[key].views - 1}</p>
                    </div>
                    <div className="Like">
                      <i class="fa fa-thumbs-o-up" aria-hidden="true" />
                      <p className="text">{videos[key].likedBy.length}</p>
                    </div>
                    <div className="Dislike">
                      <i class="fa fa-thumbs-o-down" aria-hidden="true" />
                      <p className="text">{videos[key].dislikedBy.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </>
  );
};

export default RightWatchContent;
