import React, { Component } from 'react';
import './SuccessRegistration.scss';
import SuccessReg from '../../img/SuccessReg.svg';




class SuccessRegistration extends Component {

    render() {
        return (
            <>
               <meta http-equiv="Refresh" content="1; URL=/logreg1" />
               <div className="SucBlock">
                    <img src={SuccessReg} className="image" alt="" />
                    <h1>Регистрация прошла успешно!</h1>
               </div>
            </>
        )
    }
  }



export default SuccessRegistration;