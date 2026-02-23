"use client";
import {invoke} from "@tauri-apps/api/core";
import {initDatabaseData, getDatabaseData} from "./database.ts";
import {
    AddAccountCallback,
    GetAccountCallback,
    ToTpCreationCallback,
    UpdateAccountCallback,
} from "../types/callback/accounts.ts";
import {ToTpAccount} from "../types/totp.ts";

export async function getAccounts(
    accountSecret: string
): Promise<GetAccountCallback> {
    try {
        const data = (await getDatabaseData(
            "SELECT * FROM accounts;"
        )) as ToTpAccount[];

        if (!data) return {
            success: true,
            data: [],
            message: "No Accounts found",
        };

        const decryptedData = (await Promise.all(
            data.map(async (a: ToTpAccount) => {
                const url = await invoke("decrypt_keys", {
                    encryptedData: a.OtpAuthUrl,
                    key: accountSecret,
                });
                return {
                    Id: a.Id,
                    Name: a.Name,
                    Code: a.Code,
                    NextCode: a.NextCode,
                    Icon: a.Icon,
                    OtpAuthUrl: url,
                };
            })
        )) as ToTpAccount[];

        return {
            success: true,
            data: decryptedData,
            message: "Accounts fetched successfully.",
        };
    } catch (err) {
        return {
            success: true,
            data: [],
            message: `No Accounts`,
        };
    }
}

export async function addAccount(
    account: ToTpAccount,
    accountSecret: string
): Promise<AddAccountCallback> {
    try {
        if (!account.OtpAuthUrl) {
            return {
                success: false,
                data: [],
                message: "Secret Key is required!",
                created: null,
            };
        }

        const parsedUrl = account.OtpAuthUrl.startsWith("otpauth://")
            ? account.OtpAuthUrl
            : `otpauth://totp/Secura:Secura@xy-z.org?secret=${account.OtpAuthUrl.toUpperCase().replace(
                / /g,
                ""
            )}&issuer=Secura`;

        // Check if valid secret!
        try {
            await invoke("generate_totp", {
                oauth: parsedUrl,
            });
        } catch (e) {
            return {
                success: false,
                data: [],
                message: "Invalid Secret Key!",
                created: null,
            };
        }

        const blurredUrl = await invoke("encrypt_keys", {
            password: parsedUrl,
            key: accountSecret,
        });

        await initDatabaseData(
            "INSERT INTO accounts (Name, Icon, OtpAuthUrl) VALUES ($1, $2, $3)",
            [
                account.Name.length >= 2 ? account.Name : `NoName`,
                (account.Icon as string)?.length >= 2
                    ? account.Icon
                    : "material-symbols-light:fingerprint",
                String(blurredUrl),
            ]
        );

        const data = await getAccounts(accountSecret);
        return {
            success: true,
            data: data.data,
            message: "Account added successfully.",
            created: account,
        };
    } catch (e) {
        console.log(e);

        return {
            success: false,
            message: `Error adding account: ${(e as Error).message}`,
            data: [],
            created: null,
        };
    }
}

export async function generateToTp(
    toTpUrl: string
): Promise<ToTpCreationCallback> {
    try {
        return await invoke<ToTpCreationCallback>("generate_totp", {
            oauth: toTpUrl,
        });
    } catch (e) {
        return {
            success: false,
            message: "Can't generate your ToTp Code.",
        };
    }
}

export async function deleteToTp(totpAccountId: number): Promise<boolean> {
    try {
        await initDatabaseData(`DELETE
                                FROM accounts
                                WHERE Id = ${totpAccountId}`);
        return true;
    } catch (e) {
        return false;
    }
}

export async function updateToTp(
    accountId: number,
    name?: string,
    icon?: string
): Promise<UpdateAccountCallback> {
    try {
        if (!name && !icon)
            return {
                success: false,
                message: "Fill all required fields.",
            };

        if (name) {
            await initDatabaseData(
                `UPDATE accounts
                 SET Name='${name}'
                 WHERE Id = '${accountId}'`
            );
        }
        if (icon) {
            await initDatabaseData(
                `UPDATE accounts
                 SET Icon='${icon}'
                 WHERE Id = '${accountId}'`
            );
        }

        const account = (await getDatabaseData(
            `SELECT *
             FROM accounts
             WHERE Id = ${accountId};`
        )) as ToTpAccount[];

        return {
            account: account[0],
            success: true,
            message: "Account updated successfully.",
        };
    } catch (e) {
        return {
            success: false,
            message: `Error updating account: ${(e as Error).message}`,
        };
    }
}
