import request from '../services/request';
import urls from '../utils/urls';

export default {
  namespace: 'apply',
  state: {
    modelInfo: null,
    leave_left: {
      compensatory: null,
      annual: null,
    },
    requestsList: [],
    approvalsList: [],
  },
  reducers: {
    updateInfo: function (state, { payload }) {
      const { info } = payload;
      return {
        ...state,
        modelInfo: payload.modelInfo,
      };
    },
    // 获取申请列表，取消申请成功都是这个，都是更新对应的list。
    getRequestsSuccess: function (state, { payload }) {
      const { requestsList } = payload;
      return {
        ...state,
        requestsList,
      };
    },
    // 和getRequestsSuccess类似，也有两个effect对应。
    getApprovalsSuccess: function (state, { payload }) {
      const { approvalsList } = payload;
      return {
        ...state,
        approvalsList,
      };
    },
    clearMessage: function (state) {
      return {
        ...state,
        modelInfo: null,
      };
    },
  },
  effects: {
    applyRequest: function *({ payload }, { put, call }) {
      const { userInfo } = payload;
      const from = (new Date(userInfo.from)).getTime();
      const to = (new Date(userInfo.to)).getTime();
      const res = yield call(request.post, urls.apply, Object.assign({}, userInfo, { from, to }));
      if (Number(res.status) === 1) {
        const { leave_left } = res;
        yield put({
          type: '/auth/applySuccess',
          payload: {
            leave_left,
          },
        });
        yield put({
          type: 'updateInfo',
          payload: {
            modelInfo: '申请成功',
          },
        });
        yield put({
          type: 'getRequests',
          payload: { id: userInfo.id },
        });
      } else if (Number(res.status) === 0) {
        yield put({
          type: 'updateInfo',
          payload: {
            modelInfo: res.info,
          },
        });
      }
    },
    applyCancel: function *({ payload }, { put, call }) {
      const { requestId, kind, id } = payload;
      const res = yield call(request.post, urls.applyCancel, { request_id: requestId, kind, id });
      if (Number(res.status) === 1) {
        yield put({
          type: 'updateInfo',
          payload: {
            modelInfo: '取消成功!',
          },
        });
        yield put({
          type: 'getRequests',
          payload: { id },
        });
      } else if (Number(res.status) === 0) {
        yield put({
          type: 'updateInfo',
          payload: {
            modelInfo: res.info,
          },
        });
      }
    },
    getRequests: function *({ payload }, { put, call }) {
      const { id } = payload;
      const res = yield call(request.post, urls.applyList, { id });
      if (Number(res.status) === 1) {
        const { list } = res;
        yield put({
          type: 'getRequestsSuccess',
          payload: {
            requestsList: list,
          },
        });
      } else if (Number(res.status) === 0) {
        yield put({
          type: 'updateInfo',
          payload: {
            modelInfo: res.info,
          },
        });
      }
    },
    getApprovals: function *({ payload }, { put, call }) {
      const { id } = payload;
      const res = yield call(request.post, urls.approvalList, { id });
      if (Number(res.status) === 1) {
        const { list } = res;
        yield put({
          type: 'getApprovalsSuccess',
          payload: {
            approvalsList: list,
          },
        });
      } else if (Number(res.status) === 0) {
        yield put({
          type: 'updateInfo',
          payload: {
            modelInfo: res.info,
          },
        });
      }
    },
    updateApproval: function *({ payload }, { put, call }) {
      const { approvalData } = payload;
      const res = yield call(request.post, urls.approval, approvalData );
      if (Number(res.status) === 1) {
        yield put({
          type: 'updateInfo',
          payload: {
            modelInfo: '操作成功!',
          },
        });
        yield put({
          type: 'getApprovals',
          payload: { id: approvalData.id },
        });
      } else if (Number(res.status) === 0) {
        yield put({
          type: 'updateInfo',
          payload: {
            modelInfo: res.info,
          },
        });
      }
    },
  },
  subscriptions: {},
};
