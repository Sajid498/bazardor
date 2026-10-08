
"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: "#ffffff",
          color: "#1f2937",
          borderRadius: "12px",
          padding: "14px 18px",
          fontFamily: "inherit",
        },
        success: {
          iconTheme: {
            primary: "#047857",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#dc2626",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}
