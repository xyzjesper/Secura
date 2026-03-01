import {BaseDirectory, create, exists, readTextFile, writeTextFile} from "@tauri-apps/plugin-fs";
import {invoke} from "@tauri-apps/api/core";
import {SyncSettings} from "../types/app.ts";
import {SyncDownloadResponse, SyncUploadRequest} from "../types/sync/types.ts";
import {addAccount, fetchAccounts} from "./totp.ts";
import {ToTpAccount} from "../types/totp.ts";
import {fetch} from '@tauri-apps/plugin-http';
import {resetApp} from "./app.ts";
import {toast} from "sonner";

const setSyncSettings = async (loginCode: string, secret: string, endpoint?: string): Promise<void> => {

    if (!await exists("sync.json", {
        baseDir: BaseDirectory.AppConfig
    })) {
        await create("sync.json", {
            baseDir: BaseDirectory.AppConfig
        })
    }

    const secretKey = secret.endsWith("=") ? secret : (await invoke<string>("encrypt_keys", {
        password: secret,
        key: loginCode,
    })).replace(/[^a-zA-Z0-9]/gim, "") + "==";


    await writeTextFile(
        "sync.json",
        JSON.stringify({
            endpoint: endpoint ?? "https://sync.secura.xyzify.ing",
            secret: secretKey
        } satisfies SyncSettings),
        {
            baseDir: BaseDirectory.AppConfig
        }
    )
}

const getSyncSettings = async (): Promise<SyncSettings | null> => {
    if (!await exists("sync.json", {
        baseDir: BaseDirectory.AppConfig
    })) {
        return null
    }

    return JSON.parse(await readTextFile("sync.json", {baseDir: BaseDirectory.AppConfig})) as SyncSettings
}

const syncApp = async (loginCode: string, type: "upload" | "download" | "reset") => {
    const data = JSON.parse(await readTextFile("sync.json", {baseDir: BaseDirectory.AppConfig})) as SyncSettings

    switch (type) {
        case "download": {
            const response = await fetch(`${data.endpoint}/?key=${data.secret}`, {
                method: "GET",
            })

            const json = await response.json() as SyncDownloadResponse

            if (!json.success) {
                return json.message
            }

            if (json.data.length < 1) {
                return toast("No Accounts to sync")
            }

            const accounts = JSON.parse(await invoke<string>("decrypt_keys", {
                encryptedData: json.data,
                key: data.secret,
            })) as ToTpAccount[];


            await resetApp()
            accounts.map(async (a) => {
                await addAccount(a, loginCode)
            })
        }
            break;
        case "upload": {
            const accounts = await fetchAccounts(loginCode)
            const encryptedData = await invoke<string>("encrypt_keys", {
                password: JSON.stringify(accounts.data),
                key: data.secret,
            });

            await fetch(data.endpoint, {
                method: "POST",
                body: JSON.stringify(
                    {
                        key: data.secret,
                        accounts_base64: encryptedData
                    } as SyncUploadRequest
                )
            })
        }
            break;
        case "reset": {
            await fetch(data.endpoint, {
                method: "POST",
                body: JSON.stringify(
                    {
                        key: data.secret,
                        accounts_base64: ""
                    } as SyncUploadRequest
                )
            })
        }
            break
    }
}

export {
    getSyncSettings,
    setSyncSettings,
    syncApp
}