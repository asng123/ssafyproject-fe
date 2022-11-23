import axios from "axios";

// local vue api axios instance
function apiInstance() {
  const instance = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  return instance;
}

// house deal API axios instance
function houseInstance() {
  const instance = axios.create({
    baseURL: process.env.VUE_APP_HOUSE_DEAL_URL,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  return instance;
}
// map info
function mapInstance() {
  const instance = axios.create({
    baseURL: process.env.VUE_APP_MAP_INFO_URL,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  return instance;
}

function kakaoInstance() {
  const instance = axios.create({
    baseURL: "https://dapi.kakao.com/v2/search",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: "KakaoAK 8ab0b8e030c6ca81a54254404ad89b94",
    },
  });
  return instance;
}
export { apiInstance, houseInstance, mapInstance, kakaoInstance };
