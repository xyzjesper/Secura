import {AlertTriangle} from "lucide-react";
import {ToTpAccount} from "../../types/totp";
import {useState} from "react";
import {deleteToTp} from "../../lib/totp";
import {stringToIcon} from "@iconify/utils";
import {motion, AnimatePresence} from "framer-motion";

export function ToTpDelete({
                               toTpAccount,
                               isOpen,
                               isDeleted,
                               onClose
                           }: {
    toTpAccount: ToTpAccount;
    isOpen: boolean;
    isDeleted: (bool: boolean) => void;
    onClose: () => void;
}) {
    if (!isOpen) return
    const [statusMsg, setStatusMsg] = useState<string>();

    const handleDelete = async () => {
        const req = await deleteToTp(toTpAccount.Id);
        if (req) {
            isDeleted(true);
            setStatusMsg("Successfully deleted your account.");
        } else {
            setStatusMsg("An error occurred while deletion!");
        }
        setTimeout(() => {
            onClose();
        }, 1200);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                className="fixed inset-0 flex justify-center items-center bg-background/50 backdrop-blur-sm z-50"
                onClick={() => onClose()}
            >
                <motion.div
                    initial={{scale: 0.9, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    exit={{scale: 0.9, opacity: 0}}
                    transition={{type: "spring", stiffness: 200, damping: 20}}
                    onClick={(e) => e.stopPropagation()}
                    className="w-96 bg-background/90 border border-zinc-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-5"
                >
                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex justify-center items-center shadow-md">
                        <img
                            width={40}
                            height={40}
                            className="w-10 h-10"
                            src={`https://api.iconify.design/${
                                stringToIcon(toTpAccount?.Icon ?? "ic:baseline-fingerprint")
                                    ?.prefix
                            }/${
                                stringToIcon(toTpAccount?.Icon ?? "ic:baseline-fingerprint")
                                    ?.name
                            }.svg?color=white`}
                        />
                    </div>

                    <h2 className="text-lg font-semibold text-white text-center">
                        Delete "{toTpAccount?.Name ?? "Unknown"}"?
                    </h2>

                    <div className="flex items-center gap-2 text-red-400 font-medium">
                        <AlertTriangle className="w-5 h-5"/>
                        <p> This action cannot be undone! </p>
                    </div>

                    <p className="text-sm text-zinc-400 text-center">{statusMsg}</p>


                    <div className="flex justify-center items-center gap-6 mt-2">
                        <button
                            type="submit"
                            onClick={handleDelete}
                            className="flex justify-center items-center p-3 hover:bg-red-700 rounded-md w-20 text-white transition shadow-md cursor-pointer"
                        >
                            <span className={"font-bold"}>Delete</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                isDeleted(false);
                            }}
                            className="flex justify-center items-center p-3 hover:bg-gray-700 rounded-md w-20 text-white transition shadow-md cursor-pointer"
                        >
                            <span className={"font-bold"}>Cancel</span>
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
