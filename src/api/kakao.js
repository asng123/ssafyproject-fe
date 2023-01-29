import { kakaoInstance } from "@/api/index";
const kakao = kakaoInstance();

async function getImages(keyword, success, fail) {
  console.log("getImages ", keyword);
  return await kakao.get(`image?query=${keyword}`).then(success).catch(fail);
}

// await getImages("한강메트로자이").then((data) => {
//     console.log(data);
//   });
export { getImages };
