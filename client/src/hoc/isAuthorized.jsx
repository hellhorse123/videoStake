// import React from 'react';

// const isAuthorized = (Component) => {

//     return (props) => {
//         componentDidMount() {
//             fetch('/api/auth/isauthorized')
//             .then(result => result=result.text())
//             .then(result => {

//               if(result === "Authorized"){
//                 this.setState({isAuthorized: true, isFetching: false})
//               }else{
//                 this.setState({isAuthorized: false, isFetching: false})
//               }
//             })
//             .catch(e => {
//               console.log(e);
//               this.setState({isFetching: false, error: e });
//             })
//         }
// }
// }
// export default isAuthorized;