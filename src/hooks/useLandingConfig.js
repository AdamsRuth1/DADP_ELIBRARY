import { useEffect, useState } from "react";
import defaultDadpLandingConfig from "../data/dadpLandingConfig";

const STORAGE_KEY = "dadpLandingConfig";

export function useLandingConfig() {
  const [config, setConfig] = useState(defaultDadpLandingConfig);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setConfig(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to parse landing page config", error);
      setConfig(defaultDadpLandingConfig);
    }
  }, []);

  const saveConfig = (updatedConfig) => {
    const nextConfig = typeof updatedConfig === "function" ? updatedConfig(config) : updatedConfig;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextConfig));
    }
    setConfig(nextConfig);
  };

  const resetConfig = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setConfig(defaultDadpLandingConfig);
  };

  return {
    config,
    saveConfig,
    resetConfig,
    defaultConfig: defaultDadpLandingConfig
  };
}
