import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

function AddMovieForm() {

    const dispatch = useDispatch();
    const genres = useSelector(store => store.genres);

    let [movieToAdd, setMovieToAdd] = useState({ title: '', poster: '', description: '', genre_id: '' })

    useEffect(() => {
        dispatch({ type: 'FETCH_MOVIES' });
        dispatch({ type: 'FETCH_GENRES' })
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setMovieToAdd({
            ...movieToAdd,
            [name]: value,
        })
    }

    const addMovie = (movieToAdd) => {
        console.log('Inside of addMovie function. Here is movieToAdd:', movieToAdd)
        if (movieToAdd.title === ''|| movieToAdd.poster === '' || movieToAdd.description === '') {
            alert('You must complete all input fields!')
        }
        else {
            dispatch({
                type: 'ADD_NEW_MOVIE',
                payload: movieToAdd
            })
        }

    }

    return (
        <main>
            <form onSubmit={(event) => addMovie(movieToAdd)}>
                <input
                    onChange={handleInputChange}
                    type='text'
                    placeholder='title'
                    name='title'
                    value={movieToAdd.title}
                />
                <input
                    onChange={handleInputChange}
                    type='text'
                    placeholder='poster'
                    name='poster'
                    value={movieToAdd.poster}
                />
                <input
                    onChange={handleInputChange}
                    type='text'
                    placeholder='description'
                    name='description'
                    value={movieToAdd.description}
                />
                <select
                    id="genres"
                    name="genres_id"
                    onChange={handleInputChange}
                    value={movieToAdd.genre_id}>
                    {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                            {genre.name}
                        </option>
                    ))}
                </select>

                <button type='submit'>Submit</button>
            </form>
        </main>
    );
}

export default AddMovieForm;