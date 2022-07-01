import React, { useContext, useState, useEffect } from 'react';
import { Row, Col, } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import Avatar from 'react-avatar';
import { withRouter } from 'react-router-dom';

import { MyContext } from '../../MyContext'
import { ChannelContext } from './ChannelContext'
import Navigation from '../../layout/navigation/navigation';
import './ChannelReview.scss';
import Header from '../../layout/header/Header';
import CabinetPreloader from '../../Components/common/CabinetPreloader/CabinetPreloader'
import BtnSub from './BtnSub/BtnSub'

function ReadMore({children, maxCharacterCount = 100}){
    const text = children;
    const [isTruncated, setIsTruncated] = useState(true)
    const resultString = isTruncated ? text.slice(0, maxCharacterCount) : text

    function toggleIsTruncated(){
        setIsTruncated(!isTruncated)
    }
    return(
        <p className="has-text-left">
            {resultString}
            { text.length<100 ?
            null
            :
            <div className="rmb">
            <span onClick={toggleIsTruncated} className="read-more-button">
                {isTruncated ? "ЕЩЁ" : "СКРЫТЬ"}
            </span>
            </div>
            }
        </p>
    )
}


const ChannelReview = ({match}) => {


    const [videos, setVideos] = useState({})
    const [authorData, setAuthorData] = useState({})
    const [isFetching, setIsFetching] = useState(true)
    let [error, setError] = useState(null)
    const { userData,isAuthorized} = useContext(MyContext)
    // let [userData, setUserData] = useState({});


    let [channelName1, setChannelName1] = useState({})

    console.log(authorData, userData, userData?.subscribes?.includes(authorData?._id))


    useEffect(() => {
        setChannelName1( channelName1 = match.params.channelName)

        fetch('/api/user/' + channelName1)
            .then(response => response.json())
            .then(result => {
                console.log("result", result);
                setAuthorData(result)

            })
            .then(() =>
            {
                fetch('/api/videos/by/' + channelName1)
                    .then(response => response.json())
                    .then(result => {
                        // setUserData(userData = result);
                        setVideos(result, !isFetching ) //!
                        setIsFetching(false);
                    })
                    // .catch(e => {
                    //     console.log(e);
                    //     setError( e );
                    // });
            })
            .catch(e => {
                console.log(e);
                setError( isFetching, e ); //!
            })

    }, [])

    if (error) return <div>{`Error: ${error.message}`}</div>; // ?????

    if (isFetching) {
        return <CabinetPreloader />
    }
    if(authorData?._id === userData?._id){
        return <Redirect to="/cabinet" />;

    }
    else

        return (
            <>

                <Header />
                <div className="Max">
                    <Row>
                        <Col sm={2}>
                            <Navigation key="navigation" />
                        </Col>
                        <Col>
                            <div className="ChannelReviewBox">

                                <div className="ProfileInfo">
                                {/* {setSubsCount(authorData?.subscribers?.length)}
                             {console.log(subsCount)} */}
                                        < Avatar className="ProfileImg" name={authorData.nickname} size="68" />


                                    <ChannelContext.Provider value={{
                                    authorData, userData, isAuthorized
                                }} >
                                    {console.log(authorData)}
                                        <BtnSub />
                                </ChannelContext.Provider>
                                </div>


                                <div className="MyVideos">
                                    <p className="heading">Видео на канале:</p>
                                    {
                                        videos.err === 'There is no videos' ?
                                            null
                                            : (
                                                <div className="VideoList">
                                                    {Object.keys(videos).map(key => (
                                                        <div className="VideoContainer">
                                                                <div key={key} className="container">
                                                                <a href={"/watch" + videos[key]._id}>

                                                                    <div className="thumbnail">
                                                                        <img className="previmg" src=
                                                                            {videos[key].coverURL}
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
                                                                                <p>{new Date(videos[key].creationDate).toLocaleDateString()}</p>
                                                                                {/* <ReadMoreReact text={videos[key].description}
                                                                                    min={80}
                                                                                    ideal={100}
                                                                                    max={200}
                                                                                    readMoreText="ЕЩЁ" /> */}
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
                    </Row>

                </div>
            </>
        )
}
export default withRouter(ChannelReview)