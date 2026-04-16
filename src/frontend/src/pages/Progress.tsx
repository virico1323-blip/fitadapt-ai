import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  ArrowUp,
  CalendarDays,
  Dumbbell,
  Flame,
  Loader2,
  LogIn,
  Scale,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import {
  useCompletedWorkouts,
  useGoalPrediction,
  useLogWeight,
  useWeightHistory,
  useWorkoutStats,
} from "../hooks/useQueries";
import type { WeightEntry } from "../types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateShort(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function difficultyBadgeClass(level: string) {
  switch (level) {
    case "easy":
      return "border-teal-500/40 text-teal-400 bg-teal-500/10";
    case "hard":
      return "border-[oklch(0.68_0.18_22/0.4)] text-[oklch(0.75_0.18_22)] bg-[oklch(0.68_0.18_22/0.08)]";
    default:
      return "border-yellow-500/40 text-yellow-400 bg-yellow-500/10";
  }
}

// ── Weight Chart ──────────────────────────────────────────────────────────────

function WeightChart({ entries }: { entries: WeightEntry[] }) {
  const data = [...entries]
    .sort((a, b) => Number(a.loggedAt) - Number(b.loggedAt))
    .slice(-20)
    .map((e) => ({ date: formatDateShort(e.loggedAt), weight: e.weightKg }));

  if (data.length < 2) {
    return (
      <div className="h-52 flex flex-col items-center justify-center text-center gap-2">
        <Scale className="w-8 h-8 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">
          Log at least 2 entries to see your trend.
        </p>
      </div>
    );
  }

  return (
    <ChartContainer
      config={{
        weight: { label: "Weight (kg)", color: "oklch(var(--primary))" },
      }}
      className="h-56 w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "oklch(var(--muted-foreground))" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "oklch(var(--muted-foreground))" }}
            domain={["auto", "auto"]}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="oklch(var(--primary))"
            strokeWidth={2.5}
            dot={{ fill: "oklch(var(--primary))", r: 3 }}
            activeDot={{ r: 5, fill: "oklch(var(--accent))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────────────────

function OverviewTab() {
  const { data: stats, isLoading: loadingStats } = useWorkoutStats();
  const { data: prediction, isLoading: loadingPrediction } =
    useGoalPrediction();

  const avgScore = stats?.averageDifficultyScore ?? 0;
  const avgDifficultyLabel =
    avgScore < 1.5 ? "Easy" : avgScore < 2.5 ? "Medium" : "Hard";
  const avgDifficultyClass =
    avgScore < 1.5
      ? "border-teal-500/40 text-teal-400 bg-teal-500/10"
      : avgScore < 2.5
        ? "border-yellow-500/40 text-yellow-400 bg-yellow-500/10"
        : "border-[oklch(0.68_0.18_22/0.4)] text-[oklch(0.75_0.18_22)] bg-[oklch(0.68_0.18_22/0.08)]";

  return (
    <div className="space-y-5">
      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {
            icon: Trophy,
            label: "Total Workouts",
            value: loadingStats
              ? null
              : String(Number(stats?.totalWorkoutsCompleted ?? 0)),
            colorClass: "text-accent",
            bgClass: "bg-accent/10",
            delay: 0,
          },
          {
            icon: Flame,
            label: "Current Streak",
            value: loadingStats
              ? null
              : `${Number(stats?.currentStreak ?? 0)} days`,
            colorClass: "text-primary",
            bgClass: "bg-primary/10",
            delay: 0.05,
          },
          {
            icon: Activity,
            label: "Avg Difficulty",
            value: null,
            badge: !loadingStats && stats ? avgDifficultyLabel : null,
            badgeClass: avgDifficultyClass,
            colorClass: "text-muted-foreground",
            bgClass: "bg-secondary/60",
            delay: 0.1,
          },
        ].map(
          ({
            icon: Icon,
            label,
            value,
            badge,
            badgeClass,
            colorClass,
            bgClass,
            delay,
          }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay }}
            >
              <Card
                className="bg-card border-border/60 hover:border-border/80 transition-smooth"
                data-ocid={`progress.stat.${label.toLowerCase().replace(/ /g, "_")}`}
              >
                <CardContent className="p-5">
                  <div
                    className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center mb-3`}
                  >
                    <Icon className={`w-5 h-5 ${colorClass}`} />
                  </div>
                  {loadingStats ? (
                    <Skeleton className="h-7 w-16 mb-1" />
                  ) : badge ? (
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold mb-1 ${badgeClass}`}
                    >
                      {badge}
                    </Badge>
                  ) : (
                    <p className="text-2xl font-display font-bold mb-0.5">
                      {value ?? "—"}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">{label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ),
        )}
      </div>

      {/* Goal Prediction Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <Card
          className="bg-card border-primary/20 overflow-hidden"
          data-ocid="progress.goal_prediction_card"
        >
          <div className="h-1 gradient-primary" />
          <CardHeader className="pb-3 border-b border-border/30">
            <CardTitle className="text-base font-display font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Goal Prediction
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {loadingPrediction ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : !prediction ? (
              <div
                className="text-center py-6"
                data-ocid="progress.prediction_empty_state"
              >
                <Target className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Log at least 2 weight entries to see your prediction.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      Progress to goal
                    </span>
                    <span className="font-semibold text-primary">
                      {Math.round(prediction.progressPercent)}%
                    </span>
                  </div>
                  <Progress
                    value={Math.min(100, prediction.progressPercent)}
                    className="h-2.5"
                    data-ocid="progress.goal_progress_bar"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    {
                      label: "Current Weight",
                      value: `${prediction.currentWeightKg} kg`,
                      icon: Scale,
                    },
                    ...(prediction.targetWeightKg != null
                      ? [
                          {
                            label: "Target Weight",
                            value: `${prediction.targetWeightKg} kg`,
                            icon: Target,
                          },
                        ]
                      : []),
                    {
                      label: "Weekly Rate",
                      value: `${prediction.weeklyRateKg.toFixed(2)} kg/wk`,
                      icon: TrendingUp,
                    },
                    ...(prediction.estimatedWeeksRemaining != null
                      ? [
                          {
                            label: "Est. Time Left",
                            value: `${prediction.estimatedWeeksRemaining} weeks`,
                            icon: CalendarDays,
                          },
                        ]
                      : []),
                  ].map(({ label, value, icon: Icon }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 bg-secondary/30 rounded-xl px-3 py-2.5"
                    >
                      <Icon className="w-4 h-4 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground leading-none mb-0.5">
                          {label}
                        </p>
                        <p className="text-sm font-semibold">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {prediction.estimatedWeeksRemaining == null && (
                  <p
                    className="text-xs text-muted-foreground bg-secondary/30 rounded-lg px-3 py-2 text-center"
                    data-ocid="progress.prediction_note"
                  >
                    Log at least 2 weight entries to see your estimated time to
                    goal.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ── Weight Log Tab ────────────────────────────────────────────────────────────

function WeightLogTab() {
  const { data: weightHistory, isLoading: loadingWeight } = useWeightHistory();
  const { mutateAsync: logWeight, isPending: isLoggingWeight } = useLogWeight();
  const [newWeight, setNewWeight] = useState("");

  async function handleLogWeight(e: React.FormEvent) {
    e.preventDefault();
    const val = Number.parseFloat(newWeight);
    if (!val || val < 20 || val > 500) {
      toast.error("Enter a valid weight between 20–500 kg.");
      return;
    }
    try {
      await logWeight(val);
      setNewWeight("");
      toast.success(`Weight ${val} kg logged!`);
    } catch {
      toast.error("Failed to log weight.");
    }
  }

  const sortedEntries = weightHistory
    ? [...weightHistory].sort((a, b) => Number(b.loggedAt) - Number(a.loggedAt))
    : [];

  return (
    <div className="space-y-5">
      {/* Log Form */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card
          className="bg-card border-border/60"
          data-ocid="progress.log_weight_card"
        >
          <CardHeader className="pb-3 border-b border-border/30">
            <CardTitle className="text-base font-display font-semibold flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary" />
              Log Today's Weight
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleLogWeight} className="flex items-end gap-3">
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="logWeight" className="text-sm">
                  Weight (kg)
                </Label>
                <Input
                  id="logWeight"
                  type="number"
                  placeholder="e.g. 75.5"
                  min={20}
                  max={500}
                  step={0.1}
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="bg-secondary/50 border-border/60 focus:border-primary/60"
                  data-ocid="progress.weight_input"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoggingWeight || !newWeight}
                className="gradient-primary border-0 text-primary-foreground hover:opacity-90 transition-smooth shrink-0"
                data-ocid="progress.log_weight_button"
              >
                {isLoggingWeight ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ArrowUp className="w-4 h-4 mr-1.5" />
                    Log Weight
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <Card
          className="bg-card border-border/60"
          data-ocid="progress.weight_chart_card"
        >
          <CardHeader className="pb-3 border-b border-border/30">
            <CardTitle className="text-base font-display font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Weight Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {loadingWeight ? (
              <Skeleton className="h-56 w-full" />
            ) : weightHistory && weightHistory.length > 0 ? (
              <WeightChart entries={weightHistory} />
            ) : (
              <div
                className="h-48 flex flex-col items-center justify-center text-center gap-2"
                data-ocid="progress.weight_empty_state"
              >
                <Scale className="w-10 h-10 text-muted-foreground/25" />
                <p className="text-sm text-muted-foreground">
                  Log your first weight entry to see your trend.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* History Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card
          className="bg-card border-border/60"
          data-ocid="progress.weight_history_card"
        >
          <CardHeader className="pb-3 border-b border-border/30">
            <CardTitle className="text-base font-display font-semibold flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary" />
              Weight History
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {loadingWeight ? (
              <div className="space-y-2">
                {["wh-1", "wh-2", "wh-3", "wh-4", "wh-5"].map((k) => (
                  <Skeleton key={k} className="h-9" />
                ))}
              </div>
            ) : sortedEntries.length === 0 ? (
              <div
                className="text-center py-8 text-muted-foreground text-sm"
                data-ocid="progress.weight_history_empty"
              >
                No weight entries yet. Log your first weigh-in above.
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-border/40">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/50 border-b border-border/40">
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Date
                      </th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Weight
                      </th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedEntries.slice(0, 20).map((entry, i) => {
                      const prev = sortedEntries[i + 1];
                      const change = prev
                        ? entry.weightKg - prev.weightKg
                        : null;
                      return (
                        <tr
                          key={String(entry.entryId)}
                          className="border-b border-border/20 last:border-0 hover:bg-secondary/20 transition-colors"
                          data-ocid={`progress.weight_entry.${i + 1}`}
                        >
                          <td className="px-4 py-3 text-muted-foreground">
                            {formatDate(entry.loggedAt)}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold">
                            {entry.weightKg} kg
                          </td>
                          <td className="px-4 py-3 text-right">
                            {change != null ? (
                              <span
                                className={
                                  change < 0
                                    ? "text-teal-400 font-medium"
                                    : change > 0
                                      ? "text-[oklch(0.75_0.18_22)]  font-medium"
                                      : "text-muted-foreground"
                                }
                              >
                                {change > 0 ? "+" : ""}
                                {change.toFixed(1)} kg
                              </span>
                            ) : (
                              <span className="text-muted-foreground/40">
                                —
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ── Workout History Tab ───────────────────────────────────────────────────────

function WorkoutHistoryTab() {
  const { data: completedWorkouts, isLoading } = useCompletedWorkouts();

  const sorted = completedWorkouts
    ? [...completedWorkouts].sort(
        (a, b) => Number(b.completedAt) - Number(a.completedAt),
      )
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        className="bg-card border-border/60"
        data-ocid="progress.workouts_card"
      >
        <CardHeader className="pb-3 border-b border-border/30">
          <CardTitle className="text-base font-display font-semibold flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-primary" />
            Completed Workouts
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="space-y-2">
              {["cw-1", "cw-2", "cw-3", "cw-4", "cw-5"].map((k) => (
                <Skeleton key={k} className="h-14" />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div
              className="text-center py-12"
              data-ocid="progress.workouts_empty_state"
            >
              <Dumbbell className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground mb-1">
                No workouts logged yet
              </p>
              <p className="text-xs text-muted-foreground/70">
                Complete your first workout to see your history here.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-border/40">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50 border-b border-border/40">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Day
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Date
                    </th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Exercises
                    </th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Difficulty
                    </th>
                  </tr>
                </thead>
                <tbody data-ocid="progress.workouts_list">
                  {sorted.map((w, i) => (
                    <tr
                      key={String(w.completedId)}
                      className="border-b border-border/20 last:border-0 hover:bg-secondary/20 transition-colors"
                      data-ocid={`progress.workout.${i + 1}`}
                    >
                      <td className="px-4 py-3 font-medium">{w.dayOfWeek}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(w.completedAt)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {w.exercises.length}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize font-medium ${difficultyBadgeClass(w.difficultyFeedback)}`}
                        >
                          {w.difficultyFeedback}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function ProgressPage() {
  const { isAuthenticated, login, isLoggingIn } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 glow-primary">
              <TrendingUp className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-3">
              Your Progress
            </h1>
            <p className="text-muted-foreground mb-8">
              Connect to track your weight journey, view completed workouts, and
              monitor goal progress.
            </p>
            <Button
              size="lg"
              onClick={login}
              disabled={isLoggingIn}
              className="gradient-primary border-0 text-primary-foreground hover:opacity-90 transition-smooth"
              data-ocid="progress.login_button"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {isLoggingIn ? "Connecting…" : "Connect to View"}
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto px-4 py-8 max-w-4xl fade-in"
      data-ocid="progress.page"
    >
      <motion.div
        className="mb-7"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-display font-bold tracking-tight">
          Progress Tracker
        </h1>
        <p className="text-muted-foreground mt-1">
          Your fitness journey at a glance.
        </p>
      </motion.div>

      <Tabs defaultValue="overview" data-ocid="progress.tabs">
        <TabsList className="mb-6 bg-secondary/60 border border-border/40 p-1 h-auto rounded-xl">
          <TabsTrigger
            value="overview"
            className="rounded-lg text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm transition-smooth"
            data-ocid="progress.tab.overview"
          >
            <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="weight"
            className="rounded-lg text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm transition-smooth"
            data-ocid="progress.tab.weight"
          >
            <Scale className="w-3.5 h-3.5 mr-1.5" />
            Weight Log
          </TabsTrigger>
          <TabsTrigger
            value="workouts"
            className="rounded-lg text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm transition-smooth"
            data-ocid="progress.tab.workouts"
          >
            <Activity className="w-3.5 h-3.5 mr-1.5" />
            Workout History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="weight" className="mt-0">
          <WeightLogTab />
        </TabsContent>

        <TabsContent value="workouts" className="mt-0">
          <WorkoutHistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
