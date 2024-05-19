import { check } from "k6";
import http from "k6/http";

const BASE_URL = "http://host.docker.internal:8000/v1";
export const options = {
	vus: 1,
	duration: "1s",
};

// 사용자가 로그인을 한다.
const loginApi = function () {
	let id = Math.floor(Math.random() * 1000);
	let res = http.get(BASE_URL + `auth/login/test/${id}`);
	check(res, {
		"is status 200": (r) => r.status === 200,
	});

	let body = JSON.parse(res.body);
	let accessToken = body.accessToken;
	let refreshToken = body.refreshToken;

	return { accessToken, refreshToken };
};

const createReservation = function (accessToken, refreshToken, storeId) {
	let res = http.post(
		BASE_URL + "/reservations",
		{
			storeId: storeId,
		},
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			cookies: { "refresh-token": refreshToken },
		}
	);

	check(res, {
		"is status 201": (r) => r.status === 201,
	});
};

const fetchReservation = function (accessToken, refreshToken) {
	let res = http.get(BASE_URL + "/reservations/me", {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		cookies: { "refresh-token": refreshToken },
	});

	check(res, {
		"is status 200": (r) => r.status === 200,
	});
};

export default function () {
	let { accessToken, refreshToken } = loginApi();
	createReservation(accessToken, refreshToken, storeId);
	fetchReservation(accessToken, refreshToken);
}
