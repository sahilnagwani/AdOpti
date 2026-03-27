import React from "react";
import { useWorkspace } from "../hooks/useWorkspace";

export default function SettingsPage() {
  const { workspaceName, plan } = useWorkspace();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 font-sans text-white">
      <div>
        <h1 className="text-2xl font-bold text-white">Workspace Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Manage integrations, members, and billing.</p>
      </div>

      <div className="bg-[#0f172a] rounded-xl border border-[#1f2937] shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-white border-b border-[#1f2937] pb-2 mb-4">General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Workspace Name</label>
              <input 
                type="text" 
                defaultValue={workspaceName}
                className="w-full px-4 py-2 bg-[#080d1a] border border-[#1f2937] rounded-lg text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Current Plan</label>
              <div className="px-4 py-2 border border-[#1f2937] rounded-lg bg-[#080d1a] text-sm font-semibold uppercase tracking-wider text-gray-400">
                {plan}
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <h2 className="text-lg font-semibold text-white border-b border-[#1f2937] pb-2 mb-4">Connected Platforms</h2>
          <div className="text-sm text-gray-400 italic bg-[#080d1a] p-4 rounded-lg border border-dashed border-[#1f2937] text-center">
            Integration configuration interface will go here.
          </div>
        </div>
        
        <div className="pt-4 flex justify-end">
          <button className="px-6 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
