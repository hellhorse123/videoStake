import React, { useContext } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { Navbar } from 'react-bootstrap';
// import { BrowserRouter, Route, Link } from "react-router-dom";

import './Header.scss';
import { MyContext } from '../../MyContext'
// import { FeedContext } from '../../Pages/Feed/FeedContext'
import VStake from '../../img/VStake.svg';
// import SearchDisplay from '../../Pages/SearchDisplay/SearchDisplay';



const Btn = () => {
    const { isAuthorized, isFetching} = useContext(MyContext)
    console.log(isAuthorized, isFetching)


        if(!isAuthorized && !isFetching){
            return <button className="In" >Войти</button>;
          }
          else
        return <button className="Out" onClick={e => {
            e.preventDefault();
            fetch('/api/auth/logout')
            .then(()=>{
                window.location.href = '/';
            })}}>Выйти</button>;
    }


    // const SearchComp = ({ history }) => {
    //     const { videos1 } = useContext(FeedContext)
    //     console.log(videos1)
    //     const [filter, setFilter] = React.useState("");

    //     const searchButtonHandler = () => {
    //         const filteredData = videos1.filter((item) =>
    //         item.videoname.toLowerCase().includes(filter.toLowerCase())
    //         );

    //         history.push("/searchDisplay", filteredData);
    //     };

    //     return (
    //         <div>
    //         SearchDisplay
    //         <input
    //             type="text"
    //             onChange={({ target: { value } }) => setFilter(value)}
    //             value={filter}
    //         />
    //         <button onClick={searchButtonHandler}>Search</button>
    //         </div>
    //     );
    //     };

    const searchHandler = (e) => {
        e.preventDefault();
        const query = document.getElementById("searchInput").value.split(' ').join('+');
        if(query){
            window.location.href = '/search/' + query;
        }
        else{
            window.location.href = '/';
        }
    }

    const Header = () => {

        return (
            <>
                <Navbar fixed="top">

                                <Navbar.Brand href="/" >
                                    <div className="LaT">
                                        <img
                                            src={VStake}
                                            className="logo d-inline-block align-top"
                                            alt="Logo"
                                        />
                                        <div className="txt">video/stake</div>
                                    </div>
                                </Navbar.Brand>
                                {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" /> */}
                                <Navbar.Collapse id="responsive-navbar-nav">

                                {/* <BrowserRouter>
                                <div className="search">
                                    <SearchComp/>
                                </div>
                                </BrowserRouter> */}



                                       <div className="search">
                                        <form name="publish">
                                            <input
                                            type="text"
                                            placeholder="&nbsp;Поиск"
                                            id="searchInput"
                                            />
                                            <button

                                            type="submit"
                                            onClick={searchHandler}
                                            />
                                        </form>
                                    </div>

                                    <form action="/logreg1" id = "btnlog" className="InOut">
                                        <Btn/>
                                    </form>
                                </Navbar.Collapse>
                </Navbar>
            </>
        )
    }
    export default Header;
