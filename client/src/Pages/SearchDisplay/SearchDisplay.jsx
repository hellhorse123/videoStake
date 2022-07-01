import React, { useContext, useState, useEffect } from 'react';
import { Row, Col,} from 'react-bootstrap';
import {Redirect, Link} from 'react-router-dom';
import Avatar from 'react-avatar';

import './SearchDisplay.scss';
import { MyContext } from '../../MyContext'
import Navigation from '../../layout/navigation/navigation';
import Header from '../../layout/header/Header';
import PreloaderHistory from '../../Components/common/PreloaderHistory/PreloaderHistory'

const linkStyle = {
    border: "1px solid black",
    padding: "1rem",
    margin: "1rem",
    display: "block",
  };


const SearchDisplay = ({ match }) => {

    let [videos, setVideos] = useState([]);
    let [error, setError] = useState(null);

    const { isAuthorized, isFetching } = useContext(MyContext)

    useEffect(() => {
        fetch('/api/search/' + match.params.query)
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
                            <div className="SearchBox">
                                <div className="VideoList">

                                    {Object.keys(videos).map(key => (
                                        <a href={"/watch" + videos[key]._id}>
                                            <div className="VideoContainer">
                                                <div key={key}  className="container">
                                                    <div className="thumbnail">
                                                        <img className="previmg" src=
                                                            {videos[key].coverURL}
                                                             alt="PreviewImg"
                                                        />
                                                    </div>

                                                    <div className="body">
                                                    {/* <div className="body__img"></div> */}
                                                        <div className="title1">
                                                            <p>{videos[key].videoname}</p>
                                                            <p className="date"> {new Date(videos[key].creationDate).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="title2">
                                                            < Avatar className="ProfileImg" name={videos[key].channelName} size="25" />
                                                            <p>{videos[key].channelName}</p>
                                                            <p>{videos[key].description}</p>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </a>

                                    ))}

                                </div>


                            </div>
                        </Col>
                    </Row>
                </div>
            </>
        )
}




export default SearchDisplay;