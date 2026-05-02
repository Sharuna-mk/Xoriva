import { useEffect, useState, type JSX } from "react";
import { motion } from "motion/react";
import {
  ShoppingBag,
  Package,
  Truck,
  Shield,
  ShoppingCart,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  getUserList,
  RegSendOTP,
  RegVerifyOTP,
  Register,
  loginPass,
  loginSendOTP,
  loginOTP,
  saveToken,
} from "../services/allAPI";
import { useNavigate } from "react-router";
import GoogleLogin from "./GoogleLogin";


type Step = "email" | "login-password" | "login-otp" | "reg-verify" | "reg-form";
type ToastType = "success" | "error" | "info";


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(v: string): string {
  if (!v.trim()) return "Email is required";
  if (!emailRegex.test(v)) return "Enter a valid email address";
  return "";
}

function validatePassword(v: string): string {
  if (!v) return "Password is required";
  if (v.length < 6) return "Minimum 6 characters";
  if (!/[A-Z]/.test(v)) return "At least one uppercase letter";
  if (!/[0-9]/.test(v)) return "At least one number";
  return "";
}

function validateUsername(v: string): string {
  if (!v.trim()) return "Username is required";
  if (v.trim().length < 3) return "At least 3 characters";
  if (/\s/.test(v)) return "No spaces allowed";
  return "";
}

function validateConfirm(pass: string, confirm: string): string {
  if (!confirm) return "Please confirm your password";
  if (pass !== confirm) return "Passwords do not match";
  return "";
}



interface ToastProps {
  msg: string;
  type: ToastType;
}

