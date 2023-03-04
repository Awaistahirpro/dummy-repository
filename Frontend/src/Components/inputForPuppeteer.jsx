import React, { useState } from 'react';
import './inputForPuppeteer.css';
import axios from 'axios';

const InputForPuppeteer = () => {
    const [ userInput, setuserInput ] = useState( '' );
    const [ dataState, setdataState ] = useState( [] );

    const handleData = async () => {
        console.log( userInput );
        const dataObj = {
            searchTerm: userInput
        };
        const res = await axios.post( '/get-keyword', dataObj );
        console.log( res.data );
        let dummyArray = [];
        for ( let i = 0; i < res.data.details.length; i++ ) {
            let dataObj = {
                titleData: res.data.title[ i ],
                urlData: res.data.urldata[ i ],
                descData: res.data.details[ i ],
            };
            dummyArray.push( dataObj );
            setdataState( [ ...dummyArray ] );
        }
        console.log( dummyArray );
    };
    return (
        <>
            <div className='main-parent'>
                <h1>Get data from copyright.gov</h1>
                <div className='second-container'>
                    <input onChange={ ( e ) => setuserInput( e.target.value ) } placeholder='Type keyword...' type='text' />
                    <button disabled={ ( userInput !== '' ) ? false : true } onClick={ handleData } className='search-btn'>Search</button>
                </div>


                <div className='results-container'>
                    { dataState.map( ( elem ) => {
                        return <div className='content-container'>
                            <span className='title-content'>{ elem.titleData }</span>
                            <span className='url-content'>{ elem.urlData }</span>
                            <span className='desc-content'>{ elem.descData }</span>
                            <hr />
                        </div>;
                    } ) }
                </div>
            </div>

        </>
    );
};

export default InputForPuppeteer;
