import React, { useContext, useState, useEffect } from 'react';

import './BtnSub.scss'
import { ChannelContext } from '../ChannelContext'


export default function BtnSub() {
    // const [authorData, setAuthorData] = useState({})
    const { userData, isAuthorized, authorData } = useContext(ChannelContext)
    const [isSubscribed, setIsSubscribed] = useState(userData?.subscribes?.includes(authorData?._id))
    const [subsCount, setSubsCount] = useState((authorData?.subscribers?.length))

    console.log(userData, isAuthorized, isSubscribed, authorData, userData?.subscribes?.includes(authorData?._id), authorData?.subscribers?.length, subsCount)


    const subscribe = () => {
        if(!isAuthorized) return window.location.href = '/logreg1';
        fetch("/api/user/subscribes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "channelID": authorData?._id })
        })
        .then(res2=>res2.json())
        .then(result=>{
            console.log(result)
        })
        if(isSubscribed){
            setIsSubscribed(false);
            setSubsCount(subsCount-1)
        }
        else{
            setIsSubscribed(true)
            setSubsCount(subsCount+1)
        }
    }

    return (
        <>
            <div className="ChannelName">
                {authorData.nickname}
                <br />
                <p>
                    Количество подписчиков:
                    &nbsp;
                    {subsCount}
                </p>
            </div>
            <div className="Subscribe">
                {isSubscribed
                    ?
                        <button className="SubYes" onClick={
                            e => {
                                e.preventDefault(); subscribe()
                            }}>
                            Вы подписаны
                        </button>
                    :

                        <button className="Sub" onClick={
                            e => {
                                e.preventDefault(); subscribe()
                            }}>
                            Подписаться
                        </button>
                }
            </div>
        </>
    )
}
