import React, { Component } from 'react';
import './logreg.css'
import log1 from './img/log1.svg';
import register1 from './img/register1.svg';
import {
  //  SberidSDK1,
   SberSDK1 } from '../../sberidsdk';

class Logreg extends Component {


  //-===============================================================================================-//

   function () {
     console.log('Function...');
             const oidcParams = {
               response_type: 'code',
               client_type: 'PRIVATE',
               client_id: '6a0e103b-1873-4ed5-9903-b4fb51192b23',
               state: 'ut8Ar4MUZEMDPIiD2ko914y37s0Q0VKJgxeCkU0yzTY',
               redirect_uri: 'http://localhost:3000/success/',
               scope: 'openid+name+birthdate+email',
               nonce: 'NfZscgwxPY7v0kYvuPfnFHA57bqHxQc3lV51Oiaxlo4'
             };

             const sa = {
               enable: true,
               init: 'auto',
               clientId: '6a0e103b-1873-4ed5-9903-b4fb51192b23',
               clientName: 'ООО Ромашка'
             };


             function onSuccessCallback(result) {
                 console.log('Вы успешно вошли: ', result);
                 const params = {
                     nonce: oidcParams.nonce,
                     code: result.code
                 }
                 fetch('http://tkle-erib0250.vm.esrt.cloud.sbrf.ru:8080/login?' + new URLSearchParams(params)).then(
                     function (response) {
                         return response.json();
                     }).then(function (params) {

                     console.log(params);
                 });
             }

             function onErrorCallback(result) {
                 console.log('Что-то пошло не так: ', result)
             }

             const universallinkParams = {
                 baseUrl: 'https://csa-psi.testonline.sberbank.ru:9445/CSAFront/oidc/authorize.do',
                 needAdditionalRedirect: true
             }

     //Инициализация SDK
     const sbSDK = new SberSDK1 ({
         oidc: oidcParams,
         onSuccessCallback: onSuccessCallback,
         onErrorCallback: onErrorCallback,
         container: 'result',
         mweb2app: true,
         display: 'popup',
         universallink: universallinkParams,
         sa: sa
     }, onSuccessCallback, onErrorCallback);
 }

  //-===============================================================================================-//

