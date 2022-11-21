import { mapInstance, apiInstance } from "./index.js";

const map = mapInstance();
const api = apiInstance();

async function getMapInfo(regcode, success, fail) {
  return await map.get(`/?regcode_pattern=${regcode}&is_ignore_zero=true`);
}

async function getHouseInfo(regCode, success, fail) {
  // 주택 상세 거래 정보
  // return await house.get(
  //   `?LAWD_CD=${regCode}&DEAL_YMD=${dealYMD}&serviceKey=${process.env.VUE_APP_APT_DEAL_API_KEY}`
  // );
  // const params = {
  //   LAWD_CD: regCode,
  //   DEAL_YMD: dealYMD,
  //   numOfRows: 30,
  //   serviceKey: decodeURIComponent(process.env.VUE_APP_APT_DEAL_API_KEY),
  // };
  const params = {
    dong: regCode,
  };
  return await api
    .get(`/map/apt`, { params: params })
    .then(success)
    .catch(fail);
}
export { getMapInfo, getHouseInfo };
