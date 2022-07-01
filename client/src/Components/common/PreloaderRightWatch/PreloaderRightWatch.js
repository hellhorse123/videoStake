import React, { Component } from 'react';
import './PreloaderRightWatch.scss';
// import Moment from "react-moment";

class PreloaderRightWatch extends Component {

    render() {

        return (
            <>
                <div className="PreloaderRightWatchContainer">
                    <div className="wrapper">
                        <div className="thumbnail">
                            <img
                            className="img"
                            alt=""
                            />
                        </div>

                        <div className="skeleton">
                            <div className="skeleton__txt1"></div>
                            <div className="skeleton__txt2"></div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default PreloaderRightWatch;