    sendL(){

        // получаем данные формы
        let loginForm = document.forms["forforms1"];
        let userLogin = loginForm.elements["login"].value;
        let userPassword = loginForm.elements["password"].value;
    
        // сериализуем данные в json
        let user = JSON.stringify({password: userPassword, login: userLogin});
        let request = new XMLHttpRequest();
    
        request.open("POST", "/api/auth/login", true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(user);
    
        request.addEventListener("load", function () {
            // получаем и парсим ответ сервера
             if(request.response==="Successfully authenticated!") {
                 window.location.href = '/';
             }else {
                 alert("Проверьте корректность введенных данных");
             }
        })
    
    }

    sendR(){
   
        // получаем данные формы
        let registerForm = document.forms["forforms"];
        let userFirstname = registerForm.elements["firstname"].value;
        let userEmail = registerForm.elements["email"].value;
        let userNickname = registerForm.elements["nickname"].value;
        let userPassword = registerForm.elements["password"].value;
        let userLastname = registerForm.elements["lastname"].value;
        let userDateOfBirth = registerForm.elements["dateOfBirth"].value;
        // сериализуем данные в json
        let user = JSON.stringify({nickname: userNickname, firstname: userFirstname, lastname: userLastname, dateOfBirth: userDateOfBirth, password: userPassword, email: userEmail});
        let request = new XMLHttpRequest();
        // посылаем запрос на адрес "/user"
      
        request.open("POST", "/api/auth/register", true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(user);
  
        request.addEventListener("load", function () {
            // получаем и парсим ответ сервера
             if(request.response==="Successfully created!") {
                 window.location.href = '/successregistration';
             }else {
                 alert("Проверьте корректность введенных данных");
             }
        })
    
    }

    componentDidMount () {
        const sign_in_btn = document.querySelector("#sign-in-btn");
        const sign_up_btn = document.querySelector("#sign-up-btn");
        const container = document.querySelector(".container1");


        sign_up_btn.addEventListener("click", () => {
          container.classList.add("sign-up-mode");
        });
        
        sign_in_btn.addEventListener("click", () => {
          container.classList.remove("sign-up-mode");
        });



        const script = document.createElement("script");
    
        script.src = "https://kit.fontawesome.com/64d58efce2.js";
        script.async = true;
    
        document.body.appendChild(script);
    }



    render() {
        return (
            <>
 
                <div className="container1">
              <div className="forms-container">
                <div className="signin-signup">
                  <form id="forforms1" action="#" className="sign-in-form">
                    <h2 className="title">Авторизация</h2>
                    <div className="input-field">
                      <i className="fas fa-user"></i>
                      <input type="text" name="login" placeholder="Логин или почта" />
                    </div>
                    <div className="input-field">
                      <i className="fas fa-lock"></i>
                      <input type="password" name="password" placeholder="Пароль" />
                    </div>
                    <input type="submit" value="Войти" className="btn solid" onClick={e => {e.preventDefault(); this.sendL()}} />
                    <p className="social-text">Или войдите с помощью социальной платформы</p>

                    <div className="social-media">
                       {/* <a href="/api/auth/facebook" className="social-icon">
                        <i className="fa fa-facebook-f"></i>
                      </a> */}
                      {/* <a href="#" className="social-icon">
                        <i className="fa fa-twitter"></i>
                      </a> */}
                      <a href="/api/auth/google" className="social-icon">
                        <i className="fa fa-google"></i>
                      </a>
                      <a href="/api/auth/vkontakte" className="social-icon">
                        <i className="fa fa-vk"></i>
                      </a>
                    </div>

                    <div className="result">{this.function()}</div> 

                  </form>
                  

                  
                  <form id="forforms" action="#" className="sign-up-form">
                    <h2 className="title">Регистрация</h2>
                    <div className="input-field">
                      <i className="fa fa-user-circle"></i>
                      <input type="text" name="firstname" placeholder="Имя" />
                    </div>
                    <div className="input-field">
                      <i className="fa fa-user-circle-o"></i>
                      <input type="text" name="lastname" placeholder="Фамилия" />
                    </div>
                    <div className="input-field">
                      <i className="fa fa-address-card"></i>
                      <input type="text" name="nickname" placeholder="Ваш будущий логин" />
                    </div>
                    <div className="input-field">
                      <i className="fa fa-birthday-cake"></i>
                      <input type="text" name="dateOfBirth" placeholder="Дата рождения" />
                    </div>
                    <div className="input-field">
                      <i className="fas fa-envelope"></i>
                      <input type="email" name="email" placeholder="Электронная почта" />
                    </div>
                    <div className="input-field">
                      <i className="fas fa-lock"></i>
                      <input type="password" name="password" placeholder="Пароль" />
                    </div>
                    <input type="submit" className="btn solid" value="Отправить" onClick={e => {e.preventDefault(); this.sendR()}}/>
                    <p className="social-text">Или зарегистрируйтесь с помощью социальных сетей</p>
                    <div className="social-media">
                      {/* <a href="/api/auth/facebook" className="social-icon">
                        <i className="fa fa-facebook-f"></i>
                      </a> */}
                      {/* <a href="#" className="social-icon">
                        <i className="fa fa-twitter"></i>
                      </a> */}
                      <a href="/api/auth/google" class="social-icon">
                        <i className="fa fa-google"></i>
                      </a>
                      <a href="/api/auth/vkontakte" class="social-icon">
                        <i className="fa fa-vk"></i>
                      </a>
                    </div>
                  </form>
                  
                </div>
              </div>

              <div className="panels-container">
                <div className="panel left-panel">
                  <div className="content">
                    <h3>Впервые здесь?</h3>
                    <p>
                      Зарегистрируйтесь, чтобы получить доступ к личному кабинету и возможности самому загружать видео.
                    </p>
                    <button className="btn transparent" id="sign-up-btn">
                      Зарегистрироваться
                    </button>
                    <form action="/">
                      <button className="btn transparent1">
                        На Главную
                      </button>
                    </form>
                  </div>
                  <img src={log1} className="image" alt="" />
                </div>
                <div className="panel right-panel">
                  <div className="content">
                    <h3>Вы уже один из нас?</h3>
                    <p>
                      Войдите в свой аккаунт и продолжайте хорошо проводить время.
                    </p>
                    <button className="btn transparent" id="sign-in-btn">
                      Войти
                    </button>
                    <form action="/">
                      <button className="btn transparent1">
                        На Главную
                      </button>
                    </form>
                  </div>
                  <img src={register1} className="image" alt="" />
                </div>
             </div>
    </div>


            </>
        )
    }
}

export default Logreg;