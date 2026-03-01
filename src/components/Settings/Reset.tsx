import { RotateCcw, X } from "lucide-react";
import { resetApp } from "../../lib/app.ts";

export function ResetModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return;

  const handleReset = async () => {
    await resetApp();
    window.location.reload();
  };

  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center bg-background/50 backdrop-blur-sm z-100">
        <div className="w-72 bg-background/90 border border-zinc-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-5">
          <div>
            <div>
              <span
                className={
                  "text-xs flex items-center justify-center p-2 text-red-600 font-extrabold"
                }
              >
                Confirm your account reset.
              </span>
            </div>
            <button
              className="hover:font-bold inline-flex items-center justify-center border-2 rounded-2xl p-2 cursor-pointer "
              onClick={() => {
                handleReset();
                onClose();
              }}
            >
              <RotateCcw className="flex items-center justify-center ml-2 mr-2"></RotateCcw>
              <p className="flex items-center justify-center">
                {" "}
                Confirm App Reset
              </p>
            </button>
          </div>
          <hr className="w-full border-zinc-700 my-2" />
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
