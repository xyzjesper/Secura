import {invoke} from "@tauri-apps/api/core";
import {
    cancel,
    checkPermissions,
    Format,
    requestPermissions,
    scan,
} from "@tauri-apps/plugin-barcode-scanner";
import {ToTpQRCodeCalback} from "../types/callback/qrcode";

const cancelScan = async () => {
    await cancel();
};

const startScan = async () => {
    const result = await scan({
        windowed: true,
        cameraDirection: "back",
        formats: [Format.QRCode],
    });
    return result;
};

const requestScanPermissions = async () => {
    let checked = await checkPermissions();
    if (checked !== "granted") {
        let requested = await requestPermissions();
        if (requested !== "granted") {
            console.error("Camera permission not granted");
        }
    }
};

const getToTpQRCode = async (
    toTpUrl: string
): Promise<ToTpQRCodeCalback> => {
    try {
        const qrCodeData = await invoke<ToTpQRCodeCalback>(
            "generate_totp_qr_base64",
            {
                oauth: toTpUrl,
            }
        );

        return qrCodeData;
    } catch (e) {
        return {
            success: false,
            qrcodebase64: null,
        };
    }
};

export {
    getToTpQRCode,
    requestScanPermissions,
    cancelScan,
    startScan
}