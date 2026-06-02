import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useCallback, useRef, useEffect } from "react";
import {
  Mail,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  ChevronLeft,
  GraduationCap,
} from "lucide-react";

export const Route = createFileRoute("/signup")({
  component: SignupRoute,
});

const EMAIL_REGEX = /^[^\s@]+@efrei\.net$/;
const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { label: "One number", test: (v: string) => /\d/.test(v) },
  { label: "One special character", test: (v: string) => /[!@#$%^&*(),.?":{}|<>_\-+]/.test(v) },
];

const USER_KEY = "eat_user_profile";
const CREDENTIALS_KEY = "eat_user_credentials";
const PROFILES_KEY = "eat_user_profiles";
const SEEDED_KEY = "eat_seeded";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 600000, hash: "SHA-256" },
    key,
    256
  );
  const hash = new Uint8Array(bits);
  const saltHex = Array.from(salt).map((b) => b.toString(16).padStart(2, "0")).join("");
  const hashHex = Array.from(hash).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${saltHex}:${hashHex}`;
}

async function seedAccounts() {
  if (localStorage.getItem(SEEDED_KEY)) return;
  const credentials = JSON.parse(localStorage.getItem(CREDENTIALS_KEY) || "{}");
  const profiles = JSON.parse(localStorage.getItem(PROFILES_KEY) || "{}");
  const adminHash = await hashPassword("Azerty123*");
  const userHash = await hashPassword("Azertyuiop123*");
  credentials["lucas.guillemin@efrei.net"] = adminHash;
  credentials["ryiad.larbaoui@efrei.net"] = userHash;
  profiles["lucas.guillemin@efrei.net"] = {
    firstName: "Lucas",
    lastName: "Guillemin",
    nickname: "@lucasg",
    avatar: "",
    isAdmin: true,
  };
  profiles["ryiad.larbaoui@efrei.net"] = {
    firstName: "Riyad",
    lastName: "Larbaoui",
    nickname: "@riyadl",
    avatar: "",
    isAdmin: false,
  };
  const groups = JSON.parse(localStorage.getItem("eat_groups") || "{}");
  groups["g1"] = {
    id: "g1",
    name: "EFREI Esports",
    owner: "lucas.guillemin@efrei.net",
    members: ["lucas.guillemin@efrei.net", "ryiad.larbaoui@efrei.net"],
  };
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  localStorage.setItem("eat_groups", JSON.stringify(groups));
  localStorage.setItem(SEEDED_KEY, "true");
}

function SignupRoute() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "details" | "verify">("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifyCode, setVerifyCode] = useState(["", "", "", "", "", ""]);
  const [verifyError, setVerifyError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const verificationCode = useRef<string>("");

  useEffect(() => { seedAccounts(); }, []);
  useEffect(() => {
    const existing = localStorage.getItem(USER_KEY);
    if (existing) {
      const parsed = JSON.parse(existing);
      if (parsed.email && parsed.email !== "alex.kim@example.com") {
        navigate({ to: "/" });
      }
    }
  }, [navigate]);

  const validateEmail = useCallback((value: string) => {
    if (!value.trim()) {
      setEmailError("Email is required");
      return false;
    }
    if (!EMAIL_REGEX.test(value)) {
      setEmailError("Use your EFREI email (@efrei.net)");
      return false;
    }
    setEmailError("");
    return true;
  }, []);

  const validateFirstName = useCallback((value: string) => {
    if (!value.trim()) {
      setFirstNameError("First name is required");
      return false;
    }
    setFirstNameError("");
    return true;
  }, []);

  const validateLastName = useCallback((value: string) => {
    if (!value.trim()) {
      setLastNameError("Last name is required");
      return false;
    }
    setLastNameError("");
    return true;
  }, []);

  const validatePassword = useCallback((value: string) => {
    if (!value) {
      setPasswordError("Password is required");
      return false;
    }
    const failed = PASSWORD_RULES.find((r) => !r.test(value));
    if (failed) {
      setPasswordError(`Password needs: ${failed.label.toLowerCase()}`);
      return false;
    }
    setPasswordError("");
    return true;
  }, []);

  const validateConfirmPassword = useCallback((value: string) => {
    if (!value) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    }
    if (value !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  }, [password]);

  const handleEmailContinue = () => {
    if (!validateEmail(email)) return;
    const credentials = JSON.parse(localStorage.getItem(CREDENTIALS_KEY) || "{}");
    if (credentials[email]) {
      navigate({ to: "/login" });
      return;
    }
    verificationCode.current = Math.floor(100000 + Math.random() * 900000).toString();
    setStep("details");
    setPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setConfirmPasswordError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isFirstValid = validateFirstName(firstName);
    const isLastValid = validateLastName(lastName);
    const isPassValid = validatePassword(password);
    const isConfirmValid = validateConfirmPassword(confirmPassword);
    if (!isFirstValid || !isLastValid || !isPassValid || !isConfirmValid) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800));
    setIsSubmitting(false);
    setStep("verify");
  };

  const handleVerify = async () => {
    const code = verifyCode.join("");
    if (code.length !== 6) {
      setVerifyError("Enter the full 6-digit code");
      return;
    }
    setIsVerifying(true);
    setVerifyError("");
    await new Promise((r) => setTimeout(r, 1000));
    if (code === verificationCode.current) {
      const userProfile = {
        firstName,
        lastName: lastName || "User",
        nickname: `@${firstName.toLowerCase()}${lastName ? "_" + lastName.toLowerCase() : ""}`,
        email: email,
        avatar: "",
        isAdmin: false,
      };
      const passwordHash = await hashPassword(password);
      const credentials = JSON.parse(localStorage.getItem(CREDENTIALS_KEY) || "{}");
      credentials[email] = passwordHash;
      const profiles = JSON.parse(localStorage.getItem(PROFILES_KEY) || "{}");
      profiles[email] = {
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        nickname: userProfile.nickname,
        avatar: userProfile.avatar,
        isAdmin: userProfile.isAdmin,
      };
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
      localStorage.setItem(USER_KEY, JSON.stringify(userProfile));
      window.dispatchEvent(new Event("user-updated"));
      navigate({ to: "/" });
    } else {
      setVerifyError("Incorrect code. Please try again.");
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    await new Promise((r) => setTimeout(r, 1000));
    verificationCode.current = Math.floor(100000 + Math.random() * 900000).toString();
    setResending(false);
  };

  const handleCodeInput = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const newCode = [...verifyCode];
    newCode[index] = value;
    setVerifyCode(newCode);
    setVerifyError("");
    if (value && index < 5) {
      const next = document.getElementById(`code-${index + 1}`);
      next?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verifyCode[index] && index > 0) {
      const prev = document.getElementById(`code-${index - 1}`);
      prev?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!data) return;
    const newCode = [...verifyCode];
    for (let i = 0; i < data.length; i++) {
      newCode[i] = data[i];
    }
    setVerifyCode(newCode);
    const nextIndex = Math.min(data.length, 5);
    const next = document.getElementById(`code-${nextIndex}`);
    next?.focus();
  };

  const isEmailValid = email.trim() && EMAIL_REGEX.test(email);

  return (
    <main className="min-h-screen pb-24 pt-[80px]">
      <div className="max-w-sm mx-auto px-4 pt-8 md:pt-12">
        {step === "email" && (
          <div className="rise-in">
            <div className="text-center mb-10">
              <h1 className="text-[2.5rem] font-serif font-medium tracking-tight leading-none text-zinc-900 dark:text-white">
                Join EAT.
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-3 leading-relaxed">
                Discover events, save your favourites, and never miss what's happening in your city.
              </p>
            </div>

              <div className="mb-2 h-2" />

            <div>
              <div className="flex items-center gap-2 mb-3 ml-1">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--ember)]/10 border border-[var(--ember)]/20">
                  <GraduationCap className="w-3 h-3 text-[var(--ember)]" />
                  <span className="text-[11px] font-bold text-[var(--ember)] tracking-wide">EFREI</span>
                </div>
                <span className="text-xs text-zinc-400 dark:text-zinc-500">students only</span>
              </div>
              <label htmlFor="signup-email" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 ml-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) validateEmail(e.target.value);
                  }}
                  onBlur={() => validateEmail(email)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && isEmailValid) handleEmailContinue();
                  }}
                  placeholder="firstname.lastname@efrei.net"
                  autoComplete="email"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)] focus:border-transparent transition-all shadow-sm"
                />
              </div>
              {emailError && (
                <p id="email-error" className="text-xs text-red-500 mt-2 ml-1" role="alert">
                  {emailError}
                </p>
              )}
              <button
                onClick={handleEmailContinue}
                disabled={!isEmailValid}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-bold text-[15px] mt-4 bg-[var(--ember)] hover:bg-[var(--ember)]/90 text-white shadow-lg shadow-[var(--ember)]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-8 leading-relaxed">
              By continuing, you agree to our{" "}
              <a href="#" className="text-[var(--ember)] hover:underline">Terms</a>{" "}
              and{" "}
              <a href="#" className="text-[var(--ember)] hover:underline">Privacy Policy</a>.
            </p>
          </div>
        )}

        {step === "details" && (
          <div className="rise-in">
            <button
              onClick={() => setStep("email")}
              className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors mb-6"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <div className="mb-8">
              <h1 className="text-[2rem] font-serif font-medium tracking-tight leading-none text-zinc-900 dark:text-white">
                Create your account
              </h1>
              <div className="flex items-center gap-2 mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{email}</span>
                <button
                  onClick={() => setStep("email")}
                  className="text-[var(--ember)] hover:underline text-xs font-medium ml-1 shrink-0"
                >
                  Change
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="first-name" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 ml-1">
                  First name
                </label>
                <input
                  id="first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (firstNameError) validateFirstName(e.target.value);
                  }}
                  onBlur={() => validateFirstName(firstName)}
                  autoComplete="given-name"
                  aria-invalid={!!firstNameError}
                  aria-describedby={firstNameError ? "first-name-error" : undefined}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl px-4 py-3.5 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)] focus:border-transparent transition-all shadow-sm"
                  placeholder="Alex"
                />
                {firstNameError && (
                  <p id="first-name-error" className="text-xs text-red-500 mt-2 ml-1" role="alert">
                    {firstNameError}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="last-name" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 ml-1">
                  Surname
                </label>
                <input
                  id="last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (lastNameError) validateLastName(e.target.value);
                  }}
                  onBlur={() => validateLastName(lastName)}
                  autoComplete="family-name"
                  aria-invalid={!!lastNameError}
                  aria-describedby={lastNameError ? "last-name-error" : undefined}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl px-4 py-3.5 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)] focus:border-transparent transition-all shadow-sm"
                  placeholder="Kim"
                />
                {lastNameError && (
                  <p id="last-name-error" className="text-xs text-red-500 mt-2 ml-1" role="alert">
                    {lastNameError}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 ml-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError || e.target.value) validatePassword(e.target.value);
                      if (confirmPassword) validateConfirmPassword(confirmPassword);
                    }}
                    onBlur={() => validatePassword(password)}
                    autoComplete="new-password"
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? "password-error" : undefined}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl px-4 py-3.5 pr-12 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)] focus:border-transparent transition-all shadow-sm"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p id="password-error" className="text-xs text-red-500 mt-2 ml-1" role="alert">
                    {passwordError}
                  </p>
                )}
                {password && (
                  <div className="mt-3 space-y-1.5 ml-1">
                    {PASSWORD_RULES.map((rule) => {
                      const passed = rule.test(password);
                      return (
                        <div key={rule.label} className="flex items-center gap-2 text-xs">
                          <div
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${
                              passed
                                ? "bg-green-500 text-white"
                                : "bg-zinc-200 dark:bg-zinc-700 text-zinc-400"
                            }`}
                          >
                            {passed && <Check className="w-2.5 h-2.5" />}
                          </div>
                          <span
                            className={
                              passed
                                ? "text-green-600 dark:text-green-400"
                                : "text-zinc-500 dark:text-zinc-400"
                            }
                          >
                            {rule.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 ml-1">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (confirmPasswordError) validateConfirmPassword(e.target.value);
                    }}
                    onBlur={() => validateConfirmPassword(confirmPassword)}
                    autoComplete="new-password"
                    aria-invalid={!!confirmPasswordError}
                    aria-describedby={confirmPasswordError ? "confirm-password-error" : undefined}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl px-4 py-3.5 pr-12 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)] focus:border-transparent transition-all shadow-sm"
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPasswordError && (
                  <p id="confirm-password-error" className="text-xs text-red-500 mt-2 ml-1" role="alert">
                    {confirmPasswordError}
                  </p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-bold text-[15px] bg-[var(--ember)] hover:bg-[var(--ember)]/90 text-white shadow-lg shadow-[var(--ember)]/20 transition-all duration-300 disabled:opacity-80 disabled:cursor-wait"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-[var(--ember)] font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        )}

        {step === "verify" && (
          <div className="rise-in">
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-full bg-[var(--ember)]/10 flex items-center justify-center mx-auto mb-5">
                <Mail className="w-7 h-7 text-[var(--ember)]" />
              </div>
              <h1 className="text-[2rem] font-serif font-medium tracking-tight leading-none text-zinc-900 dark:text-white mb-3">
                Check your email
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                We sent a 6-digit verification code to
              </p>
              <p className="text-zinc-900 dark:text-white font-medium text-sm mt-1">
                {email}
              </p>
              <button
                onClick={() => setStep("email")}
                className="text-[var(--ember)] hover:underline text-xs font-medium mt-2"
              >
                Wrong email? Change it
              </button>
            </div>

            <div className="flex justify-center gap-2.5 mb-6">
              {verifyCode.map((digit, i) => (
                <input
                  key={i}
                  id={`code-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeInput(i, e.target.value)}
                  onKeyDown={(e) => handleCodeKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  autoComplete="one-time-code"
                  aria-label={`Digit ${i + 1} of verification code`}
                  className={`w-11 h-12 text-center text-lg font-bold rounded-xl border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--ember)] focus:border-transparent transition-all shadow-sm ${
                    verifyError
                      ? "border-red-400 dark:border-red-500"
                      : "border-zinc-200 dark:border-white/10"
                  }`}
                />
              ))}
            </div>

            {verifyError && (
              <p className="text-xs text-red-500 text-center mb-4" role="alert">
                {verifyError}
              </p>
            )}

            <button
              onClick={handleVerify}
              disabled={verifyCode.join("").length !== 6 || isVerifying}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-bold text-[15px] bg-[var(--ember)] hover:bg-[var(--ember)]/90 text-white shadow-lg shadow-[var(--ember)]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                "Verify email"
              )}
            </button>

            <div className="text-center mt-6">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Didn't get the code?{" "}
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="text-[var(--ember)] font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resending ? "Sending..." : "Resend"}
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
