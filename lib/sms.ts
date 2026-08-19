type SendSmsResult = { success: boolean };

/**
 * SMS provider abstraction — the one seam to touch when connecting a real
 * provider (Kavenegar / Ghasedak / SMS.ir / ...), matching how the payment
 * gateway is wired later (see lib/payment/).
 *
 * Until SMS_PROVIDER_API_KEY is set, OTP codes are only logged to the
 * server console — safe for local development, no SMS account needed.
 */
async function sendSms(to: string, text: string): Promise<SendSmsResult> {
  const apiKey = process.env.SMS_PROVIDER_API_KEY;

  if (!apiKey) {
    console.log(`[SMS · DEV MODE] → ${to}: ${text}`);
    return { success: true };
  }

  // Replace this block with the chosen provider's real API call. Example
  // shape for Kavenegar (https://kavenegar.com/rest.html):
  //
  //   const res = await fetch(
  //     `https://api.kavenegar.com/v1/${apiKey}/sms/send.json`,
  //     {
  //       method: "POST",
  //       headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //       body: new URLSearchParams({
  //         receptor: to,
  //         sender: process.env.SMS_PROVIDER_SENDER ?? "",
  //         message: text,
  //       }),
  //     }
  //   );
  //   return { success: res.ok };

  console.warn(
    "SMS_PROVIDER_API_KEY تنظیم شده ولی پیاده‌سازی واقعی سرویس هنوز در lib/sms.ts اضافه نشده."
  );
  return { success: false };
}

export async function sendOtpSms(phoneNumber: string, code: string) {
  return sendSms(phoneNumber, `کد ورود شما به هاشور: ${code}`);
}
