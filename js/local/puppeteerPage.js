// Copyright 2018, University of Colorado Boulder

'use strict';

module.exports = function( browser, targetURL, timeout ) {

  return new Promise( async function( resolve, reject ) {
    let id = null;

    const page = await browser.newPage();
    let ended = false;
    const end = async function( result ) {
      if ( !ended ) {
        ended = true;
        await page.close();
        clearTimeout( id );
        resolve( result );
      }
    };
    // page.on( 'console', msg => console.log( 'PAGE LOG:', msg.text() ) );
    page.on( 'error', msg => end( { ok: false, result: 'error', message: msg } ) );
    page.on( 'pageerror', msg => end( { ok: false, result: 'pageerror', message: msg } ) );

    try {
      await page.goto( targetURL );
      id = setTimeout( async function() {
        end( { ok: true } );
      }, timeout );
    }
    catch( e ) {
      end( { ok: false, message: 'caught exception ' + e } );
    }
  } );
};