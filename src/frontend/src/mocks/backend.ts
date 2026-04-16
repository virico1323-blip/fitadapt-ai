import type { backendInterface, CompletedWorkout, WeeklyWorkoutPlan, UserProfilePublic, GoalPrediction, WeightEntry, UserStats, Exercise, DayPlan } from "../backend";
import { DifficultyFeedback, ExperienceLevel, FitnessGoal, Gender } from "../backend";
import type { Principal } from "@icp-sdk/core/principal";

const mockUserId = { toText: () => "aaaaa-aa" } as unknown as Principal;

const mockExercises: Exercise[] = [
  { name: "Push-Up", muscleGroup: "Chest", sets: BigInt(3), reps: BigInt(12), restSeconds: BigInt(60), intensityDescriptor: "moderate" },
  { name: "Squat", muscleGroup: "Legs", sets: BigInt(3), reps: BigInt(15), restSeconds: BigInt(60), intensityDescriptor: "moderate" },
  { name: "Pull-Up", muscleGroup: "Back", sets: BigInt(3), reps: BigInt(8), restSeconds: BigInt(90), intensityDescriptor: "hard" },
  { name: "Plank", muscleGroup: "Core", sets: BigInt(3), reps: BigInt(1), restSeconds: BigInt(45), intensityDescriptor: "moderate" },
  { name: "Lunges", muscleGroup: "Legs", sets: BigInt(3), reps: BigInt(12), restSeconds: BigInt(60), intensityDescriptor: "easy" },
];

const mockDays: DayPlan[] = [
  { dayOfWeek: "Monday", exercises: [mockExercises[0], mockExercises[1]], isRestDay: false },
  { dayOfWeek: "Tuesday", exercises: [], isRestDay: true },
  { dayOfWeek: "Wednesday", exercises: [mockExercises[2], mockExercises[3]], isRestDay: false },
  { dayOfWeek: "Thursday", exercises: [], isRestDay: true },
  { dayOfWeek: "Friday", exercises: [mockExercises[0], mockExercises[4], mockExercises[1]], isRestDay: false },
  { dayOfWeek: "Saturday", exercises: [mockExercises[2]], isRestDay: false },
  { dayOfWeek: "Sunday", exercises: [], isRestDay: true },
];

const mockPlan: WeeklyWorkoutPlan = {
  planId: BigInt(1),
  userId: mockUserId,
  days: mockDays,
  generatedAt: BigInt(Date.now()) * BigInt(1_000_000),
  intensityModifierAtGeneration: BigInt(5),
  weekNumber: BigInt(1),
};

const mockProfile: UserProfilePublic = {
  userId: mockUserId,
  name: "Alex Johnson",
  age: BigInt(28),
  gender: Gender.male,
  heightCm: 178,
  weightKg: 78,
  targetWeightKg: 72,
  fitnessGoal: FitnessGoal.weightLoss,
  experienceLevel: ExperienceLevel.intermediate,
  createdAt: BigInt(Date.now() - 30 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  intensityModifier: BigInt(5),
};

const mockGoalPrediction: GoalPrediction = {
  currentWeightKg: 78,
  targetWeightKg: 72,
  weeklyRateKg: 0.5,
  estimatedWeeksRemaining: 12,
  progressPercent: 30,
};

const mockWeightHistory: WeightEntry[] = [
  { entryId: BigInt(1), userId: mockUserId, weightKg: 82, loggedAt: BigInt(Date.now() - 60 * 24 * 60 * 60 * 1000) * BigInt(1_000_000) },
  { entryId: BigInt(2), userId: mockUserId, weightKg: 80, loggedAt: BigInt(Date.now() - 45 * 24 * 60 * 60 * 1000) * BigInt(1_000_000) },
  { entryId: BigInt(3), userId: mockUserId, weightKg: 79.2, loggedAt: BigInt(Date.now() - 30 * 24 * 60 * 60 * 1000) * BigInt(1_000_000) },
  { entryId: BigInt(4), userId: mockUserId, weightKg: 78.5, loggedAt: BigInt(Date.now() - 15 * 24 * 60 * 60 * 1000) * BigInt(1_000_000) },
  { entryId: BigInt(5), userId: mockUserId, weightKg: 78, loggedAt: BigInt(Date.now()) * BigInt(1_000_000) },
];

const mockStats: UserStats = {
  totalWorkoutsCompleted: BigInt(14),
  currentStreak: BigInt(5),
  averageDifficultyScore: 0.62,
};

const mockCompletedWorkouts: CompletedWorkout[] = [
  {
    completedId: BigInt(1),
    planId: BigInt(1),
    userId: mockUserId,
    dayOfWeek: "Monday",
    exercises: [mockExercises[0], mockExercises[1]],
    difficultyFeedback: DifficultyFeedback.medium,
    completedAt: BigInt(Date.now() - 7 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
  {
    completedId: BigInt(2),
    planId: BigInt(1),
    userId: mockUserId,
    dayOfWeek: "Wednesday",
    exercises: [mockExercises[2], mockExercises[3]],
    difficultyFeedback: DifficultyFeedback.hard,
    completedAt: BigInt(Date.now() - 5 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
  },
];

export const mockBackend: backendInterface = {
  generateWorkoutPlan: async () => mockPlan,
  getCallerUserProfile: async () => mockProfile,
  getCompletedWorkouts: async () => mockCompletedWorkouts,
  getGoalPrediction: async () => mockGoalPrediction,
  getLatestWorkoutPlan: async () => mockPlan,
  getUserProfile: async (_user: Principal) => mockProfile,
  getWeightHistory: async () => mockWeightHistory,
  getWorkoutStats: async () => mockStats,
  logWeight: async (weightKg: number) => ({
    entryId: BigInt(Date.now()),
    userId: mockUserId,
    weightKg,
    loggedAt: BigInt(Date.now()) * BigInt(1_000_000),
  }),
  saveCallerUserProfile: async (_input) => mockProfile,
  submitWorkoutFeedback: async (planId, dayOfWeek, exercises, feedback) => ({
    completedId: BigInt(Date.now()),
    planId,
    userId: mockUserId,
    dayOfWeek,
    exercises,
    difficultyFeedback: feedback,
    completedAt: BigInt(Date.now()) * BigInt(1_000_000),
  }),
};
