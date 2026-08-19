"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { normalizeIranPhone } from "@/lib/format";

export function LoginForm({
  emailEnabled,
  smsEnabled,
  redirectTo = "/",
}: {
  emailEnabled: boolean;
  smsEnabled: boolean;
  redirectTo?: string;
}) {
  const router = useRouter();
  const onSuccess = () => {
    router.push("/");
    router.refresh();
  };

  if (!emailEnabled && !smsEnabled) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        در حال حاضر هیچ روش ورودی فعال نیست. لطفاً بعداً دوباره تلاش کنید.
      </p>
    );
  }

  if (emailEnabled && !smsEnabled) {
    return <EmailForm mode="login" onSuccess={onSuccess} />;
  }
  if (smsEnabled && !emailEnabled) {
    return <PhoneForm onSuccess={onSuccess} />;
  }

  return (
    <Tabs defaultValue="email">
      <TabsList className="w-full">
        <TabsTrigger value="email">ایمیل</TabsTrigger>
        <TabsTrigger value="phone">شماره موبایل</TabsTrigger>
      </TabsList>
      <TabsContent value="email">
        <EmailForm mode="login" onSuccess={onSuccess} />
      </TabsContent>
      <TabsContent value="phone">
        <PhoneForm onSuccess={onSuccess} />
      </TabsContent>
    </Tabs>
  );
}

export function EmailForm({
  mode,
  onSuccess,
}: {
  mode: "login" | "register";
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } =
      mode === "login"
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ email, password, name });

    setLoading(false);
    if (error) {
      setError(
        mode === "login"
          ? "ایمیل یا رمز عبور اشتباه است."
          : (error.message ?? "ثبت‌نام ناموفق بود."),
      );
      return;
    }
    toast.success(
      mode === "login" ? "خوش آمدید" : "ثبت‌نام با موفقیت انجام شد",
    );
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {mode === "register" && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">نام و نام‌خانوادگی</Label>
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">ایمیل</Label>
        <Input
          id="email"
          type="email"
          dir="ltr"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">رمز عبور</Label>
        <Input
          id="password"
          type="password"
          dir="ltr"
          minLength={8}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={loading} className="mt-2">
        {loading ? "در حال پردازش..." : mode === "login" ? "ورود" : "ثبت‌نام"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {mode === "login" ? (
          <>
            حساب کاربری ندارید؟{" "}
            <Link
              href="/register"
              className="text-foreground underline underline-offset-4"
            >
              ثبت‌نام
            </Link>
          </>
        ) : (
          <>
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link
              href="/login"
              className="text-foreground underline underline-offset-4"
            >
              ورود
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

function PhoneForm({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendCode(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const normalized = normalizeIranPhone(phone);
    const { error } = await authClient.phoneNumber.sendOtp({
      phoneNumber: normalized,
    });
    setLoading(false);
    if (error) {
      setError("ارسال کد ناموفق بود. شماره را بررسی کنید.");
      return;
    }
    setPhone(normalized);
    toast.success("کد تایید ارسال شد");
    setStep("code");
  }

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await authClient.phoneNumber.verify({
      phoneNumber: phone,
      code,
    });
    setLoading(false);
    if (error) {
      setError("کد وارد شده صحیح نیست.");
      return;
    }
    toast.success("خوش آمدید");
    onSuccess();
  }

  if (step === "phone") {
    return (
      <form onSubmit={handleSendCode} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">شماره موبایل</Label>
          <Input
            id="phone"
            type="tel"
            dir="ltr"
            placeholder="09xxxxxxxxx"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? "در حال ارسال..." : "ارسال کد تایید"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerify} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="code">کد تایید</Label>
        <Input
          id="code"
          type="text"
          inputMode="numeric"
          dir="ltr"
          className="text-center tracking-[0.5em]"
          maxLength={6}
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          کد ۶ رقمی به <span className="font-nums">{phone}</span> پیامک شد.
        </p>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={loading} className="mt-2">
        {loading ? "در حال بررسی..." : "تایید و ورود"}
      </Button>
      <button
        type="button"
        onClick={() => setStep("phone")}
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        تغییر شماره
      </button>
    </form>
  );
}
