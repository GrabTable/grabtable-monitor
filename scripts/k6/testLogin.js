import { check } from "k6";
import http from "k6/http";

export const options = {
	vus: 1,
	duration: "1s",
};

// 가게 리스트 조회
export default function () {
	let id = Math.floor(Math.random() * 1000).toString();
	let res = http.get(
		`http://host.docker.internal:8000/v1/auth/login/test/${id}`
	);
	check(res, {
		"is status 200": (r) => r.status === 200,
	});
}
