import model from '../api/model';
import { createNew } from 'trutils';

const userModel = createNew( model );
userModel.url = 'user/';
export default userModel;