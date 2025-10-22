"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { appConfig } from "@/utils/config";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  useLoginMutation,
  useVerifyOtpMutation,
} from "@/store/features/authentication/authApi";

// ⬇️ shadcn/ui OTP input
// Make sure you have generated this with: npx shadcn@latest add input-otp
// and that you have the dependency "input-otp" installed.
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const OTP_LENGTH = 6;
const COUNTDOWN_SECONDS = 120; // 2 minutes

export function OtpForm({ className, ...props }: React.ComponentProps<"div">) {
  const [otp, setOtp] = React.useState("");
  const [timeLeft, setTimeLeft] = React.useState<number>(COUNTDOWN_SECONDS);
  const [isTicking, setIsTicking] = React.useState<boolean>(true);

  // Pull the email from localStorage (client-only)
  const [email, setEmail] = React.useState<string | null>(null);
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("verificationEmail");
      setEmail(stored);
    } catch (_) {
      setEmail(null);
    }
  }, []);

  const router = useRouter();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useLoginMutation();

  // Countdown
  React.useEffect(() => {
    if (!isTicking) return;
    if (timeLeft <= 0) return;

    const id = window.setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [isTicking, timeLeft]);

  // Stop ticking when we hit 0
  React.useEffect(() => {
    if (timeLeft <= 0) setIsTicking(false);
  }, [timeLeft]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const progressPct = Math.max(
    0,
    Math.min(100, (timeLeft / COUNTDOWN_SECONDS) * 100)
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error("No email found. Please restart verification.");
      return;
    }
    try {
      await verifyOtp({ email, otp }).unwrap();
      localStorage.removeItem("verificationEmail");
      router.push("/login");
      toast.success("Verification successful");
    } catch (error) {
      console.error("Verification failed:", error);
      toast.error("Verification failed");
    }
  };

  const isVerifyDisabled = otp.length !== OTP_LENGTH || isVerifying;
  const canResend = timeLeft <= 0 && !isResending;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        {/* Slim top progress bar that quietly fits into the design */}
        <div className="h-1 w-full bg-muted">
          <div
            className="h-full bg-primary transition-[width] duration-1000 ease-linear"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <CardHeader className="text-center">
          <CardTitle className="text-xl">Verify Email</CardTitle>
          <CardDescription>Login to {appConfig.COMMUNITY_NAME}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="flex flex-col justify-center items-center gap-4">
              <Label htmlFor="otp">Enter OTP</Label>

              {/* shadcn InputOTP */}
              <div className="flex w-full items-center justify-center">
                <InputOTP
                  id="otp"
                  maxLength={OTP_LENGTH}
                  value={otp}
                  onChange={setOtp}
                  containerClassName="w-full"
                >
                  <InputOTPGroup className="mx-auto">
                    {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {/* Timer + Resend */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Time remaining:{" "}
                  <span className="tabular-nums font-medium text-foreground">
                    {formatTime(timeLeft)}
                  </span>
                </span>
                {/* <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResend}
                  disabled={!canResend}
                  className="h-8"
                >
                  {isResending ? "Resending..." : "Resend code"}
                </Button> */}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isVerifyDisabled}
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
