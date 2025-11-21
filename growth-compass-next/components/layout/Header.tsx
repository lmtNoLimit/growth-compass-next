"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Compass, LogOut, User } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="glass-panel sticky top-0 z-50 mb-8 px-6 py-4 flex justify-between items-center">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
          <Compass className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Growth Compass
        </h1>
      </Link>

      <div className="flex items-center gap-4">
        {session ? (
          <>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-full border border-slate-700">
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-200">{session.user?.name || session.user?.email}</span>
            </div>
            <button
              onClick={() => signOut()}
              className="btn btn-secondary text-sm"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </>
        ) : (
          <Link href="/login" className="btn btn-primary text-sm">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
