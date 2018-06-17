import env from '../../config/env';
export default function getBaseUrl( url = '' ) {
  return getQueryStringParameterByName( 'useStaticData', url ) === 'true' ? env.staticData : env.api;
}

//TODO: Update this function to use a library front end.
/*
for example in vue
this.$route.query.test
*/
function getQueryStringParameterByName( name, url = '' ) {
  // For testing purposes
  if ( !url ) url = window.location.href;
  // eslint-disable-next-line no-useless-escape
  name = name.replace( /[\[\]]/g, '\\$&' );
  var regex = new RegExp( `[?&]${ name }(=([^&#]*)|&|#|$)` ),
    results = regex.exec( url );
  if ( !results ) return null;
  if ( !results[2]) return '';
  return decodeURIComponent( results[2].replace( /\+/g, ' ' ));
}
  