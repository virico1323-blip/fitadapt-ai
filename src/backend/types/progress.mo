import Common "common";

module {
  public type WeightEntry = {
    entryId : Nat;
    userId : Common.UserId;
    weightKg : Float;
    loggedAt : Common.Timestamp;
  };

  public type UserStats = {
    totalWorkoutsCompleted : Nat;
    currentStreak : Nat; // consecutive days with at least one workout
    averageDifficultyScore : Float; // easy=1, medium=2, hard=3
  };

  public type GoalPrediction = {
    currentWeightKg : Float;
    targetWeightKg : ?Float;
    progressPercent : Float; // 0.0 - 100.0
    estimatedWeeksRemaining : ?Float; // null if no target or no progress data
    weeklyRateKg : Float; // positive = gaining, negative = losing
  };
};
