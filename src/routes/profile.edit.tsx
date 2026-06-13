import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { ArrowLeft, Save, Camera, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useUser } from "../hooks/use-user";
import { getServices } from "../di/container";

export const Route = createFileRoute("/profile/edit")({
  beforeLoad: async () => {
    try {
      await (await getServices()).authService.getCurrentUser();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: ProfileEditRoute,
});

function ProfileEditRoute() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    nickname: user.nickname,
    avatar: user.avatar,
  });

  const initialised = useRef(false);
  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      nickname: user.nickname,
      avatar: user.avatar,
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await setUser({
      ...user,
      firstName: formData.firstName,
      lastName: formData.lastName,
      nickname: formData.nickname,
      avatar: formData.avatar,
    });
    setIsSaving(false);
    navigate({ to: "/profile" });
  };

  return (
    <main className="min-h-screen pb-24 pt-[80px]">
      <div className="max-w-md mx-auto px-4 pt-2 md:pt-6">
        <header className="mb-8 flex items-center gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-11 h-11 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/10 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-medium tracking-tight leading-none text-zinc-900 dark:text-white">
              Edit Information
            </h1>
          </div>
        </header>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-zinc-900 shadow-xl flex items-center justify-center bg-zinc-200 dark:bg-zinc-800">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-zinc-400" />
                )}
              </div>
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <Camera className="w-8 h-8 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              {/* Always visible small badge for mobile discoverability */}
              <label className="absolute bottom-0 right-0 w-9 h-9 bg-[var(--ember)] rounded-full flex items-center justify-center text-white border-2 border-white dark:border-zinc-950 cursor-pointer shadow-md transition-transform active:scale-95">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 ml-1"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Votre prénom"
                required
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl px-4 py-3.5 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)] focus:border-transparent transition-all shadow-sm"
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 ml-1"
              >
                Surname <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Votre nom"
                required
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl px-4 py-3.5 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)] focus:border-transparent transition-all shadow-sm"
              />
            </div>

            {/* Nickname */}
            <div>
              <label
                htmlFor="nickname"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 ml-1"
              >
                Nickname <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="Votre surnom"
                required
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl px-4 py-3.5 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--ember)] focus:border-transparent transition-all shadow-sm"
              />
            </div>

            {/* Email (Disabled) */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 ml-1"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={user.email}
                  disabled
                  className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-transparent rounded-2xl px-4 py-3.5 text-zinc-500 dark:text-zinc-400 cursor-not-allowed shadow-inner"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded">
                    Uneditable
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 mt-2 ml-1">
                Your email is linked to your account identity and cannot be changed here.
              </p>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full font-bold text-[15px] bg-[var(--ember)] hover:bg-[var(--ember)]/90 text-white shadow-lg shadow-[var(--ember)]/20 transition-all duration-300 disabled:opacity-80 disabled:cursor-wait"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
