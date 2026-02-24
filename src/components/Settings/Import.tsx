import {FolderOpen, X} from "lucide-react";
import {AppData} from "../../types/app.ts";
import {importApp} from "../../lib/app.ts";
import {useState} from "react";
import {toast} from "sonner";

export function ImportModal({
                                loginCode,
                                isOpen,
                                onClose,
                            }: {
    loginCode: string;
    isOpen: boolean;
    onClose: () => void;
}) {
    if (!isOpen) return;
    const [file, setFile] = useState<File>();

    const handleFileImport = async () => {
        if (!file?.name.endsWith(".secura")) {
            toast("File has not .secura extension.");
        }

        const str = new TextDecoder("utf-8");
        const arrayBuffer = await file?.arrayBuffer();
        const base64String = str.decode(arrayBuffer);
        const string = atob(base64String);
        const json = JSON.parse(string) as AppData;
        const callback = await importApp(json, loginCode);

        if (callback.code == 500 || callback.code == 404)
            return toast("Error occoured while importing the accounts");
        else if (callback.code == 200) {
            onClose();

            toast("Successfully imported...");
        }
    };

    return (
        <>
            <div className="fixed inset-0 flex justify-center items-center bg-background/50 backdrop-blur-sm z-100">
                <div
                    className="w-72 bg-background/90 border border-zinc-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-5">
                    <div className="h-auto w-60 cursor-pointer">
                        <div
                            className={
                                "flex justify-center items-center p-2 rounded-2xl border-2 cursor-pointer mb-3"
                            }
                        >
                            <label
                                htmlFor="fileimport"
                                className="text-xs cursor-pointer hover:font-bold"
                            >
                                {file ? file.name : "Import a Secura TXT"}
                            </label>
                            <input
                                hidden
                                onChange={(e) => {
                                    if (!e.target.files) return;
                                    setFile(e.target.files[0]);
                                }}
                                accept={".secura,text/*"}
                                id="fileimport"
                                name="fileimport"
                                type="file"
                                className="w-full h-12 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div
                            className={"flex justify-center items-center mb-3 cursor-pointer"}
                        >
                            <button
                                onClick={() => handleFileImport()}
                                className="hover:font-bold inline-flex mt-2 justify-center items-center cursor-pointer"
                            >
                                <FolderOpen className="mr-2 flex justify-center items-center"></FolderOpen>
                                <span className="flex justify-center items-center">
                  Click to Import
                </span>
                            </button>
                        </div>
                    </div>
                    <hr className="w-full border-zinc-700 my-2"/>
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
