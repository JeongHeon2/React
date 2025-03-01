import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Stack,
  TableContainer,
  Table,
  Checkbox,
  TextField,
  Button,
  TableBody,
  TableCell,
  TableHead,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TableRow
} from '@mui/material';
import Layout from 'layout';
import produce from 'immer';
import Page from 'components/ui-component/Page';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import DailyAttendModifyModal from './DailyAttendModifyModal';
import FinalizeModal from './FinalizeModal';
import { dailyAttdEntity } from 'pages/hr/attendance/types/types';
import { dailyAttendAction } from 'store/redux-saga/reducer/attendance/DailyAttendReducer';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { RootState } from 'store';
import Swal from 'sweetalert2';

function DailyAttendManage() {
  const [handleOk, setHandleOk] = useState<boolean>(false);
  const [modifyModal, setModifyModal] = useState<boolean>(false);
  const [finalizeModal, setFinalizeModal] = useState<boolean>(false);
  const [selectedEmp, setSelectedEmp] = useState<dailyAttdEntity[]>([]);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [authCheck, setAuthCheck] = useState(false); // 페이지 접근 권한체크
  const selectRef = useRef<HTMLSelectElement>(null);

  const dispatch = useDispatch();

  //dayAttdlist가 undefined아니라면 dayAttdlist를 보여줄것이고 undefined인 경우 빈 배열을 반환한다.
  const dayAttdlist = useSelector((state: RootState) => (state.dailyAttend.dayAttdlist !== undefined ? state.dailyAttend.dayAttdlist : []));
  //위와 마찬가지 deptlist가 빈값이 아닐경우 deptList반환함
  const deptList = useSelector((state: any) => (state.dailyAttend.deptlist !== undefined ? state.dailyAttend.deptlist : []));

  // 부서코드
  const [deptCode, setDeptCode] = useState('');
  // 시작일
  const [startDate, setStartDate] = useState('');
  // 종료일
  const [endDate, setEndDate] = useState('');

  //setModifyModal의 값이 false일 경우 true로 변경해주는 이벤트
  const onToggleModifyHandler = () => {
    setModifyModal((data) => !data);
  };
  //setFinalizeModal의 값이 false일 경우 true로 변경해주는 이벤트
  const onToggleFinalizeHandler = () => {
    setFinalizeModal((data) => !data);
  };

  //identifier가 mod일 경우 수정버튼을 실행하고 setModifyModal 창이 true가 됨.
  //선택된 사원의 수가 1명 초과할경우 selectedEmp.length > 1 부분에서 swal.fire가 발생
  //identifier가 finalize경우 마감버튼을 싱행 setFinalizeModal 창을 띄워줌
  // DAILY_ATTEND_FINALIZE_FETCH_REQUESTED 액션생성함수를 통해서 FINALIZE_STATUS의 상태를 'Y'로 바꿈
  const onClickHandler = (identifier: string) => {
    if (identifier === 'mod') {
      if (selectedEmp.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: '사원을 선택해 주세요.'
        });
        return;
      } else if (selectedEmp.length > 1) {
        Swal.fire({
          icon: 'warning',
          title: '사원 수정은 한번에 한명씩 가능합니다.'
        });
        return;
      }
      setModifyModal(true);
      return;
    } else if (identifier === 'finalize') {
      setFinalizeModal(true);
      if (handleOk) {
        dispatch(dailyAttendAction.DAILY_ATTEND_FINALIZE_FETCH_REQUESTED(selectedEmp));
      }
    }
  };

  //조회하는 이벤트
  const onSearchClickHandler = () => {
    console.log('시작일: ' + startDate);
    console.log('완료일: ' + endDate);
    const data = {
      deptCode: deptCode,
      startDate: startDate,
      endDate: endDate,
      type: 'under',
      authLevel: localStorage.getItem('authLevel')
    };
    dispatch(dailyAttendAction.DAILY_ATTEND_SEARCH_FETCH_REQUESTED(data));
    setCheckedItems({});
    setSelectedEmp([]);
  };

  //권한체크
  useEffect(() => {
    const level = localStorage.getItem('authLevel') as string;
    if (level && parseInt(level.slice(-1)) >= 3) {
      setAuthCheck(true);
    } else {
      setAuthCheck(false);
      Swal.fire({
        icon: 'error',
        text: `'부/팀장'직급부터 접근이 가능합니다.`
      });
    }
  }, []);

  useEffect(() => {
    console.log('selectedEmp: ', selectedEmp);
  }, [selectedEmp]);

  useEffect(() => {
    console.log('checkedItems: ', checkedItems);
  }, [checkedItems]);

  useEffect(() => {
    console.log('handleOk 상태 바뀜!!');
    console.log('handleOk: ', handleOk);
    if (handleOk) {
      console.log('handleOk가 true로 변경!');
      dispatch(dailyAttendAction.DAILY_ATTEND_FINALIZE_FETCH_REQUESTED(selectedEmp));
    }
  }, [handleOk]);

  //체크박스 이벤트
  const onCheckedChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    console.log('체크가 해제 또는 선택됨.');
    console.log('체크 상태 :', checked, value);

    if (checked === true) {
      console.log('체크가 선택됨.');
      console.log('체크 상태 :', checked, value);
      setCheckedItems((prevState) => ({
        ...prevState,
        [value]: checked
      }));
      const emp = dayAttdlist.filter((data: any) => data.empName === value); // 조건에 해당하는 데이터의 배열을 반환
      setSelectedEmp((prevSelectedEmp) =>
        produce(prevSelectedEmp, (draft) => {
          draft.push(emp[0]);
        })
      );
    } else if (checked === false) {
      console.log('체크가 해제됨.');
      console.log('체크 상태 :', checked, value);
      setCheckedItems((prevState) => ({
        ...prevState,
        [value]: checked
      }));
      setSelectedEmp((prevSelectedEmp) =>
        produce(prevSelectedEmp, (draft) => {
          draft.splice(
            draft.findIndex((data) => data.empName === value),
            1
          );
        })
      );
    }
  };

  //전체사원 선택 체크 이벤트
  const onCheckAllHandler = () => {
    const updatedCheckedItems: { [key: string]: boolean } = {};
    dayAttdlist.forEach((emp: dailyAttdEntity) => {
      updatedCheckedItems[emp.empName] = true;
    });
    setCheckedItems(updatedCheckedItems);
    // selectedEmp 배열을 초기화하고 dayAttdlist 배열의 모든 요소

    setSelectedEmp([...dayAttdlist]);
  };
  // dispatch이부분을 두개 동시에 하지않는다고했는데 이건 왜 두개인가
  // 내생각엔 일근태 관리 페이지를 랜더링하면서 '부서' list를 불러오고 일근태관리 사원리스트를 clear하는것같음
  //둘중 순서상관없이 호출되면 되기때문
  useEffect(() => {
    console.log('dispatch호출됨');
    dispatch(dailyAttendAction.DEPT_LIST_SEARCH_FETCH_REQUESTED(''));
    dispatch(dailyAttendAction.CLEAR_ATTD_LIST());
  }, []);

  //메뉴아이템에 부서코드를 map을 통해 뽑아냄
  const deptLists = deptList.map((item: any) => {
    return (
      <MenuItem value={item.deptCode} key={item.deptCode}>
        {item.deptName}
      </MenuItem>
    );
  });

  //부서 선택함
  const deptChangeHandler = (value: string) => {
    setDeptCode(value);
    console.log(value);
    dispatch(dailyAttendAction.DAILY_ATTEND_SEARCH_EMPLIST_FETCH_REQUESTED(value));
  };
  return (
    <Page title="일근태 관리">
      {authCheck ? (
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <MainCard
              title="일근태 관리"
              secondary={
                <Stack direction="row" spacing={2} alignItems="center">
                  <Grid container direction="column" alignItems="center" justifyContent="flex-start">
                    <Button variant="contained" color="primary" onClick={onCheckAllHandler}>
                      전체 사원 선택
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ minWidth: 120, marginBottom: 1 }}>
                      <InputLabel>부서</InputLabel>
                      <FormControl fullWidth>
                        <Select
                          defaultValue="-1"
                          ref={selectRef}
                          onChange={(e) => {
                            deptChangeHandler(String(e.target.value));
                          }}
                        >
                          {deptLists}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="근태조회시작일"
                      name="근태조회시작일"
                      type={'date'}
                      onChange={(event) => {
                        setStartDate(event.target.value);
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="근태조회종료일"
                      name="근태조회종료일"
                      type={'date'}
                      onChange={(event) => {
                        setEndDate(event.target.value);
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Button variant="contained" color="primary" onClick={() => onSearchClickHandler()}>
                    조회
                  </Button>

                  {modifyModal && <DailyAttendModifyModal toggle={onToggleModifyHandler} emp={selectedEmp} />}
                  <Button variant="contained" color="primary" onClick={() => onClickHandler('mod')}>
                    수정
                  </Button>

                  {finalizeModal && <FinalizeModal toggle={onToggleFinalizeHandler} setHandleOk={setHandleOk} />}
                  <Button variant="contained" color="primary" onClick={() => onClickHandler('finalize')}>
                    마감
                  </Button>
                </Stack>
              }
            >
              {/* 아래의 코드도 리펙터링을 하자 */}
              {/* table */}
              <TableContainer>
                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                  <TableHead>
                    <TableRow
                      sx={{
                        borderTop: '1px solid black',
                        borderBottom: '3px solid black',
                        marginBottom: '3px',
                        backgroundColor: '#E8D9FF'
                      }}
                    >
                      <TableCell sx={{ pl: 3 }}></TableCell>
                      <TableCell>사원명</TableCell>
                      <TableCell>부서명</TableCell>
                      <TableCell>출근시간</TableCell>
                      <TableCell>퇴근시간</TableCell>
                      <TableCell>근무시간</TableCell>
                      <TableCell>연장근무시간</TableCell>
                      <TableCell>심야근무시간</TableCell>
                      <TableCell>외출시간</TableCell>
                      <TableCell>조퇴시간</TableCell>
                      <TableCell>지각여부</TableCell>
                      <TableCell>마감여부</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dayAttdlist.length !== 0 ? (
                      dayAttdlist.map((emp: dailyAttdEntity) => (
                        <TableRow hover key={emp.empName}>
                          <TableCell sx={{ pl: 3 }} component="th" scope="row">
                            <Checkbox
                              value={emp.empName}
                              checked={checkedItems[emp.empName] || false}
                              color="primary"
                              onChange={(e) => {
                                onCheckedChangeHandler(e);
                              }}
                            />
                          </TableCell>
                          <TableCell>{emp.empName}</TableCell>
                          <TableCell>{emp.deptName}</TableCell>
                          <TableCell>{emp.attendTime}</TableCell>
                          <TableCell>{emp.leaveTime}</TableCell>
                          <TableCell>{emp.workHour}</TableCell>
                          <TableCell>{emp.overWorkHour}</TableCell>
                          <TableCell>{emp.nightWorkHour}</TableCell>
                          <TableCell>{emp.briefLeaveTime}</TableCell>
                          <TableCell>{emp.earlyLeaveTime}</TableCell>
                          <TableCell>{emp.latenessStatus}</TableCell>
                          <TableCell>{emp.finalizeStatus}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableCell colSpan={11} align="center">
                        <p>일근태 정보가 없습니다.</p>
                      </TableCell>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </MainCard>
          </Grid>
        </Grid>
      ) : (
        <MainCard
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <DoDisturbIcon style={{ color: 'red', marginRight: '8px' }} /> {/* 아이콘을 title 옆에 추가합니다. */}
              접근 권한 없음
            </div>
          }
          style={{ textAlign: 'center' }}
        />
      )}
    </Page>
  );
}

DailyAttendManage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default DailyAttendManage;
