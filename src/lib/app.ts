import {invoke} from "@tauri-apps/api/core";
import {AppData} from "../types/app.ts";
import {initDatabaseData} from "./database";
import {addAccount} from "./totp";
import {BaseDirectory, create, exists, readTextFile, writeTextFile,} from "@tauri-apps/plugin-fs";
import {ErrorCodeCallback, LoginCallback} from "../types/callback/default";

export const DATABASE_FILE = "secura.db";
export const SECRET_FILE = ".secret";

const appVersion = async (): Promise<string> => {
    return await invoke<string>("get_app_version");
}

const importApp = async (
    appData: AppData,
    accountSecret: string,
): Promise<ErrorCodeCallback> => {
    try {
        if (!appData.version)
            return {
                code: 404,
                message: "Invalid App Data",
            };
        appData.accounts.map(async (a) => await addAccount(a, accountSecret))

        return {
            code: 200,
            message: "Import Successful",
        };
    } catch (e) {
        return {
            code: 500,
            message: "Import Failed",
        };
    }
}

const resetApp = async () => {
    await initDatabaseData("DROP TABLE accounts;");
    await initDatabaseData(
        "CREATE TABLE IF NOT EXISTS accounts (Id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Icon TEXT, OtpAuthUrl TEXT);",
    );
}

const manageSecretKey = async (code: string): Promise<string> => {
    const secretFile = await exists(".secret", {
        baseDir: BaseDirectory.AppConfig,
    });

    if (!secretFile) {
        await create(".secret", {
            baseDir: BaseDirectory.AppConfig,
        });

        const uuid = crypto.randomUUID().slice(0, 32).replace("-", "");
        const secretKey = await invoke<string>("encrypt_keys", {
            password: uuid,
            key: code,
        });
        await writeTextFile(".secret", secretKey, {
            baseDir: BaseDirectory.AppConfig,
        });
    }

    const fileContent = await readTextFile(".secret", {
        baseDir: BaseDirectory.AppConfig,
    });

    return fileContent;
}

const startOnboarding = async (
    loginCode: string,
): Promise<LoginCallback> => {
    await manageSecretKey(loginCode);
    await loginToApp(loginCode);
    return {
        onboarding: false,
        success: true,
        message: "Account created....",
    };
}

const loginToApp = async (
    loginCode: string | null,
): Promise<LoginCallback> => {
    try {
        const secretFile = await exists(".secret", {
            baseDir: BaseDirectory.AppConfig,
        });

        if (!secretFile) {
            return {
                onboarding: true,
                success: false,
                message: "Enter Code",
            };
        }

        if (!loginCode)
            return {
                onboarding: false,
                success: false,
                message: "",
            };

        const fileContent = await readTextFile(".secret", {
            baseDir: BaseDirectory.AppConfig,
        });

        const callback = await invoke("login", {
            code: loginCode,
            secretCode: fileContent,
        });

        return callback as LoginCallback;
    } catch (e) {
        console.log(e);

        return {
            onboarding: false,
            message: "Failed to login!",
            success: false,
        };
    }
}


export {
    appVersion,
    importApp,
    resetApp,
    manageSecretKey,
    startOnboarding,
    loginToApp,
}