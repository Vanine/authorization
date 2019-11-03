import { SET_USERS } from './actiontypes';
export const setUsers = (data) => {
    return {
        type: SET_USERS,
        payload: data
        }
}