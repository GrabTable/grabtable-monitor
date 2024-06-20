import { check } from "k6";
import http from "k6/http";

export const options = {
  vus: 100,
  duration: "10s",
};

// 가게 리스트 조회
export default function () {
  let res = http.get("https://api.grabtable.netv1/stores");
  check(res, {
    "is status 200": (r) => r.status === 200,
  });
}
