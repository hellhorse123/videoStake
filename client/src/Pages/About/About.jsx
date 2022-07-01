import React, { Component, Fragment } from 'react';
import { Row, Col,} from 'react-bootstrap';
import Navigation from '../../layout/navigation/navigation';
import './About.css';
import Header from '../../layout/header/Header';

class About extends Component {


    render() {
        return (
          <>
          <Header />

          <div  className="Max">

<Row>
                <Col sm={2}>
                      <Navigation key="navigation"/>
                </Col>
                <Col sm={10}>
                  <div className="Box">
                      <Fragment>

                        </Fragment>
                  </div>
                </Col>
                </Row>
            </div>
            </>
        )
    }
  }


export default About;