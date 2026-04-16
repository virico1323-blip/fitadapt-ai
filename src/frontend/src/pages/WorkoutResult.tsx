import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Dumbbell,
  FlameKindling,
  Moon,
  RefreshCw,
  Timer,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import {
  useCompletedWorkouts,
  useLatestWorkoutPlan,
  useSubmitWorkoutFeedback,
} from "../hooks/useQueries";
import { DifficultyFeedback } from "../types";
import type { DayPlan, Exercise } from "../types";

// ── Constants ────────────────────────────────────────────────────────────────

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const MUSCLE_COLORS: Record<string, string> = {
  Chest: "bg-primary/20 text-primary border-primary/30",
  Back: "bg-[oklch(0.68_0.18_145/0.25)] text-[oklch(0.78_0.18_145)] border-[oklch(0.68_0.18_145/0.35)]",
  Legs: "bg-[oklch(0.75_0.18_265/0.2)] text-[oklch(0.82_0.18_265)] border-[oklch(0.75_0.18_265/0.3)]",
  Shoulders: "bg-accent/20 text-accent border-accent/30",
  Arms: "bg-[oklch(0.68_0.18_55/0.2)] text-[oklch(0.8_0.15_55)] border-[oklch(0.68_0.18_55/0.3)]",
  Core: "bg-primary/15 text-primary border-primary/25",
  Cardio: "bg-destructive/15 text-destructive border-destructive/25",
};

function getMuscleColor(group: string) {
  return MUSCLE_COLORS[group] ?? "bg-muted text-muted-foreground border-border";
}

// ── ExerciseMiniCard ──────────────────────────────────────────────────────────

function ExerciseMiniCard({ exercise }: { exercise: Exercise }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-background/60 border border-border/50 hover:border-primary/30 transition-smooth">
      <div className="mt-0.5 flex-shrink-0 size-7 rounded-md bg-primary/10 flex items-center justify-center">
        <Dumbbell className="size-3.5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          {exercise.name}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground font-mono">
            {String(exercise.sets)} × {String(exercise.reps)}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Timer className="size-3" />
            {String(exercise.restSeconds)}s rest
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <FlameKindling className="size-3" />
            {exercise.intensityDescriptor}
          </span>
        </div>
      </div>
      <Badge
        variant="outline"
        className={`text-[10px] px-1.5 py-0.5 flex-shrink-0 border ${getMuscleColor(exercise.muscleGroup)}`}
      >
        {exercise.muscleGroup}
      </Badge>
    </div>
  );
}

// ── FeedbackButtons ───────────────────────────────────────────────────────────

interface FeedbackButtonsProps {
  planId: bigint;
  day: DayPlan;
  completedFeedback?: DifficultyFeedback;
}