function Toast({ msg, type }: ToastProps) {
  if (!msg) return null;
  const colours: Record<ToastType, string> = {
    success: "bg-green-50 border-green-400 text-green-800",
    error: "bg-red-50   border-red-400   text-red-800",
    info: "bg-gray-50  border-gray-400  text-gray-800",
  };
  const Icon = type === "success" ? CheckCircle2 : AlertCircle;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-2 border rounded-lg px-4 py-2.5 text-sm font-medium mb-4 ${colours[type]}`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {msg}
    </motion.div>
  );
}



function FieldError({ msg }: { msg: string | false | undefined }) {
  if (!msg) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -2 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-xs text-red-500 mt-1 flex items-center gap-1"
    >
      <AlertCircle className="w-3 h-3 shrink-0" />
      {msg}
    </motion.p>
  );
}

interface InputWrapperProps {
  error: string | false | undefined;
  touched: boolean | undefined;
  children: React.ReactNode;
}

function InputWrapper({ error, touched, children }: InputWrapperProps) {
  const border =
    touched && error
      ? "border-red-400 focus-within:ring-red-100"
      : touched && !error
        ? "border-green-400 focus-within:ring-green-100"
        : "border-gray-300 focus-within:border-black focus-within:ring-gray-100";
  return (
    <div
      className={`flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 transition ${border}`}
    >
      {children}
    </div>
  );
}



interface OtpInputProps {
  value: string;
  onChange: (val: string) => void;
  error: string;
  touched: boolean | undefined;
}

function OtpInput({ value, onChange, error, touched }: OtpInputProps) {
  const border =
    touched && error
      ? "border-red-400"
      : value.length === 6
        ? "border-green-400"
        : "border-gray-300";

  return (
    <div className="relative">
      <div className="grid grid-cols-6 gap-2">
        {Array(6)
          .fill("")
          .map((_, i) => (
            <div
              key={i}
              className={`h-12 border-2 rounded-lg flex items-center justify-center font-bold text-lg transition-colors ${value[i] ? "border-black bg-gray-100" : border + " bg-white"
                }`}
            >
              {value[i] || ""}
            </div>
          ))}
      </div>
      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10"
        autoFocus
      />
    </div>
  );
}


function Auth({ register = false }: { register?: boolean }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const touch = (field: string) => setTouched((p) => ({ ...p, [field]: true }));

  const [step, setStep] = useState<Step>("email");
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: ToastType }>({ msg: "", type: "info" });

  const [regOtpTimer, setRegOtpTimer] = useState(0);
  const [loginOtpTimer, setLoginOtpTimer] = useState(0);

  useEffect(() => {
    if (regOtpTimer <= 0) return;
    const id = setInterval(() => setRegOtpTimer((p) => p - 1), 1000);
    return () => clearInterval(id);
  }, [regOtpTimer]);

  useEffect(() => {
    if (loginOtpTimer <= 0) return;
    const id = setInterval(() => setLoginOtpTimer((p) => p - 1), 1000);
    return () => clearInterval(id);
  }, [loginOtpTimer]);

  const showToast = (msg: string, type: ToastType = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "info" }), 4000);
  };

  useEffect(() => { setTouched({}); }, [step]);

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    username: validateUsername(username),
    confirmPassword: validateConfirm(password, confirmPassword),
    otp: otp.length > 0 && otp.length < 6 ? "Enter all 6 digits" : "",
  };



  const handleContinue = async () => {
    touch("email");
    if (errors.email) return showToast(errors.email, "error");

    setLoadingCheck(true);
    try {
      const res = await getUserList({ email });
      const isVerified = res?.user?.isVerified ?? false;
      if (isVerified) {
        setStep("login-password");
      } else {
        await sendRegistrationOtp();
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 400 || status === 404) {
        await sendRegistrationOtp();
      } else {
        showToast(err?.response?.data?.message ?? "Something went wrong.", "error");
      }
    } finally {
      setLoadingCheck(false);
    }
  };

  const sendRegistrationOtp = async () => {
    setLoadingRegister(true);
    try {
      await RegSendOTP({ email });
      setRegOtpTimer(30);
      setOtp("");
      setStep("reg-verify");
      showToast("OTP sent! Check your email.", "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? "Failed to send OTP.", "error");
    } finally {
      setLoadingRegister(false);
    }
  };

  const handleVerifyRegistrationOtp = async () => {
    touch("otp");
    if (otp.length !== 6) return showToast("Enter a 6-digit OTP", "error");

    setLoadingRegister(true);
    try {
      const res = await RegVerifyOTP({ email, otp });
      if (res?.user?.otpVerified) {
        showToast("Email verified! Complete your profile.", "success");
        setOtp("");
        setStep("reg-form");
      } else {
        showToast(res?.message ?? "Verification failed.", "error");
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? "Invalid or expired OTP.", "error");
    } finally {
      setLoadingRegister(false);
    }
  };

  const handleRegister = async () => {
    touch("username"); touch("password"); touch("confirmPassword");
    if (errors.username || errors.password || errors.confirmPassword) {
      return showToast("Please fix the errors above.", "error");
    }

    setLoadingRegister(true);
    try {
      const res = await Register({ username, email, password });
      showToast(res?.message ?? "Account created!", "success");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? "Registration failed.", "error");
    } finally {
      setLoadingRegister(false);
    }
  };

  const handleLoginPassword = async () => {
    touch("password");
    if (!password) return showToast("Please enter your password", "error");

    setLoadingPassword(true);
    try {
      const res = await loginPass({ email, password });
      const token = res?.token;
      if (!token) throw new Error("No token received");
      saveToken(token);
      showToast("Login successful!", "success");
      setTimeout(() => navigate("/"), 800);
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? "Invalid credentials.", "error");
    } finally {
      setLoadingPassword(false);
    }
  };

  const sendLoginOtp = async () => {
    setLoadingOtp(true);
    try {
      await loginSendOTP({ email });
      setLoginOtpTimer(30);
      setOtp("");
      setStep("login-otp");
      showToast("OTP sent! Check your email.", "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? "Failed to send OTP.", "error");
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleLoginOtp = async () => {
    touch("otp");
    if (otp.length !== 6) return showToast("Enter a 6-digit OTP", "error");

    setLoadingOtp(true);
    try {
      const res = await loginOTP({ email, otp });
      const token = res?.token;
      if (!token) throw new Error("No token received");
      sessionStorage.setItem("Token", token);
      saveToken(token);
      showToast("Login successful!", "success");
      setTimeout(() => navigate("/"), 800);
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? "Invalid or expired OTP.", "error");
    } finally {
      setLoadingOtp(false);
    }
  };



  const renderEmailStep = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Email address
        </label>
        <InputWrapper error={errors.email} touched={touched["email"]}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => touch("email")}
            onKeyDown={(e) => e.key === "Enter" && handleContinue()}
            type="email"
            placeholder="you@example.com"
            className="w-full outline-none text-sm bg-transparent"
          />
          {touched["email"] && !errors.email && (
            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
          )}
        </InputWrapper>
        <FieldError msg={touched["email"] && errors.email} />
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={loadingCheck}
        className="w-full bg-black hover:bg-gray-800 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition"
      >
        {loadingCheck ? "Checking…" : "Continue"}
      </button>
    </div>
  );

  const renderLoginPasswordStep = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
        <div className="flex items-center border border-gray-200 bg-gray-50 rounded-lg px-3 py-2">
          <span className="text-sm text-gray-500 truncate">{email}</span>
          <button
            type="button"
            onClick={() => { setStep("email"); setPassword(""); setOtp(""); }}
            className="ml-auto text-xs text-black underline shrink-0"
          >
            Change
          </button>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
        <InputWrapper
          error={touched["password"] && !password ? "Required" : ""}
          touched={touched["password"]}
        >
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => touch("password")}
            onKeyDown={(e) => e.key === "Enter" && handleLoginPassword()}
            placeholder="Enter your password"
            className="w-full outline-none text-sm bg-transparent"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </InputWrapper>
        <FieldError msg={touched["password"] && !password && "Password is required"} />
        <p className="text-sm text-black cursor-pointer hover:underline mt-1 text-end font-medium">
          Forgot password?
        </p>
      </div>

      <button
        type="button"
        onClick={handleLoginPassword}
        disabled={loadingPassword || loadingOtp}
        className="w-full bg-black hover:bg-gray-800 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition"
      >
        {loadingPassword ? "Signing in…" : "Login"}
      </button>

      <button
        type="button"
        onClick={sendLoginOtp}
        disabled={loadingOtp || loadingPassword}
        className="w-full border border-black text-black font-medium py-2.5 rounded-lg hover:bg-gray-50 transition text-sm"
      >
        {loadingOtp ? "Sending…" : "Login with OTP instead"}
      </button>
    </div>
  );

  const renderLoginOtpStep = () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 text-center">
        OTP sent to <span className="font-medium text-gray-700">{email}</span>
        <br />Valid for 5 minutes.
      </p>

      <OtpInput value={otp} onChange={setOtp} error={errors.otp} touched={touched["otp"]} />
      <FieldError msg={touched["otp"] && errors.otp} />

      <button
        type="button"
        onClick={handleLoginOtp}
        disabled={loadingOtp}
        className="w-full bg-black hover:bg-gray-800 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition"
      >
        {loadingOtp ? "Verifying…" : "Verify & Login"}
      </button>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => { setStep("login-password"); setOtp(""); }}
          className="text-sm text-gray-500 hover:underline"
        >
          ← Use password instead
        </button>
        <button
          type="button"
          onClick={sendLoginOtp}
          disabled={loginOtpTimer > 0 || loadingOtp}
          className="text-sm text-black underline disabled:opacity-40"
        >
          {loginOtpTimer > 0 ? `Resend in ${loginOtpTimer}s` : "Resend OTP"}
        </button>
      </div>
    </div>
  );

  const renderRegVerifyStep = () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 text-center">
        OTP sent to <span className="font-medium text-gray-700">{email}</span>
        <br />Enter it below to verify your email.
      </p>

      <OtpInput value={otp} onChange={setOtp} error={errors.otp} touched={touched["otp"]} />
      <FieldError msg={touched["otp"] && errors.otp} />

      <button
        type="button"
        onClick={handleVerifyRegistrationOtp} disabled={loadingRegister}
        className="w-full bg-black hover:bg-gray-800 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition"
      >
        {loadingRegister  ? "Verifying…" : "Verify Email"}
      </button>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => { setStep("email"); setOtp(""); }}
          className="text-sm text-gray-500 hover:underline"
        >
          ← Change email
        </button>
        <button
          type="button"
          onClick={sendRegistrationOtp}
          disabled={regOtpTimer > 0 || loadingRegister}
          className="text-sm text-black underline disabled:opacity-40"
        >
          {regOtpTimer > 0 ? `Resend in ${regOtpTimer}s` : "Resend OTP"}
        </button>
      </div>
    </div>
  );

  const renderRegFormStep = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
        <div className="flex items-center border border-gray-200 bg-gray-50 rounded-lg px-3 py-2">
          <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 shrink-0" />
          <span className="text-sm text-gray-500 truncate">{email}</span>
          <span className="ml-auto text-xs text-green-600 font-medium shrink-0">Verified ✓</span>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Username</label>
        <InputWrapper error={errors.username} touched={touched["username"]}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => touch("username")}
            type="text"
            placeholder="Choose a username"
            className="w-full outline-none text-sm bg-transparent"
          />
          {touched["username"] && !errors.username && (
            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
          )}
        </InputWrapper>
        <FieldError msg={touched["username"] && errors.username} />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
        <InputWrapper error={errors.password} touched={touched["password"]}>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => touch("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Min. 6 chars, 1 uppercase, 1 number"
            className="w-full outline-none text-sm bg-transparent"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </InputWrapper>
        <FieldError msg={touched["password"] && errors.password} />

        {password && (
          <div className="mt-2 space-y-1">
            <div className="flex gap-1">
              {[
                password.length >= 6,
                /[A-Z]/.test(password),
                /[0-9]/.test(password),
                /[^a-zA-Z0-9]/.test(password),
              ].map((ok, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${ok ? "bg-black" : "bg-gray-200"}`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400">
              {password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)
                ? "Strong password"
                : password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password)
                  ? "Good — add a symbol for extra strength"
                  : "Weak — add uppercase, numbers, symbols"}
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Confirm password</label>
        <InputWrapper error={errors.confirmPassword} touched={touched["confirmPassword"]}>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => touch("confirmPassword")}
            type="password"
            placeholder="Re-enter password"
            className="w-full outline-none text-sm bg-transparent"
          />
          {touched["confirmPassword"] && !errors.confirmPassword && confirmPassword && (
            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
          )}
        </InputWrapper>
        <FieldError msg={touched["confirmPassword"] && errors.confirmPassword} />
      </div>

      <button
        type="button"
        onClick={handleRegister}
        disabled={loadingRegister}
        className="w-full bg-black hover:bg-gray-800 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition"
      >
        {loadingRegister ? "Creating account…" : "Create Account"}
      </button>
    </div>
  );



  const stepContent: Record<Step, () => JSX.Element> = {
    "email": renderEmailStep,
    "login-password": renderLoginPasswordStep,
    "login-otp": renderLoginOtpStep,
    "reg-verify": renderRegVerifyStep,
    "reg-form": renderRegFormStep,
  };
  const headingMap: Record<Step, string> = {
    "email": register ? "Create your account" : "Welcome back",
    "login-password": "Welcome back",
    "login-otp": "Enter login OTP",
    "reg-verify": "Verify your email",
    "reg-form": "Complete registration",
  };

  const showGoogleLogin = step === "email" || step === "login-password";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">

      <div className={`${register ? "w-full max-w-md" : "w-full max-w-6xl"}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className={`flex ${register ? "flex-col" : "flex-col-reverse lg:flex-row"} h-full`}>

            {!register && (
              <div className="hidden lg:flex flex-col justify-between bg-black p-12 text-white">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="mb-8">
                    <h1 className="text-5xl font-bold tracking-tight mb-3">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-15 w-10" /> Xoriva
                      </div>
                    </h1>
                    <div className="h-1 w-24 bg-white/30 rounded-full" />
                  </div>

                  <div className="space-y-4 mb-12">
                    <p className="text-xl font-medium leading-relaxed">
                      Your Premium Shopping Destination
                    </p>
                    <p className="text-white/70 text-lg leading-relaxed max-w-md">
                      Discover millions of products at unbeatable prices. Shop smarter, live better.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-12">
                    {[
                      { icon: Truck, title: "Free Delivery", sub: "On orders above ₹500" },
                      { icon: Shield, title: "Secure Payment", sub: "100% protected" },
                      { icon: Package, title: "Easy Returns", sub: "7-day return policy" },
                      { icon: ShoppingBag, title: "Wide Selection", sub: "Million+ products" },
                    ].map(({ icon: Icon, title, sub }, i) => (
                      <motion.div
                        key={title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="bg-white/10 p-2 rounded-lg border border-white/10">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">{title}</p>
                          <p className="text-sm text-white/50">{sub}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            <div className="flex flex-col justify-center p-8 lg:p-15 mx-auto w-full max-w-md">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:hidden mb-8 text-center"
              >
                <h1 className="text-4xl font-bold text-black mb-2">Xoriva</h1>
                <p className="text-gray-500">Your Premium Shopping Destination</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">
                    {headingMap[step]}
                  </h2>
                </div>

                <Toast msg={toast.msg} type={toast.type} />

                <div className="space-y-6">
                  {stepContent[step]()}

                  {showGoogleLogin && (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-gray-400 text-sm">or</span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>
                      <div className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 hover:bg-gray-50 transition cursor-pointer">
                        <img
                          src="https://www.svgrepo.com/show/475656/google-color.svg"
                          alt="google"
                          className="w-5 h-5"
                        />
                        <GoogleLogin />
                      </div>
                    </>
                  )}

                  <p className="text-xs text-gray-400 text-center leading-relaxed">
                    By continuing, you agree to XoriVa's{" "}
                    <span className="text-black cursor-pointer underline">Terms of Use</span> and{" "}
                    <span className="text-black cursor-pointer underline">Privacy Policy</span>
                  </p>
                </div>
              </motion.div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Auth;