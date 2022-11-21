import { apiInstance } from "./index.js";

const api = apiInstance();

function listQuestion(param, success, fail) {
  api.get(`/question`, { params: param }).then(success).catch(fail);
}

function writeQuestion(question, success, fail) {
  api.post(`/question`, JSON.stringify(question)).then(success).catch(fail);
}

function questionDetail(qid, success, fail) {
  api.get(`/question/${qid}`).then(success).catch(fail);
}

function updateQnA(question, success, fail) {
  api.put(`/question/updateqna`, JSON.stringify(question)).then(success).catch(fail);
}

function deleteQuestion(qid, success, fail) {
  api.delete(`/question/${qid}`).then(success).catch(fail);
}

function writeAnswer(question, success, fail) {
  api.put(`/question/answer`, JSON.stringify(question)).then(success).catch(fail);
}
export { listQuestion, writeQuestion, questionDetail, updateQnA, deleteQuestion, writeAnswer};
