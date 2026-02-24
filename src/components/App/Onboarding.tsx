import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export function Onboarding({
  isOpen,
  onSubmit,
}: {
  isOpen: boolean;
  onSubmit: (code: string) => void;
}) {
  if (!isOpen) return;

  const [loginCode, setLoginCode] = useState<string | null>(null);

  return (
    <>
      <div className="h-screen fixed inset-0 flex justify-center items-center bg-background/50 backdrop-blur-sm z-100">
        <div className="w-96 bg-background/90 border border-zinc-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-5">
          <div>
            <div className="flex items-center">
              <h3 className="text-pink-500 flex text-1xl font-extrabold">
                Onboarding
              </h3>
            </div>
            <div className="text-xs text-white flex items-center justify-center">
              Welcome to Secura. Secura is an OpenSource, free and secure Two
              Factor Authenticator App
            </div>
          </div>
          <div className="p-3 text-white flex items-center justify-center flex-col">
            <h6 className="text-xs text-left text-zinc-500">
              Please set a encryption code to get started...
            </h6>
            <InputOTP
              onChange={(e) => {
                setLoginCode(e);
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
          <div className="flex items-center justify-center">
            <button
              className="text-white hover:font-bold flex items-center justify-center border-2 rounded-2xl p-2 cursor-pointer "
              onClick={() => {
                if (!loginCode) return;
                onSubmit(loginCode);
              }}
            >
              <p className="flex items-center justify-center">
                {" "}
                Set encryption Code
              </p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
