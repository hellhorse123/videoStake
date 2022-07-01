import React, { Component } from 'react';
import './DownloadVideoPage.scss';
import UploadV from '../../img/UploadV.svg';


class DownloadVideoPage extends Component {

    render() {
        return (
            <>
                <meta http-equiv="Refresh" content="1; URL=/cabinet" />
                <div className="SucBlock">
                    <img src={UploadV} className="image" alt="" />
                    <h1>Видео успешно загружено!</h1>
               </div>
            </>
        )
    }
  }



export default DownloadVideoPage;