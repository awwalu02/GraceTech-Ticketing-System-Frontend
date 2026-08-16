"use client";

import { Headphones } from "lucide-react";

export default function AuthShell({ children }) {
  return (
    <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
            <Headphones size={17} className="text-white" strokeWidth={2} />
          </div>
          <span className="text-[15px] font-bold text-gray-900 tracking-tight">
            IT Support
          </span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
