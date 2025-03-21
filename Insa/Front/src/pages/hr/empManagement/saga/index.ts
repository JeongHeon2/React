import { all, call } from 'redux-saga/effects';
import { empInfoSaga } from './empInfoSaga';
import { registerEmpSaga } from './registerEmpSaga';
import { empEvalSaga } from './empEvalSaga';
import { empEvalResultSaga } from './empEvalResultSaga';
import { empEvalManagementSaga } from './empEvalManagementSaga';
import { empAppointmentRegistSaga } from './empAppointmentRegistSaga';
import { empAppointmentManagementSaga } from './empAppointmentManagementSaga';
import { empAppointmentResultSaga } from './empAppointmentResultSaga';
import { empCardSaga } from './empCardSaga';

export default function* empManagementRootSaga() {
  yield all([
    call(registerEmpSaga),
    call(empInfoSaga),
    call(empEvalResultSaga),
    call(empEvalSaga),
    call(empEvalManagementSaga),
    call(empAppointmentRegistSaga),
    call(empAppointmentManagementSaga),
    call(empAppointmentResultSaga),
    call(empCardSaga)
  ]);
}
