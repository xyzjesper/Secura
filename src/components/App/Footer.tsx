import { useState } from "react";
import { Plus, Settings } from "lucide-react";
import { SettingsModal } from "../Settings/Settings.tsx";
import { ToTpCreate } from "../ToTp/ToTpCreate.tsx";
import { ToTpAccount } from "../../types/totp.ts";

export function Footer({
  loginCode,
  handleRefresh,
}: {
  loginCode: string;
  handleRefresh: (accounts: ToTpAccount[]) => void;
}) {
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [openCreateToTpModal, setOpenCreateToTpModal] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 bg-popover/90 w-full border-t border-zinc-700 py-4 flex justify-center gap-6 shadow-2xl">
        <div className="lg:mb-5 sm:mb-10 md:mb-10 inline-flex">
          <div className="mr-2">
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-4 border-4 border-ring hover:border-ring/70 bg-popover rounded-full shadow-lg transition cursor-pointer"
            >
              <Settings />
            </button>
            <SettingsModal
              loginCode={loginCode}
              isOpen={settingsOpen}
              onClose={() => setSettingsOpen(false)}
            />
          </div>

          <div className="ml-2">
            <button
              onClick={() => setOpenCreateToTpModal(true)}
              className="p-4 border-4 border-ring hover:border-ring/70 bg-popover rounded-full shadow-lg transition cursor-pointer"
            >
              <Plus />
            </button>
            <ToTpCreate
              accountSecret={loginCode}
              handleRefresh={(a) => handleRefresh(a)}
              onClose={() => setOpenCreateToTpModal(false)}
              isOpen={openCreateToTpModal}
            />
          </div>
        </div>
      </div>
    </>
  );
}
