
import { EXCHANGE_KEYS } from "../app.service"
import * as crypto from "crypto";

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
        return bytes;
    };

    public static encryptData = (data: any) => {
        const encoded_data = new TextEncoder().encode(data);

        const encryption_settings = {
            key: EXCHANGE_KEYS.publicKey,
            oaepHash: "sha256"
        };
        const encrypted_data = crypto.publicEncrypt(
            encryption_settings,
            encoded_data
        );

        return this.arrayBufferToBase64(encrypted_data);
    };

    public static decryptData = (data: string) => {
        const decoded_data = this.base64ToArrayBuffer(data);

        const decryption_settings = {
            key: EXCHANGE_KEYS.privateKey,
            oaepHash: "sha256"
        };
        const decrypted_data = crypto.privateDecrypt(
            decryption_settings,
            decoded_data
        );
        return new TextDecoder().decode(decrypted_data);
    };
}
export default EncryptionUtils;