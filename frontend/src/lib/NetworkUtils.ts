const subtle = window.crypto.subtle;

class NetworkUtils {
	private static key: CryptoKey;

	static getWebSocketURL = () => {
		return "https://localhost:3001";
	};

	static getBaseURL = () => {
		return "https://localhost:3000/api";
	};

	static getHeaders = async (Authorization?: string) => {
		return {
			"Content-Type": "application/json",
			"Accept": "application/json",
			...((Authorization) ? {
				"Authorization": `Bearer ${Authorization}`
			} : {})
		};
	};

	static getServerKey = async () => {
		if (this.key) return this.key;

		const response = await fetch(this.getBaseURL() + "/getKey", {
			method: "GET",
			headers: await this.getHeaders(),
		});
		if (response.status == 401) return;
		const result = await response.json();

		this.key = await subtle.importKey(
			"spki",
			Uint8Array.from(atob(result.key), (c) => c.charCodeAt(0)).buffer,
			{
				name: "RSA-OAEP",
				hash: { name: "SHA-512" }
			},
			false,
			["encrypt"]
		);
		return this.key;
	}
};

export default NetworkUtils;
