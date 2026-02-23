"use client";
import { useState } from "react";
import { Footer } from "./components/App/Footer.tsx";
import { Login } from "./components/App/Login.tsx";
import { Accounts } from "./components/App/Accounts.tsx";
import { ToTpAccount } from "./types/totp.ts";

export function AuthenticatorApp() {
  const [login, setLogin] = useState<string | null>();
  const [accounts, updateAccounts] = useState<ToTpAccount[]>([]);

  if (login == null)
    return (
      <>
        <Login onLogin={(e) => setLogin(e)} isOpen={login == null} />
      </>
    );

  return (
    <>
      <div className="flex flex-col items-center py-10 text-white mb-10">
        <Accounts updateAccounts={accounts} loginCode={login} />
        <Footer loginCode={login} handleRefresh={(a) => {
          updateAccounts(a)
        }} />
      </div>
    </>
  );
}
