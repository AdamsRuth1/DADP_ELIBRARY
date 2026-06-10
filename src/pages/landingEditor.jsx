import React, { useEffect, useState } from "react";
import { useLandingConfig } from "../hooks/useLandingConfig";

export default function LandingEditor() {
  const { config, saveConfig, resetConfig, defaultConfig } = useLandingConfig();
  const [jsonText, setJsonText] = useState(JSON.stringify(config, null, 2));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setJsonText(JSON.stringify(config, null, 2));
  }, [config]);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonText);
      saveConfig(parsed);
      setError("");
      setSuccess("Landing page content saved successfully.");
      window.setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(`Invalid JSON: ${e.message}`);
      setSuccess("");
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      saveConfig(parsed);
      setError("");
      setSuccess("Landing page config uploaded and applied.");
      window.setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(`Upload error: ${e.message}`);
      setSuccess("");
    }
  };

  const handleReset = () => {
    resetConfig();
    setError("");
    setSuccess("Landing page config reset to default.");
    window.setTimeout(() => setSuccess(""), 3000);
  };

  const handleExport = () => {
    try {
      const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "dadp-landing-config.json";
      link.click();
      URL.revokeObjectURL(url);
      setError("");
      setSuccess("Landing page config exported successfully.");
      window.setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(`Export failed: ${e.message}`);
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen pl-[15px]">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-bold">DADP Landing Page Editor</h1>
        <p className="text-gray-600 max-w-3xl">
          Update the DADP landing page content by editing the JSON below or uploading a JSON config file. Changes are persisted locally for fast preview and editing.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold">Edit JSON Content</h2>
                <p className="text-sm text-gray-500 mt-1">Modify the text content for the DADP landing page sections directly.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-100">
                  Upload JSON
                  <input type="file" accept="application/json" onChange={handleUpload} className="hidden" />
                </label>
                <button onClick={handleExport} className="rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-gray-50">
                  Export JSON
                </button>
                <button onClick={handleSave} className="rounded-full bg-[#1F3D2B] px-5 py-2 text-sm font-semibold text-white hover:bg-[#162c1f]">
                  Save Changes
                </button>
                <button onClick={handleReset} className="rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-gray-50">
                  Reset Default
                </button>
              </div>
            </div>

            <textarea
              value={jsonText}
              onChange={(event) => setJsonText(event.target.value)}
              className="min-h-[560px] w-full rounded-3xl border border-gray-200 bg-slate-950 p-4 text-sm font-mono text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-[#C5A64D]"
            />

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            {success && <p className="mt-3 text-sm text-green-700">{success}</p>}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Live Preview</h2>
            <div className="space-y-4 text-sm text-gray-700">
              <div className="rounded-3xl bg-slate-900 p-4 text-white">
                <p className="text-xs uppercase tracking-[0.2em] text-[#C5A64D] mb-2">Hero snapshot</p>
                <h3 className="text-lg font-semibold">{config.hero.heading}</h3>
                <p className="mt-2 text-sm text-slate-300 line-clamp-3">{config.hero.subtext}</p>
              </div>

              <div className="rounded-3xl bg-slate-100 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">About section</p>
                <h3 className="font-semibold text-slate-900">{config.about.heading}</h3>
                <p className="mt-2 text-sm text-slate-600 line-clamp-4">{config.about.body}</p>
              </div>

              <div className="rounded-3xl bg-white p-4 border border-gray-200">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Command section</p>
                <p className="font-semibold text-slate-900">{config.command.heading}</p>
                <p className="mt-1 text-sm text-slate-600 line-clamp-3">{config.command.description}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Quick Controls</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>1. Edit JSON to update landing content instantly.</li>
              <li>2. Save to preserve changes in local storage.</li>
              <li>3. Export JSON to share or backup your config.</li>
              <li>4. Upload JSON to restore a saved configuration.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
