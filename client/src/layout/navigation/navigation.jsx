import React from 'react';
import {/*BrowserRouter as Router,
    Switch,
    Route,
    Link,*/ NavLink } from 'react-router-dom';
    import ReactTooltip from "react-tooltip";

import 'font-awesome/css/font-awesome.min.css';
import './navigation.scss';
// import Feed from '../../Pages/Feed';
// import About from '../../Pages/About';
// import Cabinet from '../../Pages/Cabinet';
// import Downloads from '../../Pages/Downloads';
// import Logreg from '../../Pages/LogReg/Logreg';



const navigation = () => {





        return (
            <>
            <div className="navigation">
                    <div className="firstnav">
                    <NavLink data-tip data-for='feed' exact to="/" className="Feed"
                                activeStyle={{
                                    background:'#FBBC05',
                                    color:'#666',
                                    fontWeight: 400,
                                    '&::before': {
                                        color:'#ddd'
                                    }
                                }}>
                                    <div className="text">Главная</div>
                        </NavLink>

                        <NavLink data-tip data-for='cabinet' to="/cabinet" className="Cab"
                                activeStyle={{
                                    background:'#FBBC05',
                                    color:'#666',
                                    fontWeight: 400
                                }} >
                                     <div className="text">Профиль</div> {/*Личный кабинет */}
                        </NavLink>

                        <NavLink data-tip data-for='favorites' to="/favorites" className="Favorites"
                                activeStyle={{
                                    background:'#FBBC05',
                                    color:'#666',
                                    fontWeight: 400
                                }} >
                                   <div className="text">Избранное</div>
                        </NavLink>

                        <NavLink data-tip data-for='subs' to="/subs" className="Subs"
                                activeStyle={{
                                    background:'#FBBC05',
                                    color:'#666',
                                    fontWeight: 400
                                }} >
                                   <div className="text">Подписки</div>
                        </NavLink>

                        <NavLink data-tip data-for='history' to="/history" className="History"
                                activeStyle={{
                                    background:'#FBBC05',
                                    color:'#666',
                                    fontWeight: 400
                                }} >
                                   <div className="text">История</div>
                        </NavLink>
                        </div>

                        <div className="lastnav">
                        <NavLink data-tip data-for='support' to="/support" className="Support"
                                activeStyle={{
                                    background:'#FBBC05',
                                    color:'#666',
                                    fontWeight: 400
                                }} >
                                    <div className="text">Поддержка</div>
                        </NavLink>
                        </div>
                </div>
                    <div className="rtt">
                <ReactTooltip id='feed' place="right" type="dark" effect="solid">
                                    <span>Главная</span>
                                </ReactTooltip>

                                <ReactTooltip id='cabinet' place="right" type="dark" effect="solid">
                                    <span>Профиль</span>
                                </ReactTooltip>

                                <ReactTooltip id='history' place="right" type="dark" effect="solid">
                                    <span>История</span>
                                </ReactTooltip>

                                <ReactTooltip id='favorites' place="right" type="dark" effect="solid">
                                    <span>Избранное</span>
                                </ReactTooltip>

                                <ReactTooltip id='subs' place="right" type="dark" effect="solid">
                                    <span>Подписки</span>
                                </ReactTooltip>

                                <ReactTooltip id='support' place="right" type="dark" effect="solid">
                                    <span>Поддержка</span>
                                </ReactTooltip>
                    </div>
           </>
        )
    }
export default navigation;