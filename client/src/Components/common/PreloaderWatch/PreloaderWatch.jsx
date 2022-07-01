import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Row, Col, } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import './PreloaderWatch.scss';
import PreloaderRightWatch from '../PreloaderRightWatch/PreloaderRightWatch'


const PreloaderWatch = () => {


    return (
        <>
                <div className="Header" />
                <Row>
                <Col sm={1}>
                                <div className="Nav"/>
                            </Col>
                <Col sm = {8}>

                        <div className="PreloaderWatchBox">
                            <div className="Block">
                                <div className="PlayerContainer">
                                    <div className="player_wrap">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col sm={3}>
                    <PreloaderRightWatch/>
                    </Col>

</Row>
        </>
    )
}


export default PreloaderWatch;