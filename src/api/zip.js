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
export { addZip, addZipBlock };
