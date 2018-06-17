import './index.css';

import user from './models/user';

// Populate table of users via API call.
user.get().then( result => {
  let userBody = '';
  result.forEach( user => {
    userBody += `<tr>
      <td><a href="#" data-id="${user.id}" class="deleteUser">Delete</a></td>
      <td>${user.id}</td>
      <td>${user.firstName}</td>
      <td>${user.lastName}</td>
      <td>${user.email}</td>
      </tr>`;
  });

  global.document.getElementById( 'user' ).innerHTML = userBody;

  const deleteLinks = global.document.getElementsByClassName( 'deleteUser' );

  // Must use array.from to create a real array from a DOM collection
  // getElementsByClassname only returns an "array like" object
  Array.from( deleteLinks, link => {
    link.onclick = function( event ) {
      const element = event.target;
      event.preventDefault();
      user.delete( element.attributes['data-id'].value );
      const row = element.parentNode.parentNode;
      row.parentNode.removeChild( row );
    };
  });
});
