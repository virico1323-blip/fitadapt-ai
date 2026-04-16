import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DifficultyFeedback, Exercise, UserProfileInput } from "../types";
import { useBackend } from "./useBackend";

// ── Queries ──────────────────────────────────────────────────────────────────

export function useUserProfile() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLatestWorkoutPlan() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["latestWorkoutPlan"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLatestWorkoutPlan();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCompletedWorkouts() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["completedWorkouts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCompletedWorkouts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useWeightHistory() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["weightHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWeightHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useWorkoutStats() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["workoutStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWorkoutStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGoalPrediction() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["goalPrediction"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getGoalPrediction();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useSaveUserProfile() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UserProfileInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveCallerUserProfile(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      void queryClient.invalidateQueries({ queryKey: ["goalPrediction"] });
    },
  });
}

export function useGenerateWorkoutPlan() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.generateWorkoutPlan();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["latestWorkoutPlan"] });
    },
  });
}

export function useSubmitWorkoutFeedback() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      planId,
      dayOfWeek,
      exercises,
      feedback,
    }: {
      planId: bigint;
      dayOfWeek: string;
      exercises: Exercise[];
      feedback: DifficultyFeedback;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitWorkoutFeedback(
        planId,
        dayOfWeek,
        exercises,
        feedback,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["completedWorkouts"] });
      void queryClient.invalidateQueries({ queryKey: ["workoutStats"] });
      void queryClient.invalidateQueries({ queryKey: ["latestWorkoutPlan"] });
    },
  });
}

export function useLogWeight() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (weightKg: number) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.logWeight(weightKg);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["weightHistory"] });
      void queryClient.invalidateQueries({ queryKey: ["goalPrediction"] });
    },
  });
}
