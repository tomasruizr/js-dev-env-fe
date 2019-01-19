import model from '../api/model';
import { createNew } from '@tomasruizr/trutils';

const userModel = createNew( model );
userModel.url = 'user/';
export default userModel;