import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Row, Col, } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import './PreloaderSubs.scss';


// import { useLazyLoading } from "../../Components/common/useLazyLoading";

// const Container = styled.div`
//   max-height: 100vh;
//   overflow-y: scroll;
// `;




const PreloaderSubs = () => {


    return (
        <>
                <div className="Header" />

                <Row>
                    <Col sm={2}>
                        <div className="Nav" />
                    </Col>
                    <Col>
                    <div className="PreloaderSubs">
                        <div className="Videous">
                            <div className="container">
                                <div className="thumbnail">
                                    <img
                                    className="img"
                                    alt=""
                                    />
                                </div>
                                <div className="skeleton">
                                <img
                                    className="img"
                                    alt=""
                                    />
                                    <div className="skeleton__txt1"/>
                                    <div className="skeleton__txt2"/>
                                </div>
                            </div>
                            <div className="container">
                                <div className="thumbnail">
                                    <img
                                    className="img"
                                    alt=""
                                    />
                                </div>
                                <div className="skeleton">
                                <img
                                    className="img"
                                    alt=""
                                    />
                                    <div className="skeleton__txt1"/>
                                    <div className="skeleton__txt2"/>
                                </div>
                            </div>
                            <div className="container">
                                <div className="thumbnail">
                                    <img
                                    className="img"
                                    alt=""
                                    />
                                </div>
                                <div className="skeleton">
                                <img
                                    className="img"
                                    alt=""
                                    />
                                    <div className="skeleton__txt1"/>
                                    <div className="skeleton__txt2"/>
                                </div>
                            </div>
                            <div className="container">
                                <div className="thumbnail">
                                    <img
                                    className="img"
                                    alt=""
                                    />
                                </div>
                                <div className="skeleton">
                                <img
                                    className="img"
                                    alt=""
                                    />
                                    <div className="skeleton__txt1"/>
                                    <div className="skeleton__txt2"/>
                                </div>
                            </div>
                            <div className="container">
                                <div className="thumbnail">
                                    <img
                                    className="img"
                                    alt=""
                                    />
                                </div>
                                <div className="skeleton">
                                <img
                                    className="img"
                                    alt=""
                                    />
                                    <div className="skeleton__txt1"/>
                                    <div className="skeleton__txt2"/>
                                </div>
                            </div>
                            <div className="container">
                                <div className="thumbnail">
                                    <img
                                    className="img"
                                    alt=""
                                    />
                                </div>
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
                    </div>
                    </Col>
                </Row>

        </>
    )
}


export default PreloaderSubs;