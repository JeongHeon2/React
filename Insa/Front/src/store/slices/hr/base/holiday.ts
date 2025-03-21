// third-party
import { createSlice } from '@reduxjs/toolkit';
import { DefaultRootStateProps } from 'types';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['Holiday'] = {
  error: null,
  holidayList: [],
  isLoading: false,
  isDone: false
};

const slice = createSlice({
  name: 'holiday',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    requestHoliday(state) {
      console.log("가나다라");
      state.isLoading = true;
    },

    // GET POSITION
    getHolidaySuccess(state, action) {
      state.isLoading = false;
      state.holidayList = action.payload;
      state.isDone = true;
    },

    getHolidayFailure(state) {
      state.isLoading = false;
      state.error = '휴일정보 조회 실패';
    },
    requestUpdateHoliday(state) {
      state.isLoading = true;
    },
    updateHolidaySuccess(state, action) {
      state.isLoading = false;
      state.holidayList = action.payload;
      state.isDone = true;
      if ((state.isDone = true)) {
        alert('수정완료');
        window.location.reload();
      }
    },
    updateHolidayFailure(state) {
      state.isLoading = false;
      state.error = '휴일정보 수정 실패';
    },
    requestInsertHoliday(state) {
      state.isLoading = true;
    },
    insertHolidaySuccess(state, action) {
      state.isLoading = false;
      state.holidayList = action.payload;
      state.isDone = true;
      if ((state.isDone = true)) {
        alert('등록완료');
        window.location.reload();
      }
    },
    insertHolidayFailure(state) {
      state.isLoading = false;
      state.error = '휴일정보 저장 실패';
    },
    requestDeletetHoliday(state) {
      state.isLoading = true;
    },
    deleteHolidaySuccess(state, action) {
      state.isLoading = false;
      state.holidayList = action.payload;
      state.isDone = true;
      if ((state.isDone = true)) {
        alert('삭제완료');
        window.location.reload();
      }
    },
    deleteHolidayFailure(state) {
      state.isLoading = false;
      state.error = '휴일정보 삭제 실패';
    }
  }
});

// Reducer
export default slice.reducer;
export const {
  requestDeletetHoliday,
  deleteHolidaySuccess,
  deleteHolidayFailure,
  requestInsertHoliday,
  insertHolidaySuccess,
  insertHolidayFailure,
  requestHoliday,
  getHolidaySuccess,
  getHolidayFailure,
  requestUpdateHoliday,
  updateHolidaySuccess,
  updateHolidayFailure
} = slice.actions;
// ----------------------------------------------------------------------

// export async function getHoliday() {
//   let url='http://localhost:9101/foudinfomgmt/holiday';
//   const response=await axios.get(url);

//   return response.data
// }

// export async function postHoliday(sendData: any) {
//     console.log("뒷단 보내기", sendData);

//     const url = 'http://localhost:9101/foudinfomgmt/holiday';
//     const response = await axios.post(url, sendData)

//     console.log("포스트", response);
//     console.log("포스트2", response.data);

//     return response.data;
//   }
