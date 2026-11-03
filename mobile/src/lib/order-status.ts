export type Tone = "success" | "warn" | "danger" | "info";

export const paymentTone = (s: string): { label: string; tone: Tone } =>
  s === "paid"
    ? { label: "পরিশোধিত", tone: "success" }
    : s === "failed"
      ? { label: "ব্যর্থ", tone: "danger" }
      : { label: "পেমেন্ট বাকি", tone: "warn" };
