import {combineReducers} from 'redux'

import app from './app'
import nav from './nav'
import goods from './goods'
import order from './order'
import entrust from './entrust'
import preOrder from './preOrder'
import car from './car';
import driver from './driver';
import message from './message';
import carrier from './carrier';
import help from './help';
import routes from './routes';
import travel from './travel';
import eSign from './eSign';
import bankCard from './bankCard';
import user from './user';
import home from './home';

const initialAuthState = {isLoggedIn: false};

const AppReducer = combineReducers({
    nav,
    app,
    goods,
    order,
    entrust,
    preOrder,
    car,
    driver,
    message,
    carrier,
    help,
    routes,
    travel,
    eSign,
    bankCard,
    user,
    home,
});

export default AppReducer
