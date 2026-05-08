/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AI_TOKEN: string;
  readonly VITE_GUARDIAN_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
