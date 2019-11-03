import { DELETE_USER } from './actiontypes';
export const deleteUser = (data) => {
    return {
        type: DELETE_USER,
        payload: data
    }
}