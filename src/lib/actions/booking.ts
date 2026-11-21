
import type { BookingPayload } from "@/Types";
import { authFetch } from "@/lib/api/authFetch";







// token: string


export async function createBooking(payload: BookingPayload, ) {
  try {
    const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) {
      const error = await res.json().catch(() => null);
      throw new Error(error?.error || error?.message || "Failed to create booking");
    }

    return await res.json(); // { success, data: { redirectUrl } }
  } catch (err) {
    console.error("createBooking failed:", err);
    throw err;
  }
}


// , token: string

export async function confirmPayment(sessionId: string) {
  const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

    },
    body: JSON.stringify({ sessionId }),
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.error || "Payment confirmation failed");
  }
  return res.json();
}