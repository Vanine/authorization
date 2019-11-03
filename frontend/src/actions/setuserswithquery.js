import { SET_USERS_WITH_QUERY } from './actiontypes';
export const setUsersWithQuery = (data) => {
    return {
        type: SET_USERS_WITH_QUERY,
        payload: data
    }
}