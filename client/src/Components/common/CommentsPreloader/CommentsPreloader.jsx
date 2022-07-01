
import React, { Component } from 'react';
import './CommentsPreloader.scss';
// import Moment from "react-moment";

class CommentsPreloader extends Component {

    render() {

        return (
            <>
                <div className="CommentsPreloader">
                <div className="container">
                                <div className="skeleton">
                                <img
                                    className="img"
                                    alt=""
                                    />
                                    <div className="skeleton__txt1"/>
                                    <div className="skeleton__txt2"/>
                                </div>
                            </div>
                </div>
            </>
        )
    }
}
export default CommentsPreloader;