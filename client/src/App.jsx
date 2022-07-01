
import React, { lazy, useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import {connect} from 'react-redux'
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux'

import './App.scss';
import {MyContext} from './MyContext'
import Feed from './Pages/Feed/Feed';
import Cabinet from './Pages/Cabinet/Cabinet.jsx';
import ChannelReview from './Pages/ChannelReview/ChannelReview.jsx';
// import Downloads from './Pages/Downloads/Downloads';
import Watch from './Pages/Watch/Watch';
import Favorites from './Pages/Favorites/Favorites';
import SearchDisplay from './Pages/SearchDisplay/SearchDisplay';
import Subs from './Pages/Subs/Subs';
import History from './Pages/History/History';
import Logreg from './Pages/LogReg1/Logreg';
import DownloadVideoPage from './Pages/DownloadVideoPage/DownloadVideoPage';
import SuccessRegistration from './Pages/SuccessRegistration/SuccessRegistration';
// import Support from './Pages/Support/Support';

import withSuspense from './hoc/withSuspense';
// import monkeyLoader from './img/monkeyLoader.gif'
import PreloaderFeed from './Components/common/PreloaderFeed/PreloaderFeed'

// import { isAuthorized, userData } from './redux/actions'

//import About from './Pages/About/About';
const About = lazy(() => import('./Pages/About/About'));

const Support = lazy(() => import('./Pages/Support/Support'));




const App = () => {

const [isAuthorized, setIsAuthorized] = useState(false)
let [isFetching, setIsFetching] = useState(true)
const [videos, setVideos] = useState({});
let [userData, setUserData] = useState({});
const [error, setError] = useState(null);

  useEffect(() => {

      fetch('/api/auth/isauthorized')
      .then(result => /*result=*/result.json())
      .then(result => {
          // console.log("result", result);

          if(result._id!==null){
            setIsAuthorized(!isAuthorized);
            setIsFetching(!isFetching);
            // console.log(isFetching)
            setUserData(userData= result);
            // console.log(userData)

            // console.log("userData", userData);

              // this.setState({isAuthorized: true, isFetching: true, userData: result});
          }else{
            setIsAuthorized(isAuthorized);
            setIsFetching(!isFetching);
              // this.setState({isAuthorized: false, isFetching: true})
          }
      })
      .then((result) => {
        // console.log("result", result);
          fetch('/api/videos/by/' + userData.nickname)
              .then(response => response.json())
              .then(response => {
              // console.log("response", response);
                setVideos(response)
                // (!isFetching)
              })

      })
      .catch(e => {
        console.log(e);
        setError(e);
        //!isFetching
    })
  }, [])

    if (error) return <div>{`Error: ${error.message}`}</div>; // ?????

    if (isFetching ) {
        return (
        <PreloaderFeed />
        )

        // <img src={monkeyLoader} alt="Loading..." />
    }
    console.log(isAuthorized, isFetching, userData, videos, );
  return (
    
          <MyContext.Provider value={{
        isAuthorized,
         isFetching,
          userData, videos
      }} >
        <Router>
            <Switch>
                <Route exact path="/" component={Feed} />
                <Route exact path="/cabinet" component={Cabinet} />
                {/* <Route exact path="/downloads" component={Downloads} /> */}

                <Route exact path="/about" component={About}/>

                <Route exact path="/watch:videoId" component={Watch} />
                <Route exact path="/favorites" component={Favorites} />

                <Route exact path="/search/:query" component={SearchDisplay} />

                <Route exact path="/history" component={History} />
                <Route exact path="/subs" component={Subs} />

                <Route exact path="/downloadVideoPage" component={DownloadVideoPage} />

                <Route exact path="/successRegistration" component={SuccessRegistration} />
                {/* <Route exact path="/support" component={Support} /> */}

                  <Route exact path="/support"
                          render= {withSuspense(Support)}
                  />


                  <Route exact path="/logreg1" component={Logreg} />

                <Route exact path="/channel/:channelName" component={ChannelReview} />

                  <Redirect to="/" />

            </Switch>
        </Router>
      </MyContext.Provider>
  );
}

export default App

