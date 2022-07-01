import { IS_AUTHORIZED, USER_DATA } from './types'


export function isAuthorized() {
    return async dispatch => {
        try{
            const response = await fetch('/api/auth/isauthorized' )
            const json = await response.json()
            if(json._id){
                dispatch(
                    {type: IS_AUTHORIZED, payload: true}
                )}
                else{
                dispatch(
                    {type: IS_AUTHORIZED, payload: false}
                )}
        }
        catch(e) {
            console.log(e);
            // this.setState({isFetching: false, error: e });
            // this.props.isNotFetching()
            this.setState({ error: e });
          }
    }
}

export function userData() {
    return async dispatch => {
        try{
            const response = await fetch('/api/auth/isauthorized')
            const json = await response.json()
            dispatch({ type: USER_DATA, payload: json})
        }
        catch(e) {
            console.log(e);
            this.setState({isFetching: false, error: e });
          }
    }
}




// export function isFetching() {
//     return{
//         type: IS_FETCHING
//     }
// }

// export function isNotAuthorized() {
//     return{
//         type: IS_NOT_AUTHORIZED
//     }
// }

// export function isNotFetching() {
//     return{
//         type: IS_NOT_FETCHING
//     }
// }


// export function showText() {
//     return dispatch => {
//         dispatch({
//             type: SHOW_TEXT,
//             // payload: text
//         })
//     }
// }
