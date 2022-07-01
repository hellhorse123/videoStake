import React, { useContext, useState, useEffect } from 'react';
import { Row, Col,} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import Avatar from 'react-avatar';

import './Subs.scss';
import { MyContext } from '../../MyContext'
import Navigation from '../../layout/navigation/navigation';
import Header from '../../layout/header/Header';
import PreloaderSubs from '../../Components/common/PreloaderSubs/PreloaderSubs'



const Subs = () => {

    const [videos, setVideos] = useState({});
    let [error, setError] = useState(null);

    const { isAuthorized, isFetching } = useContext(MyContext)
    // console.log(isFetching)


    useEffect(() => {
        fetch('/api/user/my/subscribes')
            .then(response => response.json())
            .then(result => {
            //   console.log("result", result);
                setVideos(result)
            })
            .catch(e => {
                console.log(e);
                setError(isFetching, e );
            });
    }, [])

        if (error) return <div>{`Error: ${error.message}`}</div>;

        // console.log(videos)

        if (isFetching) return (
            <PreloaderSubs />
            )
        if (!isAuthorized) {
            return <Redirect to="/logreg1" />;
        }
        else

        return (
            <>
                <Header />
                <div  className="Max">

                    <Row>
                        <Col sm={2}>
                            <Navigation key="navigation"/>
                        </Col>
                        <Col>
                            <div className="Box">
                                <div className="SubsContainer">

                                    {Object.keys(videos).map(key => (
                                        <div key={key}  className="container">
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
                                                    < Avatar className="ProfileImg" name={videos[key].channelName} size="34" />
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


                            </div>
                        </Col>
                    </Row>
                </div>
            </>
        )
    }




export default Subs;