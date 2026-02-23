import { useState } from "react";
import { loginToApp } from "../lib/default";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { HelpCircle } from "lucide-react";
import { Help } from "./Help";

export function Login({
  isOpen,
  onLogin,
}: {
  isOpen: boolean;
  onLogin: (code: string) => void;
}) {
  if (!isOpen) return;

  const [code, setCode] = useState<string>();
  const [helpOpen, setHelpOpen] = useState<boolean>(false);
  const [err, setErr] = useState<string>("Awating Login...");

  async function login() {
    if (!code) {
      setErr("Please enter your code!");
    } else {
      const login = await loginToApp(code);
      if (login && login?.success) {
        if (login.code) {
          onLogin(login.code);
        } else setErr("No Code has been found!");
      } else if (login) {
        setErr(login?.message);
      } else {
        setErr("No Login found...");
      }
    }
  }

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center py-10 text-white mb-10">
      <h1 className="text-2xl font-extrabold text-pink-500 mt-28 flex flex-col items-center mb-4">
        Encypt your Account
      </h1>

      <div className="flex flex-col justify-center items-center">
        <InputOTP
          onChange={(e) => {
              setInterval(() => {
                if (e.length >= 6) {
                  setCode(e);
                  login();
                }
              }, 100);
          }}
          onInput={(e) => {
              setInterval(() => {
                if (e.currentTarget.value.length >= 6) {
                  setCode(e.currentTarget.value);
                  login();
                }
              }, 100);
          }}
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
        >
          <InputOTPGroup>
            <InputOTPSlot className="w-14 h-14" index={0} />
            <InputOTPSlot className="w-14 h-14" index={1} />
            <InputOTPSlot className="w-14 h-14" index={2} />
            <InputOTPSlot className="w-14 h-14" index={3} />
            <InputOTPSlot className="w-14 h-14" index={4} />
            <InputOTPSlot className="w-14 h-14" index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="p-1 ">
        <p className="text-center text-sm text-zinc-400 font-medium">{err}</p>
      </div>
      <span className="text-white flex right-0 absolute bottom-0 p-5">
        <Help
          isOpen={helpOpen}
          onClose={() => {
            setHelpOpen(false);
          }}
        ></Help>
        <HelpCircle
          onClick={() => setHelpOpen(true)}
          className="flex size-10"
        ></HelpCircle>
      </span>
    </div>
  );
}
