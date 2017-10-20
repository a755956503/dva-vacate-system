import crypto from 'crypto';
import { routerRedux } from 'dva/router';
import request from '../services/request';
import urls from '../utils/urls';

export default {
  namespace: 'auth',
  state: {
    isLogin: false,
    info: null,
    userInfo: {
      id: null,
      name: null,
      email: null,
      leave_left: {
        compensatory: null,
        annual: null,
      },
    },
  },
  reducers: {
    applySuccess: function (state, { payload }) {
      const { leave_left } = payload;
      return {
        ...state,
        userInfo: Object.assign(state.userInfo, { leave_left }),
      };
    },
    loginSuccess: function (state, { payload }) {
      const userInfo = payload;
      return {
        ...state,
        userInfo,
        isLogin: true,
      };
    },
    logout: function (state) {
      return {
        ...state,
        isLogin: false,
        info: null,
        userInfo: {
          id: null,
          name: null,
          email: null,
          leave_left: {
            compensatory: null,
            annual: null,
          },
        },
      };
    },
    loginFailed: function (state, { payload }) {
      const userInfo = payload;
      return {
        ...state,
        info: payload.info,
      };
    },
    clearMessage: function (state, { payload }) {
      return {
        ...state,
        info: null,
      };
    },
  },
  effects: {
    loginRequest: function *({ payload }, { put, call }) {
      const { user, pwd } = payload;
      const cipher = crypto.createCipher('aes192', '123456');
      cipher.update(pwd, 'utf8');
      const passwd = cipher.final('hex');
      const res = yield call(request.post, urls.login, { email: user, passwd });
      if (Number(res.status) === 1) {
        const { id, leave_left, name } = res;
        yield put({
          type: 'loginSuccess',
          payload: {
            id,
            leave_left,
            name,
          },
        });
        yield put(routerRedux.push('/'));
      } else if (Number(res.status) === 0) {
        yield put({
          type: 'loginFailed',
          payload: {
            info: res.info,
          },
        });
      }
    },
  },
  subscriptions: {},
};
