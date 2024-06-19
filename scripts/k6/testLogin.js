import { check } from "k6";
import http from "k6/http";

export const options = {
	stages: [
		{ duration: "10s", target: 100 },
		{ duration: "10s", target: 200 },
		{ duration: "10s", target: 300 },
		{ duration: "10s", target: 400 },
		{ duration: "10s", target: 500 },
		{ duration: "10s", target: 600 },
		{ duration: "10s", target: 700 },
		{ duration: "10s", target: 800 },
		{ duration: "10s", target: 900 },
		{ duration: "10s", target: 1000 },
	],
	tags: { scenario: 'no_redis' }
};

// 로그인 테스트
export default function () {
	let id = Math.floor(Math.random() * 100000000).toString();
	let res = http.get(
		// `https://api.grabtable.net/v1/auth/login/test/${id}`
		`http://10.0.2.104/v1/auth/login/test/${id}`

	);
	check(res, {
		"is status 200": (r) => r.status === 200,
	});
}
