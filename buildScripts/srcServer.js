import express from 'express';
import path from 'path';
import open from 'opn';
import webpack from 'webpack';
import config from '../webpack.config.dev';
import env from '../config/env';

/* eslint-disable no-console */

const port = env.devPort;
const app = express();
const compiler = webpack( config );

app.use( require( 'webpack-dev-middleware' )( compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.get( '/', function( req, res ) {
  res.sendFile( path.join( __dirname, `../${env.srcFolder}/${env.entry}` ));
});


app.listen( port, function( err ) {
  if ( err ) {
    console.log( err );
  } else {
    open( `http://localhost:${ port}` );
  }
});

//*******************************************
// Fixture Data. To load this data instead of JSON Server. add useStaticData=true in the URL
//*******************************************

app.get( '/user', function( req, res ) {
  // Hard coding for simplicity. Pretend this hits a real database
  res.json([
    { id: 1,firstName:'Bob',lastName:'Smith',email:'bob@gmail.com' },
    { id: 2,firstName:'Tammy',lastName:'Norton',email:'tnorton@yahoo.com' },
    { id: 3,firstName:'Tina',lastName:'Lee',email:'lee.tina@hotmail.com' }
  ]);
});
