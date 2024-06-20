/*
[전체 시나리오]
1. 사용자가 로그인을 한다.
2. 사용자가 가게 목록을 조회한다.
3. 사용자가 가게 리뷰를 조회한다.
4. 사용자가 가게 메뉴 목록을 조회한다.
5. 사용자가 예약을 생성한다.
6. 사용자가 가게 메뉴를 담는다.
7. 사용자가 현재 예약 상태를 조회한다.
*/

import { check } from "k6";
import http from "k6/http";

const BASE_URL = "https://api.grabtable.net/v1";
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

const fetchStores = function () {
	let res = http.get(BASE_URL + "/stores");
	check(res, {
		"is status 200": (r) => r.status === 200,
	});
};

const fetchReviews = function (storeId) {
	let res = http.get(BASE_URL + `/reviews/stores/${storeId}`);
	check(res, {
		"is status 200": (r) => r.status === 200,
	});
};

const fetchMenus = function (storeId) {
	let res = http.get(BASE_URL + `/stores/${storeId}/menus`);
	check(res, {
		"is status 200": (r) => r.status === 200,
	});
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

const addCart = function (accessToken, refreshToken, menuId) {
	let res = http.post(
		BASE_URL + "/carts",
		{
			menuId: menuId,
			quantity: 10,
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
	fetchStores();
	let storeId = 1;
	fetchReviews(storeId);
	fetchMenus(storeId);
	createReservation(accessToken, refreshToken, storeId);
	addCart(accessToken, refreshToken, 1);
	fetchReservation(accessToken, refreshToken);
}
