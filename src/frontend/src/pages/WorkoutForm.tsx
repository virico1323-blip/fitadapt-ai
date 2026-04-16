import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Dumbbell,
  Flame,
  Heart,
  Loader2,
  LogIn,
  Repeat,
  Target,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import {
  useGenerateWorkoutPlan,
  useSaveUserProfile,
  useUserProfile,
} from "../hooks/useQueries";
import { ExperienceLevel, FitnessGoal, Gender } from "../types";

// ── Option data ───────────────────────────────────────────────────────────────

const GOAL_OPTIONS: {
  value: FitnessGoal;
  label: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    value: FitnessGoal.weightLoss,
    label: "Weight Loss",
    desc: "Burn fat, lean out",
    icon: <Flame className="w-4 h-4" />,
  },
  {
    value: FitnessGoal.muscleGain,
    label: "Muscle Gain",
    desc: "Build size & strength",
    icon: <Dumbbell className="w-4 h-4" />,
  },
  {
    value: FitnessGoal.endurance,
    label: "Endurance",
    desc: "Boost stamina & cardio",
    icon: <Heart className="w-4 h-4" />,
  },
  {
    value: FitnessGoal.flexibility,
    label: "Flexibility",
    desc: "Mobility & recovery",
    icon: <Repeat className="w-4 h-4" />,
  },
  {
    value: FitnessGoal.maintenance,
    label: "Maintenance",
    desc: "Stay fit & consistent",
    icon: <Target className="w-4 h-4" />,
  },
];

const EXPERIENCE_OPTIONS: {
  value: ExperienceLevel;
  label: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    value: ExperienceLevel.beginner,
    label: "Beginner",
    desc: "0–1 year of training",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    value: ExperienceLevel.intermediate,
    label: "Intermediate",
    desc: "1–3 years of training",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    value: ExperienceLevel.advanced,
    label: "Advanced",
    desc: "3+ years of training",
    icon: <Dumbbell className="w-4 h-4" />,
  },
];

const GENDER_OPTIONS = [
  { value: Gender.male, label: "Male" },
  { value: Gender.female, label: "Female" },
  { value: Gender.other, label: "Other" },
];

// ── Types ─────────────────────────────────────────────────────────────────────

