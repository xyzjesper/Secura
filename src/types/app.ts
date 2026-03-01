import {ToTpAccount} from "./totp";

export type AppData = {
    accounts: ToTpAccount[];
    version: string;
};

export type SyncSettings = {
    endpoint: string,
    secret: string
}