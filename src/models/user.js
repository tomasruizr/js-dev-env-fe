import model from '../api/model';
import { createNew } from 'trutils';

const user = createNew( model );
user.url = 'user/';
export default user;