import React, { useContext, useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import styled from 'styled-components'
import Avatar from 'react-avatar';


import './Comments.scss';
import { WatchContext } from '../WatchContext'
import {MyContext} from "../../../MyContext";
import CommentsPreloader from '../../../Components/common/CommentsPreloader/CommentsPreloader'

function ReadMore({children, maxCharacterCount = 100}){
    const text = children;
    const [isTruncated, setIsTruncated] = useState(true)
    const resultString = isTruncated ? text.slice(0, maxCharacterCount) : text

    function toggleIsTruncated(){
        setIsTruncated(!isTruncated)
    }
    return(
        <p className="has-text-left">
            {resultString}
            { text.length<100 ?
            null
            :
            <div className="rmb">
            <span onClick={toggleIsTruncated} className="read-more-button">
                {isTruncated ? "ЕЩЁ" : "СКРЫТЬ"}
            </span>
            </div>
            }
        </p>
    )
}

const Button = styled.button`
    float: right;
    display: block;
    line-height: 20px;
    /* height: 40px; */
    min-width: 100px;
    padding: 8px 20px;
    background:none;
    /* overflow: hidden; */
    text-align: center;
    text-decoration: none;
    font-weight: bold;
    /* text-shadow: 0 100px 0 #FFF,1px 76px 10px #000; */
    border: 2px solid #000;

    /* transition: all 0.3s ease-in-out; */

    /* :hover {
        text-shadow: 0 50px 0 #FFF, 1px 51px 20px #FFF;
        margin-top: -100px;
        height: 140px;
        background: #141414;
} */
    :disabled {
        border: 2px solid #999999;
        background-color: #cccccc;
        color: #fff;
    }
`;

const Comments = () => {

    const { isAuthorized } = useContext(MyContext)

    const { videoIdCC, userData } = useContext(WatchContext)
    let [comments, setComments] = useState({});
    let [isFetching, setIsFetching] = useState(true);

    const [disabled, setDisabled] = useState(true);


    // const forceUpdate = ()=>{
    //     setIsFetching(true);
    //     setIsFetching(false);
    // }

    const handleChange = (e)=>{
        console.log(e.target.value.length)
        if(e.target.value.length >0){
            setDisabled(false)
            Button.float="left"

        }
        else{
            setDisabled(true)
        }
    }

    const addComment = () =>{
        if(!isAuthorized) return window.location.href = '/logreg1';
        let commentForm = document.forms["commentForm"];
        let commentText = commentForm.elements["commentText"].value;
        fetch("/api/comments/" + videoIdCC,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"data": commentText})
        })
        const newComment = [{
            _id: "none",
            commentatorNickname: userData.nickname,
            data: commentText
        }]
        setComments(newComment.concat(comments))
        const commentTextField = document.getElementById("commentText");
        commentTextField.value = "";
        setDisabled(true)
        //commentForm.placeholder = "Добавить комментарий";
    }


    useEffect(() => {

        fetch('/api/comments/' + videoIdCC)
        .then(result => result.json())
        .then(result => {
        console.log(result);
            setComments(result)
            setIsFetching(!isFetching);
        })
    }, [])



        if(isFetching){
            return <CommentsPreloader />
        }
        else return (

            <>

                <div className="CommentForm">
                        <form id="commentForm">
                            <div  className="ProfileImg">
                                <Link to="/cabinet">
                                    < Avatar name={userData.nickname} size="48" />
                                </Link>
                            </div>
                            <textarea id="commentText" type="text" placeholder="Добавьте комментарий" className="InputComment" onChange={handleChange} />
                            <div className="ccd">
                                <Button disabled={disabled} onClick={ e => { e.preventDefault(); addComment(); }}>Добавить комментарий</Button>
                            </div>
                        </form>
                    </div>

                <div className="Comments">
                    {Object.keys(comments).map(key => (
                    <div key={key} className="CommentInfo">
                            <Avatar className="ProfileImg"name={comments[key].commentatorNickname} size="48" />

                        {console.log(comments[key])}

                        <div className="CommentText">
                            <div className="CommentatorNick">
                                {comments[key].commentatorNickname}
                            </div>
                            <ReadMore maxCharacterCount={100}>
                                {comments[key].data}
                            </ReadMore>
                        </div>
                    </div>
                    ))}
                </div>

            </>
        )
    }


export default withRouter(Comments);