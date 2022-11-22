import { mapInstance, apiInstance } from "./index.js";

const map = mapInstance();
const api = apiInstance();

async function getMapInfo(regcode, success, fail) {
  return await map.get(`/?regcode_pattern=${regcode}&is_ignore_zero=true`);
}

async function getHouseInfo(regCode, success, fail) {
  const params = {
    dong: regCode,
  };
  return await api
    .get(`/map/apt`, { params: params })
    .then(success)
    .catch(fail);
}

async function getHouseDetailInfo(regCode, aptName, success, fail) {
  const params = {
    dong: regCode,
    aptname: aptName,
  };
  return await api
    .get(`/map/aptinfo`, { params: params })
    .then(success)
    .catch(fail);
}
export { getMapInfo, getHouseInfo, getHouseDetailInfo };
