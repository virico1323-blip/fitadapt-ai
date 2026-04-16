import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  Dumbbell,
  Flame,
  LogIn,
  Scale,
  Target,
  Timer,
  TrendingUp,
  UserPen,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import {
  useGoalPrediction,
  useLatestWorkoutPlan,
  useUserProfile,
  useWorkoutStats,
} from "../hooks/useQueries";
import type { WeeklyWorkoutPlan } from "../types";
import { FitnessGoal } from "../types";

const GOAL_LABELS: Record<FitnessGoal, string> = {
  [FitnessGoal.weightLoss]: "Weight Loss",
  [FitnessGoal.muscleGain]: "Muscle Gain",
  [FitnessGoal.endurance]: "Endurance",
  [FitnessGoal.flexibility]: "Flexibility",
  [FitnessGoal.maintenance]: "Maintenance",
};

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function todayDayName(): string {
  return DAY_NAMES[new Date().getDay()];
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  delay: number;
  accent?: boolean;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  delay,
  accent,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card className="bg-card border-border/60 hover:border-primary/30 transition-smooth group">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                accent ? "bg-accent/20" : "gradient-primary"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${accent ? "text-accent" : "text-primary-foreground"}`}
              />
            </div>
          </div>
          <p className="text-2xl font-display font-bold tracking-tight">
            {value}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
          {sub && (
            <p
              className={`text-xs mt-1 ${accent ? "text-accent" : "text-primary"}`}
            >
              {sub}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Today Card ───────────────────────────────────────────────────────────────

function TodayWorkoutCard({
  plan,
  loading,
}: {
  plan: WeeklyWorkoutPlan | null | undefined;
  loading: boolean;
}) {
  const today = todayDayName();
  const todayPlan = plan?.days.find(
    (d) => d.dayOfWeek.toLowerCase() === today.toLowerCase(),
  );

  if (loading) {
    return (
      <Card className="bg-card border-border/60">
        <CardContent className="p-5 space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-4 w-28" />
        </CardContent>
      </Card>
    );
  }

  if (!plan) return null;

  const isRest = todayPlan?.isRestDay ?? true;
  const exercises = todayPlan?.exercises ?? [];
  const totalDuration = exercises.reduce(
    (acc, ex) =>
      acc + Number(ex.sets) * Number(ex.reps) * 3 + Number(ex.restSeconds),
    0,
  );
  const estimatedMin = Math.round(totalDuration / 60);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
      data-ocid="dashboard.today_card"
    >
      <Card className="bg-card border-border/60 overflow-hidden">
        <div className="h-1 gradient-primary" />
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              Today — {today}
            </span>
          </div>

          {isRest ? (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/50 border border-border/40">
              <span className="text-2xl">😴</span>
              <div>
                <p className="font-semibold">Rest Day</p>
                <p className="text-xs text-muted-foreground">
                  Recovery is part of the plan
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-xs bg-primary/15 text-primary border border-primary/25 rounded-full px-2.5 py-1 font-medium">
                  <Dumbbell className="w-3 h-3" />
                  {exercises.length} exercises
                </span>
                {estimatedMin > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-xs bg-secondary text-muted-foreground border border-border/40 rounded-full px-2.5 py-1">
                    <Timer className="w-3 h-3" />~{estimatedMin} min
                  </span>
                )}
              </div>
              <div className="space-y-1.5">
                {exercises.slice(0, 3).map((ex, idx) => (
                  <div
                    key={ex.name}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/40 border border-border/30 text-sm"
                    data-ocid={`dashboard.today_exercise.${idx + 1}`}
                  >
                    <span className="font-medium truncate min-w-0 mr-2">
                      {ex.name}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {Number(ex.sets)}×{Number(ex.reps)}
                    </span>
                  </div>
                ))}
                {exercises.length > 3 && (
                  <p className="text-xs text-muted-foreground pl-3">
                    +{exercises.length - 3} more exercises
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const { isAuthenticated, login, isLoggingIn } = useAuth();
  const { data: profile, isLoading: loadingProfile } = useUserProfile();
  const { data: stats, isLoading: loadingStats } = useWorkoutStats();
  const { data: plan, isLoading: loadingPlan } = useLatestWorkoutPlan();
  const { data: prediction } = useGoalPrediction();

  if (!isAuthenticated) {
    return (
      <div
        className="container mx-auto px-4 py-24 text-center"
        data-ocid="dashboard.not_auth"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-md mx-auto"
        >
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 glow-primary">
            <Zap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-3">
            Your Dashboard
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Connect your Internet Identity to access your personalized
            dashboard, workout stats, and training plans.
          </p>
          <Button
            size="lg"
            onClick={login}
            disabled={isLoggingIn}
            className="gradient-primary border-0 text-primary-foreground hover:opacity-90 transition-smooth glow-primary"
            data-ocid="dashboard.login_button"
          >
            <LogIn className="w-4 h-4 mr-2" />
            {isLoggingIn ? "Connecting…" : "Connect to Continue"}
          </Button>
        </motion.div>
      </div>
    );
  }

  const hasPlan = !loadingPlan && plan != null;
  const noPlan = !loadingPlan && plan == null;

  return (
    <div className="container mx-auto px-4 py-8" data-ocid="dashboard.page">
      {/* ── Welcome header ── */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        data-ocid="dashboard.header"
      >
        {loadingProfile ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-44" />
          </div>
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
              {profile ? (
                <>
                  Welcome back,{" "}
                  <span className="gradient-text">
                    {profile.name.split(" ")[0]}
                  </span>
                  !
                </>
              ) : (
                "Dashboard"
              )}
            </h1>
            <p className="text-muted-foreground mt-1.5">
              {formatDate()}
              {profile && (
                <>
                  {" "}
                  ·{" "}
                  <span className="text-primary font-medium">
                    {GOAL_LABELS[profile.fitnessGoal]}
                  </span>
                </>
              )}
            </p>
          </>
        )}
      </motion.div>

      {/* ── Stats bar ── */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        data-ocid="dashboard.stats_section"
      >
        {loadingStats ? (
          Array.from({ length: 4 }, (_, i) => `stat-sk-${i}`).map((key) => (
            <Skeleton key={key} className="h-[112px] rounded-xl" />
          ))
        ) : (
          <>
            <StatCard
              icon={Flame}
              label="Total Workouts"
              value={stats ? Number(stats.totalWorkoutsCompleted) : 0}
              delay={0.05}
              data-ocid="dashboard.stat_total_workouts"
            />
            <StatCard
              icon={TrendingUp}
              label="Current Streak"
              value={`${stats ? Number(stats.currentStreak) : 0}d`}
              sub={
                stats && Number(stats.currentStreak) > 0
                  ? "Keep it up! 🔥"
                  : "Start your streak"
              }
              delay={0.1}
            />
            <StatCard
              icon={Activity}
              label="Avg. Difficulty"
              value={
                stats && stats.averageDifficultyScore > 0
                  ? stats.averageDifficultyScore.toFixed(1)
                  : "—"
              }
              sub="1 Easy · 2 Medium · 3 Hard"
              delay={0.15}
            />
            <StatCard
              icon={Target}
              label="Goal Progress"
              value={
                prediction ? `${Math.round(prediction.progressPercent)}%` : "—"
              }
              sub={
                prediction?.estimatedWeeksRemaining
                  ? `~${prediction.estimatedWeeksRemaining}w to goal`
                  : undefined
              }
              delay={0.2}
              accent
            />
          </>
        )}
      </div>

      {/* ── No plan CTA ── */}
      {noPlan && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="mb-8"
          data-ocid="dashboard.no_plan_card"
        >
          <Card className="bg-card border-border/60 border-dashed">
            <CardContent className="py-10 text-center">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-7 h-7 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-display font-bold mb-2">
                Generate Your First Plan
              </h2>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                Fill in your profile and fitness goals — we'll build a
                personalized weekly training plan just for you.
              </p>
              <Button
                asChild
                size="lg"
                className="gradient-primary border-0 text-primary-foreground hover:opacity-90 transition-smooth glow-primary"
                data-ocid="dashboard.create_plan_button"
              >
                <Link to="/workout-form">
                  <Zap className="w-4 h-4 mr-2" />
                  Get Started
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── Plan preview + actions ── */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Today highlight + weekly plan */}
        <div className="md:col-span-2 space-y-4">
          {/* Today card */}
          {(hasPlan || loadingPlan) && (
            <TodayWorkoutCard plan={plan} loading={loadingPlan} />
          )}

          {/* Weekly overview */}
          {(hasPlan || loadingPlan) && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.35 }}
              data-ocid="dashboard.plan_card"
            >
              <Card className="bg-card border-border/60">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base font-display font-semibold flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    This Week's Plan
                  </CardTitle>
                  {plan && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-primary/15 text-primary border-primary/20"
                    >
                      Week {Number(plan.weekNumber)}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  {loadingPlan ? (
                    <div className="space-y-2.5">
                      {Array.from({ length: 5 }, (_, i) => `pl-sk-${i}`).map(
                        (key) => (
                          <Skeleton key={key} className="h-10 rounded-lg" />
                        ),
                      )}
                    </div>
                  ) : plan ? (
                    <div
                      className="space-y-1.5"
                      data-ocid="dashboard.plan_list"
                    >
                      {plan.days.map((day, i) => {
                        const isToday =
                          day.dayOfWeek.toLowerCase() ===
                          todayDayName().toLowerCase();
                        return (
                          <div
                            key={day.dayOfWeek}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg border transition-smooth ${
                              isToday
                                ? "bg-primary/10 border-primary/30"
                                : "bg-secondary/40 border-border/30 hover:border-border/60"
                            }`}
                            data-ocid={`dashboard.plan_day.${i + 1}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                  day.isRestDay
                                    ? "bg-muted-foreground/40"
                                    : isToday
                                      ? "bg-primary"
                                      : "bg-primary/60"
                                }`}
                              />
                              <span
                                className={`font-medium text-sm ${isToday ? "text-primary" : ""}`}
                              >
                                {day.dayOfWeek}
                                {isToday && (
                                  <span className="ml-1.5 text-xs font-normal text-primary/70">
                                    (today)
                                  </span>
                                )}
                              </span>
                            </div>
                            {day.isRestDay ? (
                              <span className="text-xs text-muted-foreground">
                                Rest
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                {day.exercises.length} exercises
                              </span>
                            )}
                          </div>
                        );
                      })}
                      <div className="pt-2">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-full border-primary/30 text-primary hover:bg-primary/10 transition-smooth"
                          data-ocid="dashboard.view_plan_button"
                        >
                          <Link to="/workout-result">
                            View Full Plan
                            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Quick actions + profile */}
        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
          >
            <Card className="bg-card border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display font-semibold">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  asChild
                  size="sm"
                  className="w-full justify-start gap-2 gradient-primary border-0 text-primary-foreground hover:opacity-90 transition-smooth"
                  data-ocid="dashboard.new_plan_button"
                >
                  <Link to="/workout-form">
                    <Zap className="w-4 h-4" />
                    {plan ? "Edit / New Plan" : "Generate Plan"}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 border-border/60 hover:bg-secondary transition-smooth"
                  data-ocid="dashboard.view_result_button"
                >
                  <Link to="/workout-result">
                    <Activity className="w-4 h-4" />
                    Log Today's Workout
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 border-border/60 hover:bg-secondary transition-smooth"
                  data-ocid="dashboard.log_weight_button"
                >
                  <Link to="/progress">
                    <Scale className="w-4 h-4" />
                    Log Weight
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 border-border/60 hover:bg-secondary transition-smooth"
                  data-ocid="dashboard.progress_button"
                >
                  <Link to="/progress">
                    <TrendingUp className="w-4 h-4" />
                    View Progress
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Goal prediction card */}
          {prediction && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card className="bg-card border-border/60 overflow-hidden">
                <div className="h-1 bg-accent/60" />
                <CardContent className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    Goal Prediction
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-accent">
                        {Math.round(prediction.progressPercent)}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-accent transition-smooth"
                        style={{
                          width: `${Math.min(100, Math.round(prediction.progressPercent))}%`,
                        }}
                      />
                    </div>
                    {prediction.estimatedWeeksRemaining ? (
                      <p className="text-xs text-muted-foreground">
                        ~{prediction.estimatedWeeksRemaining} weeks to reach
                        goal
                      </p>
                    ) : (
                      <p className="text-xs text-accent font-medium">
                        🎯 Goal reached!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Profile summary */}
          {profile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
            >
              <Card className="bg-card border-border/60">
                <CardContent className="p-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    Your Profile
                  </p>
                  {(
                    [
                      ["Weight", `${profile.weightKg} kg`],
                      ["Height", `${profile.heightCm} cm`],
                      ["Age", `${Number(profile.age)} yrs`],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                  <div className="pt-1">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs text-primary hover:bg-primary/10 h-7 gap-1.5 transition-smooth"
                      data-ocid="dashboard.edit_profile_button"
                    >
                      <Link to="/workout-form">
                        <UserPen className="w-3 h-3" />
                        Edit Profile
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
