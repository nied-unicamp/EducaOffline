import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import { UserSM } from 'src/app/models/user.model';
import { LoginSelectors } from '../login/login.selector';
import { LoginState } from '../login/login.state';
import { UserSelectors } from './user.selector';

const selectProfilePicture = createSelector(
  UserSelectors.entities,
  LoginSelectors.state,
  (users: Dictionary<UserSM>, login: LoginState, props: { userId: number }) => {
    if (!users[props?.userId]?.picture) {
      return null;
    }

    return `${login.apiUrl}users/${props.userId}/picture?access_token=${login.token.value}`
  }
)

const selectMyPicture = createSelector(
  UserSelectors.current,
  LoginSelectors.state,
  (user: UserSM, login: LoginState) => {
    if (!user?.picture) {
      return null;
    }

    return `${login.apiUrl}users/${user.id}/picture?access_token=${login.token.value}`
  }
)

export const UserAdvancedSelectors = {
  pictureLink: {
    me: selectMyPicture,
    userId: selectProfilePicture
  }
};
