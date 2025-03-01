import axios from 'axios';
import hrApi from 'store/redux-saga/api/intercepter';

// 근무기준시간 조회
export const getBaseWorkTimeList = () =>
  axios.get('http://localhost:9101/hr/foudinfomgmt/basetime', {
    params: {
      token: localStorage.getItem('access')
    }
  });

// 근무기준시간 수정
export const batchBaseWorkTime = (action: any) =>
  axios.put(
    'http://localhost:9101/hr/foudinfomgmt/react-basetime',
    { sendData: action.payload },
    {
      params: {
        token: localStorage.getItem('access')
      }
    }
  );

// 근무기준시간 삭제
export const deleteBaseWorkTime = (action: any) =>
  axios.post(
    'http://localhost:9101/hr/foudinfomgmt/react-deleteBasetime',
    { sendData: action.payload },
    {
      params: {
        token: localStorage.getItem('access')
      }
    }
  );

// 휴일정보 조회
export const getHoliday = async () => {
  const url = 'http://localhost:9101/hr/foudinfomgmt/holiday';
  const response = await axios.get(url, {
    params: {
      token: localStorage.getItem('access')
    }
  });

  return response.data;
};

// 휴일정보 등록 수정 삭제
export const postHoliday = async (sendData: any) => {
  console.log('뒷단 보내기', sendData);

  const url = 'http://localhost:9101/hr/foudinfomgmt/holiday';
  const response = await axios.post(url, sendData, {
    params: {
      token: localStorage.getItem('access')
    }
  });

  console.log('포스트', response);
  console.log('포스트2', response.data);

  return response.data;
};

// 부서정보 조회
export const deptListManage = async () => {
  try {
    return await hrApi.get('foudinfomgmt/deptlist', {
      params: {
        token: localStorage.getItem('access')
      }
    });
  } catch (error: any) {
    console.log(error);
  }
};

export const deptListUpdate = (action: any) => {
  console.log('action');
  console.log(action);
  axios.post('/base/deptList.do', { sendData: action.payload }, { headers: { 'Content-Type': 'application/json' } });
};

export const deptMember = (action: any) => {
  console.log('deptMember:action');
  console.log(action);
  return axios.get('/affair/memberList', {
    params: {
      value: action.params.deptCode
    }
  });
};

// 직급정보 조회
export const getPosition = async () => {
  console.log('오잉');
  let url = 'http://localhost:9101/hr/foudinfomgmt/positionlist';
  const response = await axios.get(url, {
    params: {
      token: localStorage.getItem('access')
    }
  });

  return response.data;
};

// 직급정보 삭제
export const deletePosition = async (updatedSelRow1: any) => {
  console.log('뭐가나오나332', updatedSelRow1);
  const sendData = [updatedSelRow1];

  let url = 'http://localhost:9101/hr/foudinfomgmt/positionlist';
  const response = await axios.put(url, sendData, {
    params: {
      token: localStorage.getItem('access')
    }
  });

  return response.data;
};

// 자격증이름정보 조회
export const getCertificationsName = async () => {
  console.log('오잉');
  let url = 'http://localhost:9101/hr/foudinfomgmt/certificationsnamelist';
  const response = await axios.get(url, {
    params: {
      token: localStorage.getItem('access')
    }
  });

  return response.data;
};

// 어학능력정보 조회
export const getLanguageSkills = async () => {
  console.log('오잉');
  let url = 'http://localhost:9101/hr/foudinfomgmt/languageskillslist';
  const response = await axios.get(url, {
    params: {
      token: localStorage.getItem('access')
    }
  });

  return response.data;
};
