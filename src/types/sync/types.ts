export type SyncDownloadRequest = {
    key: string
}

export type SyncDownloadResponse = {
    message: string,
    data: string,
    success: boolean,
}

export type SyncUploadRequest = {
    key: string,
    accounts_base64: string,
}