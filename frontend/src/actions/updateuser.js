import { UPDATE_USER } from './actiontypes';
export const updateUser = (data) => {
    return {
        type: UPDATE_USER,
        payload: data
    }
}