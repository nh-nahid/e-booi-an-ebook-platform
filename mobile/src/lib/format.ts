const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export const bn = (value: number | string): string =>
  String(value).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);

export const taka = (value: number): string => {
  const rounded = Math.round((value + Number.EPSILON) * 100) / 100;
  return `৳${bn(rounded.toLocaleString("en-US"))}`;
};

export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return bn(
    d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  );
};

export function errorMessage(error: unknown, fallback = "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।"): string {
  const e = error as {
    response?: { data?: { message?: string } };
    message?: string;
    code?: string;
  };
  const server = e?.response?.data?.message;
  if (server) return server;
  if (e?.code === "ERR_NETWORK") return "ইন্টারনেট সংযোগ বা সার্ভারে সমস্যা। আবার চেষ্টা করুন।";
  return fallback;
}
