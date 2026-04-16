import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Exercise {
    intensityDescriptor: string;
    restSeconds: bigint;
    name: string;
    reps: bigint;
    sets: bigint;
    muscleGroup: string;
}
export type Timestamp = bigint;
export interface GoalPrediction {
    weeklyRateKg: number;
    estimatedWeeksRemaining?: number;
    currentWeightKg: number;
    progressPercent: number;
    targetWeightKg?: number;
}
export interface UserProfilePublic {
    age: bigint;
    experienceLevel: ExperienceLevel;
    fitnessGoal: FitnessGoal;
    heightCm: number;
    userId: UserId;
    name: string;
    createdAt: Timestamp;
    weightKg: number;
    targetWeightKg?: number;
    gender: Gender;
    intensityModifier: bigint;
}
export interface DayPlan {
    dayOfWeek: string;
    exercises: Array<Exercise>;
    isRestDay: boolean;
}
export type UserId = Principal;
export interface CompletedWorkout {
    completedAt: Timestamp;
    completedId: bigint;
    planId: bigint;
    userId: UserId;
    dayOfWeek: string;
    exercises: Array<Exercise>;
    difficultyFeedback: DifficultyFeedback;
}
export interface WeeklyWorkoutPlan {
    planId: bigint;
    userId: UserId;
    days: Array<DayPlan>;
    generatedAt: Timestamp;
    intensityModifierAtGeneration: bigint;
    weekNumber: bigint;
}
export interface UserProfileInput {
    age: bigint;
    experienceLevel: ExperienceLevel;
    fitnessGoal: FitnessGoal;
    heightCm: number;
    name: string;
    weightKg: number;
    targetWeightKg?: number;
    gender: Gender;
}
export interface WeightEntry {
    userId: UserId;
    entryId: bigint;
    weightKg: number;
    loggedAt: Timestamp;
}
export interface UserStats {
    averageDifficultyScore: number;
    totalWorkoutsCompleted: bigint;
    currentStreak: bigint;
}
export enum DifficultyFeedback {
    easy = "easy",
    hard = "hard",
    medium = "medium"
}
export enum ExperienceLevel {
    intermediate = "intermediate",
    beginner = "beginner",
    advanced = "advanced"
}
export enum FitnessGoal {
    weightLoss = "weightLoss",
    flexibility = "flexibility",
    muscleGain = "muscleGain",
    maintenance = "maintenance",
    endurance = "endurance"
}
export enum Gender {
    other = "other",
    female = "female",
    male = "male"
}
export interface backendInterface {
    generateWorkoutPlan(): Promise<WeeklyWorkoutPlan>;
    getCallerUserProfile(): Promise<UserProfilePublic | null>;
    getCompletedWorkouts(): Promise<Array<CompletedWorkout>>;
    getGoalPrediction(): Promise<GoalPrediction>;
    getLatestWorkoutPlan(): Promise<WeeklyWorkoutPlan | null>;
    getUserProfile(user: Principal): Promise<UserProfilePublic | null>;
    getWeightHistory(): Promise<Array<WeightEntry>>;
    getWorkoutStats(): Promise<UserStats>;
    logWeight(weightKg: number): Promise<WeightEntry>;
    saveCallerUserProfile(input: UserProfileInput): Promise<UserProfilePublic>;
    submitWorkoutFeedback(planId: bigint, dayOfWeek: string, exercises: Array<Exercise>, feedback: DifficultyFeedback): Promise<CompletedWorkout>;
}
