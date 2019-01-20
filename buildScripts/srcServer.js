require( 'babel-register' )();
const http = require( 'http' );
const express = require( 'express' );
const path = require( 'path' );
const open = require( 'opn' );
const webpack = require( 'webpack' );
const config = require( '../webpack.config.dev' ).default;
const env = require( '../config' );
const socketServer = require( 'socket.io' );


/* eslint-disable no-console */

const port = env.devPort;
const compiler = webpack( config );
const app = express();
const httpServer = http.createServer( app );
const io = new socketServer( httpServer );

app.use( require( 'webpack-dev-middleware' )( compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.get( '/', function( req, res ) {
  res.sendFile( path.join( __dirname, `../${env.srcFolder}/${env.entry}` ));
});

//*******************************************
// Fixture Data. To load this data instead of JSON Server. add useStaticData=true in the URL
//*******************************************

app.get( '/user', function( req, res ) {
  // Hard coding for simplicity. Pretend this hits a real database
  return res.json([
    { id: 1,firstName:'Tomas',lastName:'Smith',email:'bob@gmail.com' },
    { id: 2,firstName:'Tammy',lastName:'Norton',email:'tnorton@yahoo.com' },
    { id: 3,firstName:'Tina',lastName:'Lee',email:'lee.tina@hotmail.com' }
  ]);
});

//*******************************************
// lift server
//*******************************************

httpServer.listen( port, function( err ) {
  if ( err ) {
    console.log( err );
  } else {
    open( `http://localhost:${ port}` );
  }
});

//*******************************************
// socket
//*******************************************

io.on( 'connection', function() {
  console.log( 'Socket Client connected' );
});
