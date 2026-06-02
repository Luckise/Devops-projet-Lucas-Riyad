import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import {
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  ChevronLeft,
  LogIn,
  GraduationCap,
} from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginRoute,
});

const EMAIL_REGEX = /^[^\s@]+@efrei\.net$/;
const USER_KEY = "eat_user_profile";
const CREDENTIALS_KEY = "eat_user_credentials";
const PROFILES_KEY = "eat_user_profiles";
const SEEDED_KEY = "eat_seeded";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
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

function LoginRoute() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validatePassword = useCallback((value: string) => {
    if (!value) {
      setPasswordError("Password is required");
      return false;
    }
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    setPasswordError("");
    return true;
  }, []);

  const handleEmailContinue = () => {
    if (!validateEmail(email)) return;
    setStep("password");
    setPassword("");
    setPasswordError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword(password)) return;
    setIsSubmitting(true);
    setLoginError("");
    await new Promise((r) => setTimeout(r, 1200));
    const credentials = JSON.parse(localStorage.getItem(CREDENTIALS_KEY) || "{}");
    const storedHash = credentials[email];
    if (!storedHash) {
      setLoginError("No account found with this email. Please sign up.");
      setIsSubmitting(false);
      return;
    }
    const inputHash = await hashPassword(password);
    if (inputHash !== storedHash) {
      setLoginError("Incorrect password. Please try again.");
      setIsSubmitting(false);
      return;
    }
    const profiles = JSON.parse(localStorage.getItem(PROFILES_KEY) || "{}");
    const profile = profiles[email] || { firstName: "User", lastName: "User", nickname: "@user", avatar: "", isAdmin: false };
    localStorage.setItem(USER_KEY, JSON.stringify({ ...profile, email }));
    window.dispatchEvent(new Event("user-updated"));
    setIsSubmitting(false);
    navigate({ to: "/" });
  };

  const isEmailValid = email.trim() && EMAIL_REGEX.test(email);

  return (
    <main className="min-h-screen pb-24 pt-[80px]">
      <div className="max-w-sm mx-auto px-4 pt-8 md:pt-12">
        {step === "email" && (
          <div className="rise-in">
            <div className="text-center mb-10">
              <h1 className="text-[2.5rem] font-serif font-medium tracking-tight leading-none text-zinc-900 dark:text-white">
                Welcome back
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-3 leading-relaxed">
                Sign in to access your events, tickets, and saved favourites.
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
              <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 ml-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
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

            <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[var(--ember)] font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        )}

        {step === "password" && (
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
                Enter your password
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
              {loginError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl px-4 py-3">
                  <p className="text-xs text-red-600 dark:text-red-400 text-center font-medium" role="alert">
                    {loginError}
                  </p>
                </div>
              )}
              <div>
                <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 ml-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) validatePassword(e.target.value);
                    }}
                    onBlur={() => validatePassword(password)}
                    autoComplete="current-password"
                    aria-invalid={!!passwordError || !!loginError}
                    aria-describedby={passwordError ? "password-error" : loginError ? "login-error" : undefined}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl px-4 py-3.5 pr-12 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)] focus:border-transparent transition-all shadow-sm"
                    placeholder="Enter your password"
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
              </div>

              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-[var(--ember)] dark:hover:text-[var(--ember)] transition-colors font-medium"
                >
                  Forgot password?
                </a>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !password}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-bold text-[15px] bg-[var(--ember)] hover:bg-[var(--ember)]/90 text-white shadow-lg shadow-[var(--ember)]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign in</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[var(--ember)] font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
