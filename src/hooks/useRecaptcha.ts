import { useEffect, useCallback, useRef, useState } from "react";

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      render: (container: string | HTMLElement, options: any) => number;
      getResponse: (widgetId: number) => string;
      reset: (widgetId: number) => void;
    };
  }
}

export const useRecaptcha = () => {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const widgetIdRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const scriptLoadedRef = useRef(false);
  const [widgetRendered, setWidgetRendered] = useState(false);
  const [renderAttempts, setRenderAttempts] = useState(0);

  useEffect(() => {
    // Debug: Log environment variable status
    console.log("reCAPTCHA v2 Debug:", {
      siteKey: siteKey ? `${siteKey.substring(0, 10)}...` : "NOT SET",
      siteKeyLength: siteKey ? siteKey.length : 0,
      grecaptchaExists: !!window.grecaptcha,
      scriptLoaded: scriptLoadedRef.current,
      environment: process.env.NODE_ENV,
      apiUrl: process.env.NEXT_PUBLIC_API_URL ? "SET" : "NOT SET",
    });

    // Load reCAPTCHA script if not already loaded
    if (!window.grecaptcha && !scriptLoadedRef.current) {
      if (!siteKey) {
        console.error("Cannot load reCAPTCHA: Site key not configured");
        console.error(
          "Please set VITE_RECAPTCHA_SITE_KEY in your environment variables"
        );
        return;
      }

      scriptLoadedRef.current = true;
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js`;
      script.async = true;
      script.defer = true;
      script.onerror = (error) => {
        console.error("Failed to load reCAPTCHA script:", error);
        console.error("This usually means:");
        console.error("1. Invalid site key");
        console.error("2. Domain not authorized in Google reCAPTCHA console");
        console.error("3. Network connectivity issues");
        scriptLoadedRef.current = false;
      };
      script.onload = () => {
        console.log("reCAPTCHA v2 script loaded successfully");
        console.log("grecaptcha object available:", !!window.grecaptcha);
        if (window.grecaptcha) {
          console.log("grecaptcha methods:", Object.keys(window.grecaptcha));
          setIsLoaded(true);
        }
      };
      document.head.appendChild(script);
    } else if (window.grecaptcha) {
      setIsLoaded(true);
    }
  }, [siteKey]);

  const renderRecaptcha = useCallback(
    (containerId: string) => {
      if (!siteKey) {
        console.error("reCAPTCHA site key not configured");
        return null;
      }

      if (!window.grecaptcha) {
        console.error("reCAPTCHA script not loaded");
        return null;
      }

      return new Promise<number>((resolve, reject) => {
        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
          window.grecaptcha.ready(() => {
            try {
              // Clear any existing content in the container
              const container = document.getElementById(containerId);
              if (container) {
                container.innerHTML = "";
              }

              // Reset any existing widget first
              if (widgetIdRef.current) {
                try {
                  window.grecaptcha.reset(widgetIdRef.current);
                } catch (e) {
                  // Widget might not exist anymore, that's okay
                  console.log("Previous widget reset failed, continuing...");
                }
              }

              const widgetId = window.grecaptcha.render(containerId, {
                sitekey: siteKey,
                theme: "light",
                size: "normal",
                callback: (response: string) => {
                  console.log(
                    `reCAPTCHA v2 callback triggered for ${containerId}, response length:`,
                    response.length
                  );
                  // Store the response globally so we can access it
                  (window as any).__recaptchaResponse = response;
                },
                "expired-callback": () => {
                  console.log(`reCAPTCHA v2 expired for ${containerId}`);
                  (window as any).__recaptchaResponse = "";
                },
                "error-callback": () => {
                  console.log(`reCAPTCHA v2 error for ${containerId}`);
                  (window as any).__recaptchaResponse = "";
                },
              });
              widgetIdRef.current = widgetId;
              setWidgetRendered(true);
              setRenderAttempts(0);
              console.log(
                `reCAPTCHA v2 widget rendered with ID: ${widgetId} in ${containerId}`
              );
              resolve(widgetId);
            } catch (error) {
              console.error("Failed to render reCAPTCHA widget:", error);
              setWidgetRendered(false);
              reject(error);
            }
          });
        }, 100);
      });
    },
    [siteKey]
  );

  const getRecaptchaResponse = useCallback((): string => {
    // First try to get response from the stored global response
    const globalResponse = (window as any).__recaptchaResponse;
    if (globalResponse) {
      console.log(
        "Getting reCAPTCHA response from global storage, length:",
        globalResponse.length
      );
      return globalResponse;
    }

    // Fallback to widget response
    if (!widgetIdRef.current) {
      console.error("No reCAPTCHA widget found - widgetIdRef.current is null");
      console.log("Widget rendered state:", widgetRendered);
      console.log("Is loaded state:", isLoaded);
      console.log("grecaptcha exists:", !!window.grecaptcha);
      console.log("Render attempts:", renderAttempts);
      return "";
    }

    try {
      const response = window.grecaptcha.getResponse(widgetIdRef.current);
      console.log(
        "Getting reCAPTCHA response from widget, length:",
        response.length
      );
      return response;
    } catch (error) {
      console.error("Error getting reCAPTCHA response:", error);
      return "";
    }
  }, [widgetRendered, isLoaded, renderAttempts]);

  const resetRecaptcha = useCallback(() => {
    // Clear the global response
    (window as any).__recaptchaResponse = "";

    if (widgetIdRef.current) {
      try {
        window.grecaptcha.reset(widgetIdRef.current);
        console.log("reCAPTCHA widget reset");
      } catch (error) {
        console.error("Error resetting reCAPTCHA widget:", error);
      }
    }
  }, []);

  const retryRender = useCallback(() => {
    setRenderAttempts((prev) => prev + 1);
    setWidgetRendered(false);
  }, []);

  return {
    renderRecaptcha,
    getRecaptchaResponse,
    resetRecaptcha,
    isLoaded,
    widgetRendered,
    retryRender,
  };
};
