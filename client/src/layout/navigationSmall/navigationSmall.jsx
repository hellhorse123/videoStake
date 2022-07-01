import React from 'react';
import { NavLink } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
// import ReactTooltip from "react-tooltip";
import './navigationSmall.scss';

const navigationSmall = () => {

        return (
            <>
            <div className="navigationSmall">
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
                        </NavLink>



                        <NavLink data-tip data-for='cabinet' to="/cabinet" className="Cab"
                                activeStyle={{
                                    background:'#FBBC05',
                                    color:'#666',
                                    fontWeight: 400
                                }} >
                        </NavLink>

                        <NavLink data-tip data-for='favorites' to="/favorites" className="Favorites"
                                activeStyle={{
                                    background:'#FBBC05',
                                    color:'#666',
                                    fontWeight: 400
                                }} >
                        </NavLink>

                        <NavLink data-tip data-for='subs' to="/subs" className="Subs"
                                activeStyle={{
                                    background:'#FBBC05',
                                    color:'#666',
                                    fontWeight: 400
                                }} >
                        </NavLink>

                        <NavLink data-tip data-for='history' to="/history" className="History"
                                activeStyle={{
                                    background:'#FBBC05',
                                    color:'#666',
                                    fontWeight: 400
                                }} >
                        </NavLink>
                        </div>

                        <div className="lastnav">
                        <NavLink data-tip data-for='support' to="/support" className="Support"
                                activeStyle={{
                                    background:'#FBBC05',
                                    color:'#666',
                                    fontWeight: 400
                                }} >
                        </NavLink>
                        </div>
                </div>
           </>
        )
    }
export default navigationSmall;
