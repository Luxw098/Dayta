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
			headers: await this.getHeaders(),
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

	static getServerKey = () => {
		return this.server_key;
	};

	static fetchAPI = async(path: string, options: RequestInit): Promise<[boolean, any]> => {
		const response = await fetch(this.getBaseURL() + path, {
			headers: await this.getHeaders(),
			...options
		});
		if (response.status == 401) return [false, response];
		return [true, await response.json()];
	};

	static validateJwt = async (jwt: string) => {
		const user = DeviceUtils.local_data.get("user");
		const key = this.server_key;
		if (!user || !key) return false;
		const response = await this.fetchAPI("/auth/updatesession", {
			method: "POST",
			body: JSON.stringify({
				user: await EncryptionUtils.encryptData(key, user),
				jwt: await EncryptionUtils.encryptData(key, jwt)
			})
		});
		if (response[0] == false || response[1].code != 200) return false;
		const json = await response[1].json();
		console.log(json)
		DeviceUtils.cookies.set("jwt", btoa(json["jwt"]));
		console.log(DeviceUtils.cookies.get())
		return true;
	};
};
NetworkUtils.setup();
export default NetworkUtils;
