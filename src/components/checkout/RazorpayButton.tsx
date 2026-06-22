"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createRazorpayOrderAction,
  verifyPaymentAction,
} from "@/lib/actions/payment-actions";

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};
type RazorpayOptions = {
  key: string;
  order_id: string;
  amount?: number;
  currency?: string;
  name: string;
  description?: string;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
  handler: (r: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
};
interface RazorpayInstance {
  open(): void;
  on(event: string, cb: (...args: unknown[]) => void): void;
}
declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function RazorpayButton({
  addressId,
  items,
  prefill,
  disabled,
  onPaid,
}: {
  addressId: string;
  items: { bookId: string; quantity: number }[];
  prefill?: { name?: string; email?: string };
  disabled?: boolean;
  onPaid?: () => void;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setError(null);
    if (!addressId) {
      setError("Please select a shipping address.");
      return;
    }
    setPending(true);

    const loaded = await loadRazorpay();
    if (!loaded || !window.Razorpay) {
      setError("Could not load the payment gateway. Check your connection.");
      setPending(false);
      return;
    }

    const res = await createRazorpayOrderAction({ addressId, items });
    if (!res.ok || !res.razorpayOrderId || !res.keyId) {
      setError(res.error ?? "Could not start payment.");
      setPending(false);
      return;
    }

    const rzp = new window.Razorpay({
      key: res.keyId,
      order_id: res.razorpayOrderId,
      amount: res.amount,
      currency: res.currency,
      name: "Publish With Vaishu",
      description: "Academic books",
      prefill: { name: prefill?.name, email: prefill?.email },
      theme: { color: "#000000" },
      handler: async (resp) => {
        const v = await verifyPaymentAction({
          addressId,
          items,
          razorpayOrderId: resp.razorpay_order_id,
          razorpayPaymentId: resp.razorpay_payment_id,
          razorpaySignature: resp.razorpay_signature,
        });
        if (v.ok && v.orderId) {
          onPaid?.();
          router.push(`/payment/success?order=${v.orderId}`);
        } else {
          router.push("/payment/failed?reason=verify");
        }
      },
      modal: { ondismiss: () => setPending(false) },
    });
    rzp.on("payment.failed", () => router.push("/payment/failed?reason=failed"));
    rzp.open();
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="button"
        onClick={pay}
        disabled={pending || disabled}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-ink/90 disabled:opacity-60"
      >
        {pending ? "Opening payment…" : "Pay online"}
      </button>
    </div>
  );
}
