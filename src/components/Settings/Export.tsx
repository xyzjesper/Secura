import {Download, X} from "lucide-react";
import {fetchAccounts} from "../../lib/totp";
import {AppData} from "../../types/app.ts";
import {appVersion} from "../../lib/app.ts";
import {toast} from "sonner";
import {BaseDirectory, writeFile} from "@tauri-apps/plugin-fs";

export function ExportModal({
                                loginCode,
                                isOpen,
                                onClsoe,
                            }: {
    loginCode: string;
    isOpen: boolean;
    onClsoe: () => void;
}) {
    if (!isOpen) return;

    const handleExport = async () => {
        const toTpAccounts = await fetchAccounts(loginCode);
        const exportData: AppData = {
            accounts: toTpAccounts.data,
            version: await appVersion(),
        };

        let encoder = new TextEncoder();
        let data = encoder.encode(btoa(JSON.stringify(exportData)));

        await writeFile(`secura-export-${self.crypto.randomUUID().split("-")[0]}.secura`, data, {
            baseDir: BaseDirectory.Download,
            createNew: true,
            create: true,
        });

        toast("Exported to your Downloads folder..");
    };

    return (
        <>
            <div className="fixed inset-0 flex justify-center items-center bg-background/50 backdrop-blur-sm z-101">
                <div
                    className="w-72 bg-background/90 border border-zinc-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-5">
                    <div>
                        <div className="flex justify-center items-center mb-3">
                            <div>
                                <p className="text-center">
                                    Click on Download to download the file and export it.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-center items-center cursor-pointer">
                            <button
                                onClick={() => {
                                    handleExport();
                                }}
                                className="hover:font-bold inline-flex items-center justify-center border-2 rounded-2xl p-2 cursor-pointer"
                            >
                                <Download className="mr-3 justify-center items-center flex"></Download>
                                <p className="justify-center items-center flex"> Download</p>
                            </button>
                        </div>
                    </div>
                    <hr className="w-full border-zinc-700 my-2"/>
                    <div>
                        <button
                            className="inline-flex hover:font-bold cursor-pointer"
                            onClick={() => onClsoe()}
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
