import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App/App.js';
import { createStore, combineReducers, applyMiddleware } from 'redux';
// Provider allows us to use redux within our react app
import { Provider } from 'react-redux';
import logger from 'redux-logger';
// Import saga middleware
import createSagaMiddleware from 'redux-saga';
import { takeEvery, put } from 'redux-saga/effects';
import axios from 'axios';
import movies from './redux/reducers/movies.reducer';
import genres from './redux/reducers/genres.reducer';
import selectedMovie from './redux/reducers/selectedMovie.reducer';

// Create the rootSaga generator function
function* rootSaga() {
    yield takeEvery('FETCH_MOVIES', fetchAllMovies);
    yield takeEvery('FETCH_SINGLE_MOVIE', fetchSingleMovieDetail)
    yield takeEvery('FETCH_GENRES', fetchGenres)
    yield takeEvery('ADD_NEW_MOVIE', addNewMovie)
    yield takeEvery('MODIFY_MOVIE', modifyMovie)
}

function* fetchAllMovies() {
    // get all movies from the DB
    try {
        const movies = yield axios.get('/api/movie');
        console.log('get all:', movies.data);
        yield put({ type: 'SET_MOVIES', payload: movies.data });
    } catch {
        console.log('get all error');
    }
}

function* fetchSingleMovieDetail(action) {
    //get selected movie from the db
    console.log('In fetchSingleMovieDetail', action)
    try {
        const getSingleMovie = yield axios.get(`/api/movie/${action.payload}`)
        console.log(getSingleMovie)
        yield put({ type: 'SET_SELECTED_MOVIE', payload: getSingleMovie.data[0] })
    } catch (error) {
        console.log('Error in fetchSingleMovie generator', error)
    }
}

function* fetchGenres(action) {
    //get selected movie from the db
    console.log('In fetchGenres', action)
    try {
        const getGenres = yield axios.get(`/api/genre`)
        console.log(getGenres)
        yield put({ type: 'SET_GENRES', payload: getGenres.data })
    } catch (error) {
        console.log('Error in fetchGenres generator', error)
    }
}

function* addNewMovie(action) {
    //Add new movie to the db
    console.log('In addNewMovies', action)
    try {
        yield axios.post('/api/movie', action.payload)
        yield put({ type: 'FETCH_MOVIES' })
    } catch (error) {
        console.log('Error in addNewMovie generator', error)
    }
}

function* modifyMovie(action) {
    //modify an existing movie
    console.log('In modifymovie generator', action)
    try {
        yield axios.put(`/api/movie/${action.payload.id}`, action.payload)
        yield put({ type: 'FETCH_MOVIES' })
    } catch (error) {
        console.log('Error in modifyMovie generator', error)
    }
}

// Create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();

// Create one store that all components can use
const storeInstance = createStore(
    combineReducers({
        movies,
        genres,
        selectedMovie
    }),
    // Add sagaMiddleware to our store
    applyMiddleware(sagaMiddleware, logger),
);

// Pass rootSaga into our sagaMiddleware
sagaMiddleware.run(rootSaga);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={storeInstance}>
            <App />
        </Provider>
    </React.StrictMode>
);
