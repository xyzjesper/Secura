import {CopyIcon, Download, SettingsIcon, TimerReset, UploadIcon, X} from "lucide-react";
import {toast} from "sonner";
import {getSyncSettings, setSyncSettings, syncApp} from "../../lib/sync.ts";
import {useEffect, useState} from "react";

export function SyncModal({
                              loginCode,
                              isOpen,
                              onClose,
                          }: {
    loginCode: string,
    isOpen: boolean;
    onClose: () => void;
}) {
    if (!isOpen) return;

    const [secret, setSecret] = useState<string | null>()
    const [endpoint, setEndpoint] = useState<string | null>()

    const handleLoad = async () => {
        const data = await getSyncSettings()
        if (data == null) {
            toast("No Settings found...")
            await setSyncSettings(loginCode, crypto.randomUUID().substring(0, 5))
            toast("Added default settings...")
            onClose()
        }
        setSecret(data?.secret)
        setEndpoint(data?.endpoint)
    }

    useEffect(() => {
        async function fetch() {
            await handleLoad()
        }

        fetch()
    }, [])

    const handleSyncDownload = async () => {
        await syncApp(loginCode, "download")
        toast("Successfully synced your accounts.")
    };
    const handleSyncUpload = async () => {
        await syncApp(loginCode, "upload")
        toast("Successfully uploaded your accounts...")
    };

    const handleSettings = async () => {
        await setSyncSettings(loginCode, secret!!, endpoint!!);
        toast("Updated Sync Settings successfully!")
        const settings = await getSyncSettings()
        setEndpoint(settings?.endpoint)
        setSecret(settings?.secret)
    };

    const handleReset = async () => {
        await syncApp(loginCode, "reset")
    }

    const handleChangeValue = (value: string, type: "endpoint" | "secret") => {
        switch (type) {
            case "endpoint": {
                setEndpoint(value)
            }
                break;
            case "secret": {
                setSecret(value)
            }
                break;
        }
    }

    return (
        <>
            <div className="fixed inset-0 flex justify-center items-center bg-background/50 backdrop-blur-sm z-100">
                <div
                    className="w-72 bg-background/90 border border-zinc-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-5">
                    <div>
                        <div className={"text-xs flex items-center justify-center p-2 flex-col"}>
                            <span className={"text-sm font-bold mb-2"}>
                                    Account Synchronisation.
                            </span>
                            <span>
                                Secura provide a feature to sync your accounts over devices.
                                You data is encrypted and only accessible via you Secret-Key.
                            </span>
                        </div>
                    </div>
                    <div className={"flex justify-center items-center flex-col"}>
                        <div className={"mb-2"}>
                            <label className={"text-xs font-bold flex ml-1 mb-1"}>Endpoint</label>
                            <input
                                className={"border rounded-2xl p-2"}
                                value={endpoint ?? ""}
                                onChange={(e) => handleChangeValue(e.target.value, "endpoint")}
                                type={"text"}
                            />
                        </div>
                        <div>
                            <label className={"text-xs font-bold flex ml-1 mb-1"}>Secret-Key</label>
                            <input
                                className={"border rounded-2xl p-2"}
                                type={"password"}
                                value={secret ?? ""}
                                onChange={(e) => handleChangeValue(e.target.value, "secret")}
                                placeholder={"Secret-Key"}
                            />
                            <div className={"inline-flex right-0 -ml-9 mt-2 relative cursor-pointer rounded-2xl"}>
                                <CopyIcon
                                    className={"inline-flex cursor-pointer rounded-2xl"}
                                    onClick={async () => {
                                        await navigator.clipboard.writeText(secret ?? "NO SECRET-KEY")
                                        toast("Copied to clipboard.")
                                    }}
                                ></CopyIcon>
                            </div>
                        </div>
                        <div>
                            <h6 className={"text-[10px] font-extrabold"}>Share this key only with your
                                other Devices!</h6>
                        </div>
                        <div className={"mt-4 flex-col flex items-center justify-center"}>
                            <div className={"inline-flex justify-center items-center"}>
                                <div className={"flex mx-2"}>
                                    <button
                                        className="hover:font-bold inline-flex items-center justify-center border-2 rounded-2xl p-2 cursor-pointer "
                                        onClick={() => handleSyncUpload()}
                                    >
                                        <UploadIcon className="flex items-center justify-center ml-2 mr-2"></UploadIcon>
                                        <p className="flex items-center justify-center">
                                            {" "}
                                            Upload
                                        </p>
                                    </button>
                                </div>
                                <div className={"flex"}>
                                    <button
                                        className="hover:font-bold inline-flex items-center justify-center border-2 rounded-2xl mr-2 p-2 cursor-pointer "
                                        onClick={() =>
                                            handleSyncDownload()}
                                    >
                                        <Download className="flex items-center justify-center ml-2 mr-2"></Download>
                                        <p className="flex items-center justify-center">
                                            {" "}
                                            Download
                                        </p>
                                    </button>
                                </div>
                            </div>
                            <button
                                className="hover:font-bold inline-flex items-center justify-center border-2 rounded-2xl p-1.5 mt-2 cursor-pointer "
                                onClick={() => handleSettings()}
                            >
                                <SettingsIcon className="flex items-center justify-center ml-2 mr-2"></SettingsIcon>
                                <p className="flex items-center justify-center">
                                    {" "}
                                    Update Settings
                                </p>
                            </button>
                        </div>
                        <div className={"flex items-center justify-center flex-col"}>
                            <h6 className={"text-[10px] font-extrabold"}>When you are update your settings.</h6>
                            <h6 className={"text-[10px] font-extrabold"}>Copy this key to other Devices</h6>
                        </div>
                        <button
                            className="hover:font-bold inline-flex items-center justify-center border-2 rounded-2xl p-1.5 mt-2 cursor-pointer h-7 "
                            onClick={() => handleReset()}
                        >
                            <TimerReset className="flex items-center justify-center ml-2 mr-2 size-5"></TimerReset>
                            <p className="flex items-center justify-center text-xs">
                                {" "}
                                Reset Data
                            </p>
                        </button>
                    </div>
                    <hr className="w-full handleResetborder-zinc-700 my-2"/>
                    <div>
                        <button
                            className="inline-flex hover:font-bold cursor-pointer"
                            onClick={() => onClose()}
                        >
                            <X></X>
                            <span>Close</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
