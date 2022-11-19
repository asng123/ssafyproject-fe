import { mapInstance, houseInstance } from "./index.js";

const map = mapInstance();
const house = houseInstance();

async function getMapInfo(regcode, success, fail) {
  return await map.get(`/?regcode_pattern=${regcode}&is_ignore_zero=true`);
}

async function getHouseInfo(regCode, dealYMD, success, fail) {
  // 주택 상세 거래 정보
  return await house.get(
    `?LAWD_CD=${regCode}&DEAL_YMD=${dealYMD}&serviceKey=${process.env.VUE_APP_APT_DEAL_API_KEY}`
  );
}
export { getMapInfo, getHouseInfo };
