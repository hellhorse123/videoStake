import React, { useContext, useState, useEffect } from 'react';
import { Row, Col, } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Avatar from 'react-avatar';

import useInfiniteScroll from "../../Components/common/useInfiniteScroll";
import './Feed.scss';
// import { FeedContext } from './FeedContext'
import { MyContext } from '../../MyContext'
import Navigation from '../../layout/navigation/navigation';
import Header from '../../layout/header/Header';
import PreloaderFeed from '../../Components/common/PreloaderFeed/PreloaderFeed'

// import { useLazyLoading } from "../../Components/common/useLazyLoading";

const Feed = () => {

    const [listItems, setListItems] = useState(Array.from(Array(1).keys(), n => n + 1));
    const [isFetchingList, setIsFetchingList] = useInfiniteScroll(fetchMoreListItems);
    // const { userData } = useContext(MyContext)

    function fetchMoreListItems() {
      setTimeout(() => {
        setListItems(prevState => ([...prevState, ...Array.from(Array(1).keys(), n => n + prevState.length + 1)]));
        setIsFetchingList(false);
      }, 2000);
    }


    const { isFetching } = useContext(MyContext)

    const [videos, setVideos] = useState({});

    let [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/videos/feed')
            .then(response => response.json())

            .then(result => {
                // console.log("result", result);
                setVideos(result)
                    (!isFetching)
            })
            .catch(e => {
                console.log(e);
                setError(isFetching, e);
            })
    }, [])
    // const videos1 = videos

    console.log('Feed', isFetching, videos)
    if (error) return <div>{`Error: ${error.message}`}</div>;

    if (isFetching) return (
    <PreloaderFeed />
    )


    return (
        <>
            {console.log( videos)}

            {/* <FeedContext.Provider value={{
                // videos1
            }} > */}
                <Header />
            {/* </FeedContext.Provider> */}
            {/* <Container ref={containerRef} onScroll={onScroll}  items={items}> */}

            <div className="Max">
                <Row>
                    <Col sm={2}>
                        <Navigation key="navigation" />
                    </Col>
                    <Col>

                        <div className="Box">
                            
                        {/* {items.map(_id => ( */}
                            <div className="Videous">
                                {/* <div className="progressbar">
                                <div className="loader"></div>
                            </div> */}
                            {listItems.map(listItem =>
                                <div>
                                {Object.keys(videos).map(key => (
                                    <div key={key} className="container">
                                        <a href={"./watch" + videos[key]._id}>
                                            <div className="thumbnail">

                                                <img className="previmg" src=
                                                    {videos[key].coverURL}
                                                    alt="PreviewImg"
                                                />
                                                <div className="overlay">
                                                    <i className="fa fa-play"></i>
                                                </div>
                                            </div>
                                            <div className="body">
                                            <a href={"./channel/" + videos[key].channelName} >
                                                    < Avatar className="ProfileImg" name={videos[key].channelName} size="48" />
                                            </a>
                                                <div className="body__txt">
                                                    <div className="title1">
                                                        <p>{videos[key].videoname}</p>
                                                    </div>
                                                    <div className="title2">
                                                    <a href={"./channel/" + videos[key].channelName} >
                                                        <p>{videos[key].channelName}</p>
                                                    </a>

                                                        <p>{new Date(videos[key].creationDate).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                ))}
                                </div>
                                )}


                            </div>
      {isFetchingList && 'Fetching more list items...'}

                        {/* ))} */}
                        
                        </div>
                    </Col>
                </Row>
            </div>
            {/* </Container> */}

        </>
    )
}


export default withRouter(Feed);