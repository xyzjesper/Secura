import {useState} from "react";
import {CloudIcon, HelpCircle, Import, RotateCcw, Upload, X} from "lucide-react";
import {ExportModal} from "./Export";
import {ResetModal} from "./Reset";
import {ImportModal} from "./Import";
import {Help} from "../App/Help.tsx";

export function SettingsModal({
                                  loginCode,
                                  isOpen,
                                  onClose,
                              }: {
    loginCode: string;
    isOpen: boolean;
    onClose: () => void;
}) {
    if (!isOpen) return;
    const [exportOpen, setExportOpen] = useState<boolean>(false);
    const [resetOpen, setResetOpen] = useState<boolean>(false);
    const [importOpen, setImportOpen] = useState<boolean>(false);
    const [helpOpen, setHelpOpen] = useState<boolean>(false);

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-background/50 backdrop-blur-sm z-70">
            <div
                className="w-72 bg-background/90 border border-zinc-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-5">
                <div className="inline-flex ml-2 mr-2">
                    <div>
                        <button
                            onClick={() => setExportOpen(true)}
                            className="hover:font-bold w-32 ml-0.5 inline-flex justify-center items-center border-2 rounded-2xl m-1 p-2 hover:cursor-pointer"
                        >
                            <Upload className="ml-2 mr-2"></Upload> Export
                        </button>
                        <ExportModal
                            loginCode={loginCode}
                            isOpen={exportOpen}
                            onClsoe={() => setExportOpen(false)}
                        />
                        <button
                            onClick={() => setResetOpen(true)}
                            className="hover:font-bold w-32 inline-flex justify-center items-center border-2 rounded-2xl m-1 p-2 hover:cursor-pointer"
                        >
                            <RotateCcw className="ml-2 mr-2"></RotateCcw> Reset
                        </button>
                        <ResetModal
                            isOpen={resetOpen}
                            onClsoe={() => setResetOpen(false)}
                        />
                    </div>
                    <button
                        onClick={() => setImportOpen(true)}
                        className="hover:font-bold inline-block justify-center items-center border-2 rounded-2xl m-1 p-2 hover:cursor-pointer w-full"
                    >
                        <Import className="ml-2 mr-2 flex justify-center items-center align-middle"></Import>
                        <span>Import</span>
                    </button>
                    <ImportModal
                        loginCode={loginCode}
                        isOpen={importOpen}
                        onClose={() => setImportOpen(false)}
                    ></ImportModal>
                </div>
                <hr className="w-full border-zinc-700 my-1"/>
                <div className={"flex items-center justify-center flex-col"}>
                    <div>
                        <button
                            disabled={true}
                            onClick={() => setHelpOpen(true)}
                            className=" inline-flex justify-center items-center border-2 rounded-2xl m-1 p-2 hover:cursor-pointer bg-gray-700"
                        >
                            <CloudIcon className="ml-2 mr-2"></CloudIcon> Synchronisation
                        </button>
                        {/* COMPONENT CLOUD (hover:font-bold) */}
                    </div>
                    <div>
                        <button
                            onClick={() => setHelpOpen(true)}
                            className="hover:font-bold inline-flex justify-center items-center border-2 rounded-2xl m-1 p-2 hover:cursor-pointer"
                        >
                            <HelpCircle className="ml-2 mr-2"></HelpCircle> Informations & Help
                        </button>
                        <Help isOpen={helpOpen} onClose={() => setHelpOpen(false)}></Help>
                    </div>
                </div>
                <div>
                    <button
                        onClick={() => onClose()}
                        className="inline-flex cursor-pointer hover:font-bold"
                    >
                        <X></X>
                        <span>Close</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
