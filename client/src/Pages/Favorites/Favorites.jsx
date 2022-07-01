import React, { useContext, useState, useEffect } from 'react';
import { Row, Col,} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import ReadMoreReact from 'read-more-react';

import './Favorites.scss';
import { MyContext } from '../../MyContext'
import Navigation from '../../layout/navigation/navigation';
import Header from '../../layout/header/Header';
import PreloaderHistory from '../../Components/common/PreloaderHistory/PreloaderHistory'


// const CabinetContext = React.createContext()


const Favorites = () => {

    let [videos, setVideos] = useState([]);
    let [error, setError] = useState(null);

    const { isAuthorized, isFetching } = useContext(MyContext)

    useEffect(() => {
        fetch('/api/user/my/favorites')
        .then(response => response.json())
        .then(result =>{
            console.log(result)
            setVideos(result )
        })
        .catch(e => {
            console.log(e);
            setError(isFetching, e );
        });
        console.log('!!!',videos);
    }, [])

    if (error) return <div>{`Error: ${error.message}`}</div>;

        if (isFetching) {
            return <PreloaderHistory />
        }
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
                            <div className="HistoryBox">
                                <div className="VideoList">

                                    {Object.keys(videos).map(key => (
                                        <div className="VideoContainer">
                                                <div key={key}  className="container">
                                                    <a href={"./watch" + videos[key]._id}>
                                                        <div className="thumbnail">
                                                            <img className="previmg" src=
                                                                {videos[key].coverURL}
                                                                alt="PreviewImg"
                                                            />
                                                            
                                                        </div>
                                                    </a>

                                                    <div className="body">
                                                        {console.log(videos[key])}
                                                        {/* <div className="body__img"></div> */}
                                                        {/* <div className="body__txt"> */}
                                                            <div className="title1">
                                                                    <p>{videos[key].videoname}</p>
                                                            </div>
                                                            <div className="title2">
                                                            <a href={"./channel/" + videos[key].channelName} >
                                                                <p>{videos[key].channelName}</p>
                                                            </a>
                                                                <ReadMoreReact text={videos[key].description}
                                                                    min={80}
                                                                    ideal={100}
                                                                    max={200}
                                                                    readMoreText="ЕЩЁ" />

                                                            </div>
                                                        {/* </div> */}
                                                    </div>

                                                </div>
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




export default Favorites;