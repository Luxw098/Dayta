import DeviceUtils from "./DeviceUtils";
import EncryptionUtils from "./EncryptionUtils";

const subtle = window.crypto.subtle;

class NetworkUtils {
	private static server_key: CryptoKey;
	
	private static setup_ran = false;
	public static async setup() {
		if (NetworkUtils.setup_ran) return;
		return await this.__setup();
	};
	private static async __setup() {
		if (this.server_key) return this.server_key;

		const response = await fetch(this.getBaseURL() + "/getKey", {
			method: "GET",
			headers: await this.getHeaders()
		});
		if (response.status == 401) return;
		const result = await response.json();

		this.server_key = await subtle.importKey(
			"spki",
			Uint8Array.from(atob(result.key), (c) => c.charCodeAt(0)).buffer,
			{
				name: "RSA-OAEP",
				hash: { name: "SHA-256" }
			},
			false,
			["encrypt"]
		);
	};

	private static async chunkJWT(jwt: string) {
		const chunks = [];
		const chunk_size = Math.ceil(jwt.length / 4);
		const count = jwt.length / chunk_size;
		for (let i = 0; i < count; i++) {
			chunks[i] = jwt.substring((chunk_size * i), (chunk_size * (i + 1)))
		};
		return chunks;
	}
	private static async formJWT(res: any) {
		const body = res.body;
		const new_jwt = body["jwt0"] + body["jwt1"] + body["jwt2"] + body["jwt3"];
		return new_jwt;
	};
	static async SendJWTRes(key: CryptoKey) {
		const jwt = DeviceUtils.cookies.get("jwt") as string;
		const jwt_chunks = await this.chunkJWT(jwt);
		return {
			jwt0: jwt_chunks[0],
			jwt1: jwt_chunks[1],
			jwt2: jwt_chunks[2],
			jwt3: jwt_chunks[3],
		};
	};

	static getWebSocketURL = () => {
		return "https://localhost:3001";
	};

	static getBaseURL = () => {
		return "https://localhost:3000/api";
	};

	static getHeaders = async () => {
		const Authorization = DeviceUtils.cookies.get("jwt") as string;
		return {
			"Content-Type": "application/json",
			"Accept": "application/json",
			...((Authorization) ? {
				"Authorization": `Bearer ${Authorization}`
			} : {})
		};
	};

	static getServerKey = async() => {
		if (this.server_key) return this.server_key;
		return new Promise<CryptoKey>(res => {
			const temp = setInterval(() => {
				if (this.server_key) {
					clearInterval(temp)
					res(this.server_key);
				};
			}, 100);
		});
	};
	

	static fetchAPI = async(path: string, options: RequestInit): Promise<[boolean, any]> => {
		const response = await fetch(this.getBaseURL() + path, {
			headers: await this.getHeaders(),
			...options
		});
		const json = await response.json()
		if (json.code != 200) return [false, json];
		return [true, json];
	};

	static validateJwt = async () => {
		const user = DeviceUtils.local_data.get("user");
		const key = await this.getServerKey();
		if (!user || !key) return false;

		const response = await this.fetchAPI("/auth/updatesession", {
			method: "POST",
			body: JSON.stringify({
				user: await EncryptionUtils.encryptData(key, user),
				...(await this.SendJWTRes(key))
			})
		});
		if (response[0] == false || response[1].code != 200) return false;
		DeviceUtils.cookies.set("jwt", await this.formJWT(response[1]));
		return true;
	};

	static accountUpsert = async (email: string, user: string, pass: string): Promise<[boolean, any]> => {
		const key = await this.getServerKey();
		if (!key) return [false, "Server key not initialized (Report this to the developer)"];

		let login = false;
		const exists_res = await this.fetchAPI("/auth/userexists?user="+user, {
			method: "GET"
		});
		if (exists_res[0]) login = true;

		const response = await this.fetchAPI((login) ? "/auth/login":"/auth/register", {
			method: "POST",
			body: JSON.stringify({
				email: await EncryptionUtils.encryptData(key, await subtle.digest("sha-256", new TextEncoder().encode(email))),
				user: await EncryptionUtils.encryptData(key, user),
				pass: await EncryptionUtils.encryptData(key, pass)
			})
		});
		if (response[0] == false || response[1].code != 200) return [false, "Error code: " + response[1].code];
		DeviceUtils.cookies.set("jwt", await this.formJWT(response[1]));
		DeviceUtils.local_data.set("user", user);
		return [true, null];
	}
};
NetworkUtils.setup();
export default NetworkUtils;
