import { apiInstance } from "./index.js";
const api = apiInstance();
async function addZip(data, success, fail) {
  console.log("zip write", data);
  await api.post(`/zip/write`, JSON.stringify(data)).then(success).catch(fail);
}
async function addZipBlock(data, success, fail) {
  console.log("zip blockWrite", data);
  await api
    .post(`/zip/blockwrite`, JSON.stringify(data))
    .then(success)
    .catch(fail);
}

async function getAllList(success, fail) {
  console.log("get all list");
  return await api.get("/zip/alllist").then(success).catch(fail);
}

async function getDetailZip(zid, success, fail) {
  console.log("get zip ", zid);
  const params = {
    zid,
  };
  return await api.get("/zip/detail", params).then(success).catch(fail);
}
export { addZip, addZipBlock, getAllList };
