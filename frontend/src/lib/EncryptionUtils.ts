const subtle = window.crypto.subtle;




class EncryptionUtils {

    private static arrayBufferToBase64 = (buffer: ArrayBuffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    private static base64ToArrayBuffer = (base64: string) => {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    };

    public static encryptData = async (key: CryptoKey, data: any) => {
        const encoded_data = new TextEncoder().encode(data);
        const encrypted_data = await subtle.encrypt(
            {
                name: "RSA-OAEP"
            },
            key,
            encoded_data
        );

        return this.arrayBufferToBase64(encrypted_data);
    };

    public static decryptData = async (key: CryptoKey, data: string) => {
        const decoded_data = this.base64ToArrayBuffer(data);
        const decrypted_data = await subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            key,
            decoded_data
        );
        return new TextDecoder().decode(decrypted_data);
    };
}
export default EncryptionUtils;