// import {useDispatch, useSelector} from 'react-redux'
// import { userData } from '../../redux/actions'

// import Modal from '../../Components/modal-downloads/Modal';
// import {Button} from '../../Components/button/Button';


import React from 'react';
import { Row, Col, } from 'react-bootstrap';

import './CabinetPreloader.scss';
import PreloaderRightWatch from '../PreloaderRightWatch/PreloaderRightWatch'


const CabinetPreloader = () => {

        return (
            <>
                <div className="Header" />
                <Row>
                    <Col sm={2}>
                        <div className="Nav" />
                    </Col>
                    <Col>
                        <div className="BoxCabPr">

                            <div className="ProfileInfo">
                                <div className="ProfileImg" />
                                <div className="ChannelName"/>
                            </div>

                            <div className="MyVideos">
                                <PreloaderRightWatch />
                            </div>

                        </div>
                    </Col>
                </Row>
            </>
        )
}
export default CabinetPreloader