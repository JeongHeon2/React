import { dailyAttendAction } from 'store/redux-saga/reducer/attendance/DailyAttendReducer';
import { takeEvery, all, call, put } from 'redux-saga/effects';
import * as api from 'store/redux-saga/api/attendance';
import {deptListManage} from 'store/api/base';
import { typeAction } from 'types/attendance/types';
import { AxiosResponse } from 'axios';

//type dailyAttendRequest = { dayAttdlist: []; errorMsg: ''; errorCode: 0; empList: [] };

// generator 함수는 yield 안하면은 해당 라인의 코드 실행 안함
// console.log()는 예외인거 같다.

export function* dailyAttendInsertSaga(action: typeAction) {
  yield console.log('This is Saga!! dailyAttendInsertSaga called!!! ', action.payload);
  const { payload } = action;
  const response: AxiosResponse = yield call(api.registerDailyAttend, payload);
  console.log('일근태 등록 상태: ', response.data.errorMsg);
}

export function* dailyAttendSearchSaga(action: any) {
  yield console.log('This is Saga!! dailyAttendSearchSaga called!!! ', action.payload);
  const { payload } = action;
  const response: AxiosResponse = yield call(api.searchDailyAttend, payload);
  console.log('data from dailyAttendSearchSaga:', response);
  yield put(dailyAttendAction.DAILY_ATTEND_SEARCH_FETCH_STATUS(response.data.list));
}

export function* dailyAttendModifySaga(action: typeAction) {
  yield console.log('This is Saga!! dailyAttendModifySaga called!!! ', action.payload);
  const { payload } = action;
  const response: AxiosResponse = yield call(api.modifyDailyAttend, payload);
  console.log('일근태 수정 상태: ', response.data.errorMsg);
}

export function* dailyAttendSearchEmplistSaga(action: typeAction) {
  yield console.log('This is Saga!! dailyAttendSearchEmplistSaga called!!! ', action.payload);
  const { payload } = action;
  const response: AxiosResponse = yield call(api.fetchEmpList, payload);
  console.log('data from dailyAttendSearchEmplistSaga:', response);
  yield put(dailyAttendAction.DAILY_ATTEND_SEARCH_EMPLIST_FETCH_STATUS(response.data.list));
}

export function* dailyAttendFinalizeSaga(action: typeAction) {
  yield console.log('This is Saga!! dailyAttendSearchEmplistSaga called!!! ', action.payload);
  const { payload } = action;
  const response: AxiosResponse = yield call(api.finalizeDailyAttend, payload);
  console.log('일근태 마감 상태: ', response.data.errorMsg);
  yield put(dailyAttendAction.CLEAR_ATTD_LIST());
}

export function* searchDeptListSaga(action: typeAction) {
  yield console.log('This is Saga!! searchDeptListSaga called!!! ');
  const response: AxiosResponse = yield call(deptListManage);
  console.log('data from searchDeptListSaga: ', response);
  yield put(dailyAttendAction.DEPT_LIST_SEARCH_FETCH_STATUS(response.data.list));
}



// action과 api 요청을 보내주는 함수를 호출하는 saga를 연결해주는 saga
// empEvalResultAction.DAILY_ATTEND_RESULT_FETCH_REQUESTED는 액션생성함수를 호출하여 액션을 생성함.
export function* onDailyAttendSaga() {
  yield takeEvery(dailyAttendAction.DAILY_ATTEND_INSERT_FETCH_REQUESTED, dailyAttendInsertSaga);
  yield takeEvery(dailyAttendAction.DAILY_ATTEND_SEARCH_FETCH_REQUESTED, dailyAttendSearchSaga);
  yield takeEvery(dailyAttendAction.DAILY_ATTEND_MODIFY_FETCH_REQUESTED, dailyAttendModifySaga);
  yield takeEvery(dailyAttendAction.DAILY_ATTEND_SEARCH_EMPLIST_FETCH_REQUESTED, dailyAttendSearchEmplistSaga);
  yield takeEvery(dailyAttendAction.DAILY_ATTEND_FINALIZE_FETCH_REQUESTED, dailyAttendFinalizeSaga);
  yield takeEvery(dailyAttendAction.DEPT_LIST_SEARCH_FETCH_REQUESTED, searchDeptListSaga);

}

export default function* dailyAttendSaga() {
  yield all([call(onDailyAttendSaga)]);
}
