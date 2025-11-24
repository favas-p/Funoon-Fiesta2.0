"use client";

import { Suspense, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "next/navigation";

function ToastListener() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for toast messages in URL params
    const message = searchParams.get("message");
    const type = searchParams.get("type") || "error";

    if (message) {
      const decodedMessage = decodeURIComponent(message);
      
      // Ignore NEXT_REDIRECT messages (internal Next.js redirect mechanism)
      if (decodedMessage === "NEXT_REDIRECT" || decodedMessage.includes("NEXT_REDIRECT")) {
        return;
      }
      
      if (type === "success") {
        toast.success(decodedMessage, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else if (type === "warning") {
        toast.warning(decodedMessage, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else if (type === "info") {
        toast.info(decodedMessage, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(decodedMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }

      // Clean up URL params
      const url = new URL(window.location.href);
      url.searchParams.delete("message");
      url.searchParams.delete("type");
      window.history.replaceState({}, "", url);
    }
  }, [searchParams]);

  return null;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <ToastListener />
      </Suspense>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="bg-slate-800 border border-white/10"
        progressClassName="bg-fuchsia-500"
      />
    </>
  );
}

