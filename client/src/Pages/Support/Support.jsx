// import {useDispatch, useSelector} from 'react-redux'
// import { userData } from '../../redux/actions'

// import Modal from '../../Components/modal-downloads/Modal';
// import {Button} from '../../Components/button/Button';


import React, { useContext, useState } from 'react';
import { Row, Col, } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import { MyContext } from '../../MyContext'
import Navigation from '../../layout/navigation/navigation';
import './Support.scss';
import Header from '../../layout/header/Header';
import monkeyLoader from '../../img/monkeyLoader.gif'

import Supp from '../../img/w.svg';

// const CabinetContext = React.createContext()

const Support = () => {

    const { isAuthorized, isFetching, userData, videos } = useContext(MyContext)
    const [status1, setStatus1] = useState(false)
    const [status2, setStatus2] = useState(false)
    const [status3, setStatus3] = useState(false)
    const [status4, setStatus4] = useState(false)
    const [status5, setStatus5] = useState(false)
    const [btnStatus, setBtnStatus] = useState(true)
    const [value, setValue] = useState('');
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');
    const [value3, setValue3] = useState('');
    const [value4, setValue4] = useState('');
    const [check, setCheck] = useState('');

    const changeHandler1 = (e) => {
        setValue(e.target.value);
        console.log(e.target.value)
        if (value.length > 0) {
            setStatus1(true);
        }
        else {
            setStatus1(false);
        }
    }

    const changeHandler2 = (e) => {
        setValue1(e.target.value1);
        console.log(e.target.value1)
        if (value.length > 0) {
            setStatus2(true);
        }
        else {
            setStatus2(false);
        }
    }
    const changeHandler3 = (e) => {
        setValue2(e.target.value2);
        console.log(e.target.value2)
        if (value.length > 0) {
            setStatus3(true);
        }
        else {
            setStatus3(false);
        }
    }
    const changeHandler4 = (e) => {
        setValue3(e.target.value3);
        console.log(e.target.value3)
        if (value.length > 0) {
            setStatus4(true);
        }
        else {
            setStatus4(false);
        }
    }

    const changeHandler5 = (e) => {
        setValue4(e.target.value4);
        console.log(e.target.value4)
        if (value.length > 0) {
            setStatus5(true);
        }
        else {
            setStatus5(false);
        }
    }

    const handleChangeCheck = (name, value) => {

        if (name === 'check') {
        //     setCheck(value);
        // console.log(value.length, status1, status2)

            if ( status1 === true && status2 === true && status3 === true && status4 === true) {
                setBtnStatus(!btnStatus);
            }
            else {
                setBtnStatus(true);
            }
        }
    }

    const submitHandler = e => {
        e.preventDefault();

        // if (tags.length === 0) {
        //     setErrors(prev => ({
        //         ...prev,
        //         tags: 'Please add at least one tag'
        //     }));
        // } else if (tags.length > 0) {
        //     console.log(tags);
        //     let fileInput = document.getElementById("fileInput");
        //     let videoNameInput = document.getElementById("videoNameInput");
        //     let description = document.getElementById("description");
        //     let formData = new FormData()
        //     setBtnStatus(true);
        //     setHiddenStatus(!hiddenStatus)
        //     formData.append("filedata", fileInput.files[0])
        //     formData.append("tags", tags);
        //     formData.append("videoname", videoNameInput.value);
        //     formData.append("description", description.value);
        //     fetch('/api/videos/upload', {
        //         method: 'POST',
        //         body: formData
        //     }).then(() => {
        //         window.location.href = '/downloadvideopage'
        //     })

        // }
    }

    console.log(isAuthorized, isFetching, userData, videos)

    if (isFetching) {
        return <img src={monkeyLoader} alt="Loading..." />
    }
    if (!isAuthorized) {
        return <Redirect to="/logreg1" />;
    }
    else
        return (
            <div className="SupportPage">
                <Header />
                <div className="Max">
                    <Row>
                        <Col sm={2}>
                            <Navigation key="navigation" />
                        </Col>
                        <Col>
                            <div className="Box">
                                <img src={Supp} className="image" alt=""
                                />

                                <div className="LeftBox">

                                    <p>У вас есть вопросы или предложения?</p> <p>Заполните форму, и мы ответим вам в течение 24 часов.</p>
                                    <form
                                    //    action="/api/videos/upload" method="post" enctype="multipart/form-data"
                                    >
                                        <div id="downloadForm" className="download-form">
                                            <input
                                                value={value}
                                                type="text"
                                                id="videoNameInput"
                                                name="Name"
                                                className="form-control"
                                                placeholder="Имя"
                                                maxlength="52"
                                                onChange={changeHandler1}
                                            />
                                            <input
                                                value={value1}
                                                type="text"
                                                id="videoNameInput"
                                                name="Surname"
                                                className="form-control"
                                                placeholder="Фамилия"
                                                maxlength="52"
                                                onChange={changeHandler2}
                                            />
                                            <input
                                                value={value2}
                                                type="text"
                                                id="videoNameInput"
                                                name="Email"
                                                className="form-control"
                                                placeholder="email"
                                                maxlength="52"
                                                onChange={changeHandler3}
                                            />
                                            <textarea
                                                value={value3}
                                                type="text"
                                                id="description"
                                                name="description"
                                                className="form-control inp-desc"
                                                placeholder="Опишите вашу проблему"
                                                maxlength="1024"
                                                onChange={changeHandler4}
                                            />
                                            <div className="CheckAndSend">
                                                <label class="checkbox">
                                                    <input
                                                        type="checkbox"
                                                        id="politics"
                                                        value={value4}
                                                        autocomplete="off"
                                                        name="check"
                                                        className="politics"
                                                        onClick={handleChangeCheck}
                                                    />
                                                    <div className="yep">Я согласен на обработку персональных данных</div>
                                                </label>
                                                <input
                                                    type="submit"
                                                    onClick={submitHandler}
                                                    className="btnS"
                                                    value="Отправить"
                                                    disabled={btnStatus} 
                                                />
                                            </div>

                                        </div>
                                    </form>
                                </div>

                            </div>
                        </Col>
                        <Col>
                            <div className="Box">
                                <div className="RightBox">
                                    <p>Время - это деньги.</p> <p>Мы знаем это лучше всех. Наш сервис платит пользователям, потому что вы помогаете нам расти.</p>
                                    <p> Вы всегда можете ознакомиться с нашими ключевыми положениями и правилами:</p>
                                    <div className="FileBox">
                                        <i class="fa fa-file-pdf-o" aria-hidden="true" />
                                        <p>Наша миссия:цели, задачи и пути их достижения</p>
                                    </div>
                                    <div className="FileBox">
                                        <i class="fa fa-file-pdf-o" aria-hidden="true" />
                                        <p>Исследования и интеллектуальные права</p>
                                    </div>
                                    <div className="FileBox">
                                        <i class="fa fa-file-pdf-o" aria-hidden="true" />
                                        <p>Использование персональных данных</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        )
}
export default Support