function FeedbackButtons({
  planId,
  day,
  completedFeedback,
}: FeedbackButtonsProps) {
  const [selected, setSelected] = useState<DifficultyFeedback | null>(
    completedFeedback ?? null,
  );
  const mutation = useSubmitWorkoutFeedback();

  async function handleFeedback(feedback: DifficultyFeedback) {
    if (selected || mutation.isPending) return;
    setSelected(feedback);
    try {
      await mutation.mutateAsync({
        planId,
        dayOfWeek: day.dayOfWeek,
        exercises: day.exercises,
        feedback,
      });
      toast.success(
        `${day.dayOfWeek} marked as ${feedback}! Plan will adapt.`,
        {
          duration: 4500,
        },
      );
    } catch {
      setSelected(null);
      toast.error("Failed to save feedback. Please try again.");
    }
  }

  const buttons: {
    label: string;
    value: DifficultyFeedback;
    idle: string;
    active: string;
  }[] = [
    {
      label: "Easy",
      value: DifficultyFeedback.easy,
      idle: "border-primary/40 text-primary hover:bg-primary/15 hover:border-primary/70",
      active:
        "bg-primary/20 border-primary text-primary shadow-[0_0_12px_oklch(var(--primary)/0.3)]",
    },
    {
      label: "Medium",
      value: DifficultyFeedback.medium,
      idle: "border-border text-muted-foreground hover:bg-secondary hover:text-foreground",
      active: "bg-secondary border-border text-foreground",
    },
    {
      label: "Hard",
      value: DifficultyFeedback.hard,
      idle: "border-destructive/40 text-destructive hover:bg-destructive/15 hover:border-destructive/70",
      active:
        "bg-destructive/20 border-destructive text-destructive shadow-[0_0_12px_oklch(var(--destructive)/0.3)]",
    },
  ];

  return (
    <div className="mt-4 pt-4 border-t border-border/40">
      {selected ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="size-4 text-primary flex-shrink-0" />
          <span>
            Marked as{" "}
            <span className="font-semibold text-foreground capitalize">
              {selected}
            </span>{" "}
            — next plan adjusts automatically
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
            How was this session?
          </p>
          <div className="flex gap-2" data-ocid="feedback.buttons">
            {buttons.map((btn) => {
              const isActive = selected === btn.value;
              const isDisabled = !!selected && !isActive;
              return (
                <button
                  key={btn.value}
                  type="button"
                  data-ocid={`feedback.${btn.value}_button`}
                  onClick={() => void handleFeedback(btn.value)}
                  disabled={isDisabled || mutation.isPending}
                  className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg border transition-smooth
                    ${isActive ? btn.active : btn.idle}
                    ${isDisabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── DayCard ───────────────────────────────────────────────────────────────────

interface DayCardProps {
  day: DayPlan;
  planId: bigint;
  index: number;
  isCompleted: boolean;
  completedFeedback?: DifficultyFeedback;
}

function DayCard({
  day,
  planId,
  index,
  isCompleted,
  completedFeedback,
}: DayCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.42,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      }}
      data-ocid={`day_card.item.${index + 1}`}
    >
      <Card
        className={`p-5 border transition-smooth
          ${
            day.isRestDay
              ? "border-border/30 bg-card/50"
              : isCompleted
                ? "border-primary/40 bg-card gradient-card"
                : "border-border/60 bg-card hover:border-primary/30 hover:shadow-lg"
          }
        `}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`size-9 rounded-xl flex items-center justify-center font-bold text-xs font-mono
                ${
                  day.isRestDay
                    ? "bg-muted text-muted-foreground"
                    : isCompleted
                      ? "bg-primary/20 text-primary"
                      : "bg-primary/10 text-primary"
                }
              `}
            >
              {day.dayOfWeek.slice(0, 3).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm leading-tight">
                {day.dayOfWeek}
              </p>
              {!day.isRestDay && (
                <p className="text-xs text-muted-foreground">
                  {day.exercises.length} exercise
                  {day.exercises.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isCompleted && (
              <Badge
                variant="outline"
                className="text-[10px] px-2 py-0.5 bg-primary/15 text-primary border-primary/40 flex items-center gap-1"
              >
                <CheckCircle2 className="size-3" />
                Done
              </Badge>
            )}
            {day.isRestDay && (
              <Badge
                variant="outline"
                className="text-[10px] px-2 py-0.5 bg-muted text-muted-foreground border-border flex items-center gap-1"
              >
                <Moon className="size-3" />
                Rest
              </Badge>
            )}
          </div>
        </div>

        {/* Exercises */}
        {!day.isRestDay ? (
          <div className="space-y-2">
            {day.exercises.map((exercise, ei) => (
              <ExerciseMiniCard
                key={`${exercise.name}-${String(ei)}`}
                exercise={exercise}
              />
            ))}
            <FeedbackButtons
              planId={planId}
              day={day}
              completedFeedback={completedFeedback}
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Recovery is progress. Let your muscles rebuild today.
          </p>
        )}
      </Card>
    </motion.div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function WorkoutResultSkeleton() {
  return (
    <div className="space-y-4" data-ocid="workout_result.loading_state">
      <div className="space-y-2 mb-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-44" />
      </div>
      <Skeleton className="h-16 w-full rounded-xl" />
      {[1, 2, 3, 4, 5, 6, 7].map((n) => (
        <Skeleton key={n} className="h-24 w-full rounded-xl" />
      ))}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function NoPlanState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-24 text-center gap-6"
      data-ocid="workout_result.empty_state"
    >
      <div className="size-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Dumbbell className="size-9 text-primary opacity-70" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">No Plan Yet</h2>
        <p className="text-muted-foreground max-w-sm">
          You haven't generated a weekly workout plan. Fill out your fitness
          profile to get a personalized, adaptive program.
        </p>
      </div>
      <Button
        asChild
        data-ocid="workout_result.create_plan_button"
        className="gap-2"
      >
        <Link to="/workout-form">
          Create My Plan
          <ChevronRight className="size-4" />
        </Link>
      </Button>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function WorkoutResultPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();

  const { data: plan, isLoading: planLoading } = useLatestWorkoutPlan();
  const { data: completedWorkouts = [], isLoading: completedLoading } =
    useCompletedWorkouts();

  // Redirect unauthenticated users to home
  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      void navigate({ to: "/" });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  if (isInitializing || planLoading || completedLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <WorkoutResultSkeleton />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <NoPlanState />
      </div>
    );
  }

  // Build completed lookup: `${planId}-${dayOfWeek}` → feedback
  const completedMap = new Map<string, DifficultyFeedback>();
  for (const cw of completedWorkouts) {
    completedMap.set(
      `${String(cw.planId)}-${cw.dayOfWeek}`,
      cw.difficultyFeedback,
    );
  }

  const sortedDays = [...plan.days].sort(
    (a, b) => DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek),
  );

  const activeDays = sortedDays.filter((d) => !d.isRestDay).length;
  const completedCount = sortedDays.filter((d) =>
    completedMap.has(`${String(plan.planId)}-${d.dayOfWeek}`),
  ).length;
  const progressPct = activeDays > 0 ? (completedCount / activeDays) * 100 : 0;

  const generatedDate = new Date(
    Number(plan.generatedAt) / 1_000_000,
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="max-w-2xl mx-auto px-4 py-10 space-y-6"
      data-ocid="workout_result.page"
    >
      {/* Back nav */}
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground -ml-2"
      >
        <Link to="/dashboard" data-ocid="workout_result.back_button">
          <ArrowLeft className="size-4 mr-1.5" />
          Dashboard
        </Link>
      </Button>

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        data-ocid="workout_result.header"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <CalendarDays className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                Your Weekly Plan
              </h1>
              <p className="text-sm text-muted-foreground">
                Week {String(plan.weekNumber)} · {generatedDate}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void navigate({ to: "/workout-form" })}
            data-ocid="workout_result.regenerate_button"
            className="flex-shrink-0 gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary/10"
          >
            <RefreshCw className="size-3.5" />
            New Plan
          </Button>
        </div>

        {/* Progress bar */}
        <div className="mt-4 p-4 rounded-xl bg-card border border-border/60 flex items-center gap-4">
          <TrendingUp className="size-4 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1.5">
              Weekly Progress — {completedCount}/{activeDays} workout days
            </p>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }}
                className="h-full rounded-full bg-primary"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Day cards */}
      <div className="space-y-3" data-ocid="workout_result.days_list">
        {sortedDays.map((day, index) => {
          const key = `${String(plan.planId)}-${day.dayOfWeek}`;
          return (
            <DayCard
              key={day.dayOfWeek}
              day={day}
              planId={plan.planId}
              index={index}
              isCompleted={completedMap.has(key)}
              completedFeedback={completedMap.get(key)}
            />
          );
        })}
      </div>

      {/* Footer CTAs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65, duration: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 pt-2"
      >
        <Button
          onClick={() => void navigate({ to: "/progress" })}
          data-ocid="workout_result.view_progress_button"
          className="flex-1 gap-2"
        >
          <TrendingUp className="size-4" />
          View Progress
        </Button>
        <Button
          variant="outline"
          onClick={() => void navigate({ to: "/dashboard" })}
          data-ocid="workout_result.dashboard_button"
          className="flex-1 gap-2"
        >
          <ChevronRight className="size-4" />
          Back to Dashboard
        </Button>
      </motion.div>
    </div>
  );
}
