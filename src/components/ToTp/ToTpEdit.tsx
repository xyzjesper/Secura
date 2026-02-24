import {ToTpAccount} from "../../types/totp";
import {useState} from "react";
import {updateToTp} from "../../lib/totp";
import {stringToIcon} from "@iconify/utils";
import {motion, AnimatePresence} from "framer-motion";

export function ToTpUpdate({
                               toTpAccount,
                               isOpen,
                               onUpdate,
                               onClose
                           }: {
    toTpAccount: ToTpAccount;
    isOpen: boolean;
    onUpdate: (account?: ToTpAccount | null) => void;
    onClose: () => void;
}) {
    if (!isOpen) return
    const [update, setUpdate] = useState<ToTpAccount>(toTpAccount);
    const [icons, setIcons] = useState<string[]>([]);
    const [statusMsg, setStatusMsg] = useState<string>();

    const fetchIcons = async (prefix: string) => {
        try {
            const data = await fetch(
                `https://api.iconify.design/search?query=${prefix}&pretty=1`,
            );
            const json = (await data.json()).icons as string[];
            setIcons(json);
        } catch {
            setIcons([]);
        }
    }

    const handleValueChange = (text: string, type: number) => {
        if (!text) return;
        setUpdate((prev) => ({
            ...prev,
            ...(type === 1 ? {Name: text} : {Icon: text}),
        }));
    };

    const handleUpdate = async () => {
        if (update.Name == toTpAccount.Name && update.Icon == toTpAccount.Icon)
            return onClose();
        const req = await updateToTp(toTpAccount.Id, update?.Name, update?.Icon);
        if (req.success) {
            onUpdate(req.account);
            setStatusMsg("Successfully updated your account.");
        } else {
            setStatusMsg("An error occurred while updating!");
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
                    className="relative w-82 bg-background/90 border border-zinc-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-5"
                >
                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex justify-center items-center shadow-md">
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
                        {toTpAccount?.Name ?? "Unbekannt"}
                    </h2>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            onClose();
                            onUpdate(null);
                        }}
                        className="flex flex-col items-center gap-4 w-full">
                        <input
                            type="text"
                            className="w-full h-12 rounded-lg border border-zinc-700 bg-chart-4 px-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={toTpAccount.Name}
                            onChange={(e) => handleValueChange(e.target.value, 1)}
                        />
                        <input
                            list="icons"
                            className="w-full h-12 rounded-lg border border-zinc-700 bg-chart-4 px-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Icon search..."
                            onChange={(e) => {
                                handleValueChange(e.target.value, 2);
                                fetchIcons(e.target.value);
                            }}
                        />
                        <datalist id="icons">
                            {icons.map((i) => (
                                <option key={i} value={i}>
                                    {i[0].toUpperCase() +
                                        i.slice(1).replace(":", " ").replace("-", " ")}
                                </option>
                            ))}
                        </datalist>

                        <p className="text-sm text-zinc-400 text-center">{statusMsg}</p>

                        <div className="flex justify-center items-center gap-6 mt-2">
                            <button
                                type="submit"
                                onClick={handleUpdate}
                                className="flex justify-center items-center p-3 hover:bg-green-700 rounded-md w-20 text-white transition shadow-md cursor-pointer"
                            >
                                <span className={"font-bold"}>Update</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => onClose()}
                                className="flex justify-center items-center p-3 hover:bg-red-700 rounded-md w-20 text-white transition shadow-md cursor-pointer"
                            >
                                <span className={"font-bold"}>Cancel</span>
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
