import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
	userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
	yearInfo: localStorage.getItem('yearInfo') ? JSON.parse(localStorage.getItem('yearInfo')) : null,
	classeInfo: localStorage.getItem('classeInfo') ? JSON.parse(localStorage.getItem('classeInfo')) : null
};
function reducer(state, action) {
	switch (action.type) {
		case 'USER_SIGNIN':
			return { ...state, userInfo: action.payload };
		case 'USER_SIGNOUT':
			return {
				...state,
				userInfo: null
			};
		case 'CREATE_YEAR':
			return {
				...state,
				yearInfo: action.payload
			};
		case 'CREATE_CLASSE':
			return {
				...state,
				classeInfo: action.payload
			};
		default:
			return state;
	}
}

export function StoreProvider(props) {
	const [ state, dispatch ] = useReducer(reducer, initialState);
	const value = { state, dispatch };
	return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
