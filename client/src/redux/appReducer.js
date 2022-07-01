import { IS_AUTHORIZED, USER_DATA } from './types'

const initialState =
{
    loading: true,
    // alert: null,
    // text: false,
    isFetching: true,
    isAuthorized: false,
    userData: [],
    userD: [],


}

export const appReducer = async (state= initialState, action) =>{

    switch(action.type) {
        case IS_AUTHORIZED:
          return{ ...state, isAuthorized:action.payload, loading:false }


        case USER_DATA:
          return{ ...state, userData:action.payload, loading:false }





          // let isAuthorized = false;
          // let isFetching = true;

          // await fetch('/api/auth/isauthorized')
          // .then(result => result=result.json())
          // .then(result => {
          //     console.log("result", result);

          //     if(result._id!==null){
          //             isAuthorized = true
          //             isFetching = false
          //           }
          //     else{
          //         isAuthorized = false
          //          isFetching = false
          //     }
          // })
          // return isAuthorized

        // case GET_USER_DATA:
        //   return state.userData

        default:
          return state;
      }



    // switch(action.type){
    //     case SHOW_LOADER:
    //         return {...state, loading: true}

    //     case HIDE_LOADER:
    //         return {...state, loading: false}

    //     case SHOW_ALERT:
    //             return {...state, alert: action.payload}

    //     case HIDE_ALERT:
    //             return {...state, alert: null}

    //     case SHOW_TEXT:
    //         return {...state, text: true}

    //     case IS_NOT_FETCHING:
    //         return {...state, isFetching: false}

    //     case IS_AUTHORIZED:
    //         return {...state, isAuthorized: true}

    //     case IS_FETCHING:
    //         return {...state, isFetching: true}

    //     case IS_NOT_AUTHORIZED:
    //         return {...state, isAuthorized: false}

    //     default: return state
    // }
}