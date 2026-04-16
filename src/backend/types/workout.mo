import Common "common";

module {
  public type Exercise = {
    name : Text;
    sets : Nat;
    reps : Nat;
    restSeconds : Nat;
    intensityDescriptor : Text; // e.g. "light", "moderate", "vigorous"
    muscleGroup : Text;
  };

  public type DayPlan = {
    dayOfWeek : Text; // "Monday" .. "Sunday"
    exercises : [Exercise];
    isRestDay : Bool;
  };

  public type WeeklyWorkoutPlan = {
    planId : Nat;
    userId : Common.UserId;
    weekNumber : Nat;
    days : [DayPlan];
    generatedAt : Common.Timestamp;
    intensityModifierAtGeneration : Int;
  };

  public type CompletedWorkout = {
    completedId : Nat;
    userId : Common.UserId;
    planId : Nat;
    dayOfWeek : Text;
    exercises : [Exercise];
    difficultyFeedback : Common.DifficultyFeedback;
    completedAt : Common.Timestamp;
  };
};
