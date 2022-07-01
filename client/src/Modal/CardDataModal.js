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

export const CardDataModal = ({
  showCardDataModal,
  setShowCardDataModal,
  cardData,
}) => {
  const modalRef = useRef();

  const [status1, setStatus1] = useState("");

  const [hiddenStatus, setHiddenStatus] = useState(false);

  const [errors, setErrors] = useState({});

  const submitHandler = (e) => {
    e.preventDefault();
    if (status1.length < 19) {
      alert('Убедитесь в правильности заполнения');
    }
    else{
    fetch("/api/auth/card", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ card: status1 }),
    }).then(() => {
      window.location.reload();
    });
  }
  };

  const animation = useSpring({
    config: {
      duration: 250,
    },
    // opacity: showCardDataModal ? 0 : 1,
    // transform: showCardDataModal ? `translateY(-100%)` : `translateY(0%)`
  });

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowCardDataModal(false);
    }
  };

  // const keyPress = useCallback(e => {
  //     if (e.key === 'Escape' && showCardDataModal) {
  //         setShowCardDataModal(false)
  //     }
  // }, [setShowCardDataModal, showCardDataModal])

  // useEffect(() => {
  //     document.addEventListener('keydown', keyPress)
  //     return () => document.removeEventListener('keydown', keyPress)
  // }, [keyPress])

  return (
    <>
      {showCardDataModal ? (
        <Background
          ref={modalRef}
          //  onClick={closeModal}
        >
          <animated.div style={animation}>
            <ModalWrapper showModal={showCardDataModal}>
              <ModalImg>
                <div className="ModalLeft">
                  <form
                    action="/api/auth/card"
                    method="post"
                    enctype="multipart/form-data"
                  >
                    <div id="downloadForm" className="download-form">
                      <label for="card">Номер кредитной карты:</label>
                      <input
                        id="card"
                        name="card"
                        type="tel"
                        inputmode="numeric"
                        pattern="[0-9\s]{13,19}"
                        // autocomplete="cc-number"
                        maxlength="19"
                        placeholder=
                        // {
                          // cardData ? cardData : 
                          "xxxx xxxx xxxx xxxx"
                        // }
                        defaultValue={
                          cardData ? cardData : ""
                        }
                        validations="required"
                        className="form-control"
                        onChange={(event) => setStatus1(event.target.value)}
                      ></input>
                      <input
                        type="submit"
                        onClick={submitHandler}
                        className="btnS"
                        value={
                          cardData
                            ? "Обновить данные карты"
                            : "Сохранить данные карты"
                        }
                        disabled={status1 ? false : true}
                        hidden={hiddenStatus}
                      />
                    </div>
                  </form>
                </div>
              </ModalImg>
              <ModalContent>
                <p>
                  {cardData ?
                  'Для обновления данных введите новое значение'
                  :
                  'Для получения дохода вам необходимо ввести номер вашей карты'}
                  </p>
                <h2>
                  Информация является приватной и не поступит к третьим лицам!
                </h2>
                <p>
                  Вводя данные, вы принимаете нашу политику конфиденциальности
                </p>
              </ModalContent>
              <CloseModalButton
                aria-label="Close modal"
                onClick={() => setShowCardDataModal((prev) => !prev)}
                hidden={hiddenStatus}
              />
            </ModalWrapper>
          </animated.div>
        </Background>
      ) : null}
    </>
  );
};
