import { invoke } from "@tauri-apps/api/core";
import { AppData } from "../types/app.ts";
import { initDatabaseData } from "./database";
import { addAccount } from "./totp";
import {
  BaseDirectory,
  create,
  exists,
  readTextFile,
  remove,
  writeTextFile,
} from "@tauri-apps/plugin-fs";
import { ErrorCodeCallback, LoginCallback } from "../types/callback/default";

export const DATABASE_FILE = "secura.db";
export const SECRET_FILE = ".secret";

export async function appVersion(): Promise<string> {
  return await invoke<string>("get_app_version");
}

export async function importApp(
  appData: AppData,
  accountSecret: string,
): Promise<ErrorCodeCallback> {
  try {
    if (!appData.version)
      return {
        code: 404,
        message: "Invalid App Data",
      };

    for (const acccount of appData.accounts) {
      await addAccount(acccount, accountSecret);
    }

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

export async function resetApp() {
  await initDatabaseData("DROP TABLE accounts;");
  await initDatabaseData(
    "CREATE TABLE IF NOT EXISTS accounts (Id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Icon TEXT, OtpAuthUrl TEXT);",
  );
}

export async function manageSecretKey(code: string): Promise<string> {
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

export async function startOnboarding(
  loginCode: string,
): Promise<LoginCallback> {
  await manageSecretKey(loginCode);
  await loginToApp(loginCode);
  return {
    onboarding: false,
    success: true,
    message: "Account created....",
  };
}

export async function loginToApp(
  loginCode: string | null,
): Promise<LoginCallback> {
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

export async function hardReset() {
  try {
    await remove(DATABASE_FILE, {
      baseDir: BaseDirectory.AppConfig,
    });
    await remove(SECRET_FILE, {
      baseDir: BaseDirectory.AppConfig,
    });
    return true;
  } catch (e) {
    return false;
  }
}
