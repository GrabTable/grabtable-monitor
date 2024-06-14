import { check } from "k6";
import http from "k6/http";

export const options = {
  vus: 100,
  duration: "10s",
};

// 가게 리뷰 조회
export default function () {
  let res = http.get("https://api.grabtable.net/v1/reviews/stores/1");
  check(res, {
    "is status 200": (r) => r.status === 200,
  });
}
