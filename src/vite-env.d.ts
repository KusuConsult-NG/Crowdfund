/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PAYSTACK_PUBLIC_KEY: string;
    readonly VITE_RESEND_API_KEY: string;
    readonly VITE_APPWRITE_ENDPOINT: string;
    readonly VITE_APPWRITE_PROJECT_ID: string;
    readonly VITE_DATABASE_ID: string;
    readonly VITE_BUCKET_ID: string;
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
