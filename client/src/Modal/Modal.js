import React, { useRef, useEffect, useCallback, useState } from "react";
// import { Link } from 'react-router-dom'

import { useSpring, animated } from "react-spring";
import styled from "styled-components";
import { MdClose } from "react-icons/md";
// import modalImg from './modal.jpg'
import load from "../img/load.gif";

import "./Modal.scss";
import TagsInput from "./components/TagsInput";

// import Form from 'react-validation/build/form';
// import Input from 'react-validation/build/input';

// import { useForm } from "react-hook-form";

const Background = styled.div`
  width: 100%;
  top: 0;
  height: 100%;
  z-index: 1031;
  background: rgba(0, 0, 0, 0.8);
  /* border:3px solid white; */
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalWrapper = styled.div`
  width: 800px;
  height: 500px;
  box-shadow: 0px 0px 100px 48px rgba(156, 140, 213, 0.78);
  background: #fff;
  color: #000;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  z-index: 100;
  border-radius: 10px;
`;

const ModalImg = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.8;
  border-radius: 10px 0 0 10px;
  background: #e8e8e8;
  padding: 10px;

  form {
    /* border:1px solid; */
    height: 100%;
  }
  input {
    margin-bottom: 1rem;
    align-items: center;
  }
  .btnS {
    padding: 10px 24px;
    background: #fbbc05;
    color: #fff;
    border: none;
    margin: 0 auto;
    display: flex;
    /* flex-direction:column; */
    justify-content: center;
    align-items: center;
    :disabled {
      background: #ccc;
    }
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.8;
  color: #141414;
  padding: 10px;
  h2 {
    text-align: center;
    margin-bottom: 2rem;
  }
  p {
    text-align: center;
    margin-bottom: 1rem;
  }
  input {
    padding: 10px 24px;
    background: #fbbc05;
    color: #fff;
    border: none;
  }
`;
const CloseModalButton = styled(MdClose)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
  transition: transform 0.2s ease-in-out;
  :hover {
    color: #5840aa;
    transform: rotate(90deg);
  }
`;

export const Modal = ({ showModal, setShowModal }) => {
  const modalRef = useRef();

  const [status1, setStatus1] = useState("");
  const [status2, setStatus2] = useState("");
  const [status3, setStatus3] = useState("");
  const [status4, setStatus4] = useState("");
  const [status5, setStatus5] = useState("");

  const [hiddenStatus, setHiddenStatus] = useState(false);

  const [tags, setTags] = useState([]);

  const [errors, setErrors] = useState({});

  const handleChangeTags = (name, value) => {
    console.log(value.length, status1, status2);
    if (name === "tags") {
      setTags(value);
      if (value.length > 0) {
        setStatus4(value.length);
      } else {
        setStatus4("");
      }
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (tags.length === 0) {
      setErrors((prev) => ({
        ...prev,
        tags: "Please add at least one tag",
      }));
    } else if (tags.length > 0) {
      console.log(tags);
      let fileInput = document.getElementById("fileInput");
      let videoNameInput = document.getElementById("videoNameInput");
      let description = document.getElementById("description");
      let adsCount = document.getElementById("adsCount");
      let formData = new FormData();
      // setBtnStatus(true);
      setHiddenStatus(!hiddenStatus);
      formData.append("filedata", fileInput.files[0]);
      formData.append("tags", tags);
      formData.append("videoname", videoNameInput.value);
      formData.append("adsCount", adsCount.value);
      formData.append("description", description.value);
      fetch("/api/videos/upload", {
        method: "POST",
        body: formData,
      }).then(() => {
        window.location.href = "/downloadvideopage";
      });
    }
  };

  const animation = useSpring({
    config: {
      duration: 250,
    },
    // opacity: showModal ? 0 : 1,
    // transform: showModal ? `translateY(-100%)` : `translateY(0%)`
  });

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  // const keyPress = useCallback(e => {
  //     if (e.key === 'Escape' && showModal) {
  //         setShowModal(false)
  //     }
  // }, [setShowModal, showModal])

  // useEffect(() => {
  //     document.addEventListener('keydown', keyPress)
  //     return () => document.removeEventListener('keydown', keyPress)
  // }, [keyPress])

  return (
    <>
      {showModal ? (
        <Background
          ref={modalRef}
          //  onClick={closeModal}
        >
          <animated.div style={animation}>
            <ModalWrapper showModal={showModal}>
              <ModalImg>
                <div className="ModalLeft">
                  <form
                    action="/api/videos/upload"
                    method="post"
                    enctype="multipart/form-data"
                  >
                    <div id="downloadForm" className="download-form">
                      <input
                        value={status1}
                        type="file"
                        id="fileInput"
                        name="filedata"
                        onChange={(event) => setStatus1(event.target.value)}
                      />
                      <input
                        value={status2}
                        type="text"
                        id="videoNameInput"
                        name="videoname"
                        validations="required"
                        className="form-control"
                        placeholder="Введите название (не более 52 символов)"
                        maxlength="52"
                        onChange={(event) => setStatus2(event.target.value)}
                      />
                      <textarea
                        value={status3}
                        type="text"
                        id="description"
                        name="description"
                        className="form-control inp-desc"
                        placeholder="Введите описание (не более 1024 символов)"
                        maxlength="1024"
                        onChange={(event) => setStatus3(event.target.value)}
                        wrap="soft"
                      />

                      <input
                        value={status5}
                        type="number"
                        id="adsCount"
                        name="adsCount"
                        validations="required"
                        className="form-control"
                        placeholder="Введите количество рекламы в видео"
                        maxlength="2"
                        onChange={(event) => setStatus5(event.target.value)}
                      />

                      <div className="TI">
                        <TagsInput
                          // label="Tags"
                          type="text"
                          id="tags"
                          name="tags"
                          placeholder="Укажите тэги"
                          onChange={handleChangeTags}
                          error={errors.tags}
                          defaultTags={tags}
                        />
                      </div>
                      {status1 !== "" &&
                      status2 !== "" &&
                      status3 !== "" &&
                      status4 !== "" &&
                      status5 !== "" ? (
                        <input
                          type="submit"
                          onClick={submitHandler}
                          className="btnS"
                          value="Загрузить"
                          disabled={false}
                          hidden={hiddenStatus}
                        />
                      ) : (
                        <input
                          type="submit"
                          onClick={submitHandler}
                          className="btnS"
                          value="Загрузить"
                          disabled={true}
                          hidden={hiddenStatus}
                        />
                      )}
                      <div className="Load" hidden={!hiddenStatus}>
                        <img src={load} width="30" height="30" />
                        Видео обрабатывается, пожалуйста подождите
                      </div>
                    </div>
                  </form>
                </div>
              </ModalImg>
              <ModalContent>
                <p>
                  Все поля являются обязательными. Пожалуйста, убедитесь в том,
                  что поля не пустые, а после
                </p>
                <h2>Скорее нажмите на кнопку Загрузить!</h2>
                <p>
                  Загружая видео, вы принимаете нашу политику конфиденциальности
                </p>
              </ModalContent>
              <CloseModalButton
                aria-label="Close modal"
                onClick={() => setShowModal((prev) => !prev)}
                hidden={hiddenStatus}
              />
            </ModalWrapper>
          </animated.div>
        </Background>
      ) : null}
    </>
  );
};