type FormState = {
  name: string;
  age: string;
  heightCm: string;
  weightKg: string;
  targetWeightKg: string;
  gender: Gender;
  fitnessGoal: FitnessGoal;
  experienceLevel: ExperienceLevel;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

// ── Helpers ───────────────────────────────────────────────────────────────────

function validateForm(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  const age = Number(form.age);
  if (!form.age) errors.age = "Age is required";
  else if (age < 10 || age > 80) errors.age = "Age must be between 10 and 80";

  const height = Number(form.heightCm);
  if (!form.heightCm) errors.heightCm = "Height is required";
  else if (height < 100 || height > 250)
    errors.heightCm = "Height must be 100–250 cm";

  const weight = Number(form.weightKg);
  if (!form.weightKg) errors.weightKg = "Weight is required";
  else if (weight < 30 || weight > 200)
    errors.weightKg = "Weight must be 30–200 kg";

  if (form.targetWeightKg) {
    const tw = Number(form.targetWeightKg);
    if (tw < 30 || tw > 200)
      errors.targetWeightKg = "Target weight must be 30–200 kg";
  }
  return errors;
}

// ── Field error component ─────────────────────────────────────────────────────

function FieldError({ msg }: { msg?: string }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="text-destructive text-xs mt-1"
          data-ocid="workout_form.field_error"
        >
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

// ── Card picker ───────────────────────────────────────────────────────────────

function CardPicker<T extends string>({
  options,
  value,
  onChange,
  ocidPrefix,
}: {
  options: { value: T; label: string; desc: string; icon: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  ocidPrefix: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
      {options.map((opt, i) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            data-ocid={`${ocidPrefix}.${i + 1}`}
            className={`group relative flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              active
                ? "border-primary/70 bg-primary/10 shadow-[0_0_0_1px_oklch(var(--primary)/0.3),0_4px_14px_oklch(var(--primary)/0.12)]"
                : "border-border/50 bg-secondary/30 hover:border-border hover:bg-secondary/60"
            }`}
          >
            <span
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                active
                  ? "bg-primary/20 text-primary"
                  : "bg-muted/80 text-muted-foreground group-hover:text-foreground"
              }`}
            >
              {opt.icon}
            </span>
            <span className="min-w-0">
              <span
                className={`block font-semibold text-sm leading-tight ${active ? "text-foreground" : "text-foreground/80"}`}
              >
                {opt.label}
              </span>
              <span className="block text-xs text-muted-foreground mt-0.5 leading-snug">
                {opt.desc}
              </span>
            </span>
            {active && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function WorkoutFormPage() {
  const { isAuthenticated, login, isLoggingIn } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { mutateAsync: saveProfile } = useSaveUserProfile();
  const { mutateAsync: generatePlan } = useGenerateWorkoutPlan();

  const [form, setForm] = useState<FormState>({
    name: "",
    age: "",
    heightCm: "",
    weightKg: "",
    targetWeightKg: "",
    gender: Gender.other,
    fitnessGoal: FitnessGoal.weightLoss,
    experienceLevel: ExperienceLevel.beginner,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormState, boolean>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Pre-populate from existing profile
  useEffect(() => {
    if (!profile) return;
    setForm({
      name: profile.name ?? "",
      age: profile.age ? String(Number(profile.age)) : "",
      heightCm: profile.heightCm ? String(profile.heightCm) : "",
      weightKg: profile.weightKg ? String(profile.weightKg) : "",
      targetWeightKg:
        profile.targetWeightKg !== undefined
          ? String(profile.targetWeightKg)
          : "",
      gender: profile.gender ?? Gender.other,
      fitnessGoal: profile.fitnessGoal ?? FitnessGoal.weightLoss,
      experienceLevel: profile.experienceLevel ?? ExperienceLevel.beginner,
    });
  }, [profile]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoggingIn) {
      // stay on page to show login prompt
    }
  }, [isAuthenticated, isLoggingIn]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (touched[key]) {
      const next = { ...form, [key]: value };
      const errs = validateForm(next);
      setErrors((prev) => ({ ...prev, [key]: errs[key] }));
    }
  }

  function handleBlur(key: keyof FormState) {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const errs = validateForm(form);
    setErrors((prev) => ({ ...prev, [key]: errs[key] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Touch all fields to show all errors
    const allTouched = Object.fromEntries(
      Object.keys(form).map((k) => [k, true]),
    ) as Partial<Record<keyof FormState, boolean>>;
    setTouched(allTouched);

    const errs = validateForm(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Please fix the highlighted fields before continuing.");
      return;
    }

    setIsSubmitting(true);
    try {
      await saveProfile({
        name: form.name.trim(),
        age: BigInt(Math.round(Number(form.age))),
        heightCm: Number(form.heightCm),
        weightKg: Number(form.weightKg),
        targetWeightKg: form.targetWeightKg
          ? Number(form.targetWeightKg)
          : undefined,
        gender: form.gender,
        fitnessGoal: form.fitnessGoal,
        experienceLevel: form.experienceLevel,
      });
      await generatePlan();
      setSuccess(true);
      toast.success("Workout plan generated!");
      setTimeout(() => {
        void navigate({ to: "/workout-result" });
      }, 1200);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  // ── Auth gate ─────────────────────────────────────────────────────────────

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4"
        data-ocid="workout_form.auth_gate"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 glow-primary">
            <User className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-3">
            Set Up Your Profile
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Connect your Internet Identity to create your personalized profile
            and receive an AI-generated weekly workout plan.
          </p>
          <Button
            size="lg"
            onClick={login}
            disabled={isLoggingIn}
            className="gradient-primary border-0 text-primary-foreground hover:opacity-90 transition-smooth font-semibold px-8"
            data-ocid="workout_form.login_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting…
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Connect to Continue
              </>
            )}
          </Button>
        </motion.div>
      </div>
    );
  }

  // ── Success overlay ───────────────────────────────────────────────────────

  if (success) {
    return (
      <div
        className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4"
        data-ocid="workout_form.success_state"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
            className="w-20 h-20 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-5 glow-primary"
          >
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-display font-bold mb-2"
          >
            Plan Generated!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground"
          >
            Redirecting to your workout plan…
          </motion.p>
        </motion.div>
      </div>
    );
  }

  const isUpdate = !!profile;

  // ── Form ──────────────────────────────────────────────────────────────────

  return (
    <div
      className="container mx-auto px-4 py-10 max-w-2xl"
      data-ocid="workout_form.page"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-3">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 font-mono text-xs"
          >
            {isUpdate ? "UPDATE" : "SETUP"}
          </Badge>
          {isUpdate && (
            <Badge
              variant="secondary"
              className="bg-muted text-muted-foreground text-xs"
            >
              Profile found
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-display font-bold tracking-tight mb-2">
          {isUpdate ? "Update Your Profile" : "Set Up Your Profile"}
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          {isUpdate
            ? "Refine your details to regenerate a fresh, adaptive plan."
            : "Tell us about yourself and we'll generate a personalized weekly workout plan."}
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} noValidate data-ocid="workout_form.form">
        <div className="space-y-5">
          {/* ─── Section: Personal Details ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            <Card className="bg-card border-border/60 overflow-hidden">
              <div className="px-5 py-3 border-b border-border/40 bg-muted/20">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Personal Details
                </p>
              </div>
              <CardContent className="p-5 space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="font-medium">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Alex Johnson"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    className={`bg-secondary/40 border-border/60 focus-visible:ring-primary/50 focus-visible:border-primary/60 transition-colors ${errors.name && touched.name ? "border-destructive/60" : ""}`}
                    data-ocid="workout_form.name_input"
                    disabled={profileLoading}
                  />
                  <FieldError msg={touched.name ? errors.name : undefined} />
                </div>

                {/* Age + Gender */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="age" className="font-medium">
                      Age <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="28"
                      min={10}
                      max={80}
                      value={form.age}
                      onChange={(e) => setField("age", e.target.value)}
                      onBlur={() => handleBlur("age")}
                      className={`bg-secondary/40 border-border/60 focus-visible:ring-primary/50 focus-visible:border-primary/60 transition-colors ${errors.age && touched.age ? "border-destructive/60" : ""}`}
                      data-ocid="workout_form.age_input"
                      disabled={profileLoading}
                    />
                    <FieldError msg={touched.age ? errors.age : undefined} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-medium">Gender</Label>
                    <div className="flex gap-1.5">
                      {GENDER_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setField("gender", opt.value)}
                          data-ocid={`workout_form.gender_${opt.value}`}
                          className={`flex-1 rounded-lg border px-2 py-2 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                            form.gender === opt.value
                              ? "border-primary/60 bg-primary/10 text-primary"
                              : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-border hover:text-foreground"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Height + Weight */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="height" className="font-medium">
                      Height <span className="text-destructive">*</span>
                      <span className="text-muted-foreground font-normal ml-1 text-xs">
                        (cm)
                      </span>
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="175"
                      min={100}
                      max={250}
                      value={form.heightCm}
                      onChange={(e) => setField("heightCm", e.target.value)}
                      onBlur={() => handleBlur("heightCm")}
                      className={`bg-secondary/40 border-border/60 focus-visible:ring-primary/50 focus-visible:border-primary/60 transition-colors ${errors.heightCm && touched.heightCm ? "border-destructive/60" : ""}`}
                      data-ocid="workout_form.height_input"
                      disabled={profileLoading}
                    />
                    <FieldError
                      msg={touched.heightCm ? errors.heightCm : undefined}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="weight" className="font-medium">
                      Weight <span className="text-destructive">*</span>
                      <span className="text-muted-foreground font-normal ml-1 text-xs">
                        (kg)
                      </span>
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="75"
                      min={30}
                      max={200}
                      step={0.1}
                      value={form.weightKg}
                      onChange={(e) => setField("weightKg", e.target.value)}
                      onBlur={() => handleBlur("weightKg")}
                      className={`bg-secondary/40 border-border/60 focus-visible:ring-primary/50 focus-visible:border-primary/60 transition-colors ${errors.weightKg && touched.weightKg ? "border-destructive/60" : ""}`}
                      data-ocid="workout_form.weight_input"
                      disabled={profileLoading}
                    />
                    <FieldError
                      msg={touched.weightKg ? errors.weightKg : undefined}
                    />
                  </div>
                </div>

                {/* Target weight */}
                <div className="space-y-1.5">
                  <Label htmlFor="targetWeight" className="font-medium">
                    Target Weight
                    <span className="text-muted-foreground font-normal ml-1 text-xs">
                      (kg, optional)
                    </span>
                  </Label>
                  <Input
                    id="targetWeight"
                    type="number"
                    placeholder="68"
                    min={30}
                    max={200}
                    step={0.1}
                    value={form.targetWeightKg}
                    onChange={(e) => setField("targetWeightKg", e.target.value)}
                    onBlur={() => handleBlur("targetWeightKg")}
                    className={`bg-secondary/40 border-border/60 focus-visible:ring-primary/50 focus-visible:border-primary/60 transition-colors ${errors.targetWeightKg && touched.targetWeightKg ? "border-destructive/60" : ""}`}
                    data-ocid="workout_form.target_weight_input"
                    disabled={profileLoading}
                  />
                  <FieldError
                    msg={
                      touched.targetWeightKg ? errors.targetWeightKg : undefined
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Used to estimate how long it'll take to reach your goal.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ─── Section: Fitness Goal ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.16 }}
          >
            <Card className="bg-card border-border/60 overflow-hidden">
              <div className="px-5 py-3 border-b border-border/40 bg-muted/20">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Fitness Goal
                </p>
              </div>
              <CardContent className="p-5">
                <CardPicker
                  options={GOAL_OPTIONS}
                  value={form.fitnessGoal}
                  onChange={(v) => setField("fitnessGoal", v)}
                  ocidPrefix="workout_form.goal"
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* ─── Section: Experience Level ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.24 }}
          >
            <Card className="bg-card border-border/60 overflow-hidden">
              <div className="px-5 py-3 border-b border-border/40 bg-muted/20">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Experience Level
                </p>
              </div>
              <CardContent className="p-5">
                <CardPicker
                  options={EXPERIENCE_OPTIONS}
                  value={form.experienceLevel}
                  onChange={(v) => setField("experienceLevel", v)}
                  ocidPrefix="workout_form.experience"
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* ─── Submit ─── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="pb-6"
          >
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full gradient-primary border-0 text-primary-foreground hover:opacity-90 transition-smooth font-semibold h-12 text-base glow-primary"
              data-ocid="workout_form.submit_button"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span>Generating Your Plan…</span>
                </>
              ) : (
                <>
                  <span>
                    {isUpdate
                      ? "Regenerate Workout Plan"
                      : "Generate Workout Plan"}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-3">
              Your plan is uniquely generated based on your inputs and adapts
              over time.
            </p>
          </motion.div>
        </div>
      </form>
    </div>
  );
}
