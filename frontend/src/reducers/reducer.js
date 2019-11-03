import { SET_USERS, ADD_USER, DELETE_USER, UPDATE_USER, SET_USERS_WITH_QUERY } from '../actions/actiontypes';
let initialState = {
    users: [],
    pageCount: 0
}
export default function userslist(state = initialState, action) {
    if (action.type == ADD_USER) {
         return {
             ...state,
             users: [...state.users, action.payload],
         }
    }
    else if (action.type == DELETE_USER) {
        return {
            ...state,
            users: [...state.users.filter(user => 
                user._id !== action.payload)]
        }
    }

    else if (action.type == UPDATE_USER) {
        console.log("actioni payload: ", action.payload);
        [...state.users].find(item => {
            if(item._id == action.payload._id) {
              item = action.payload
            }
      });
      return {
          ...state,
          users: [...state.users]
      };
    }
    else if (action.type == SET_USERS) {
        const a = [...state.users, ...action.payload.users].length;
        console.log(Math.ceil(a / 10));
    return {
        ...state,
        users: [...state.users, ...action.payload.users],
        pageCount: action.payload.pageCount
    }
 }
 else if (action.type == SET_USERS_WITH_QUERY) {
    return {
        ...state,
        users: [...action.payload.users],
        pageCount: action.payload.pageCount
        }
 }
     return state;
} 