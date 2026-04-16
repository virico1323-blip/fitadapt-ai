import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import ProfileTypes "../types/profile";
import WorkoutTypes "../types/workout";
import ProfileLib "../lib/profile";
import WorkoutLib "../lib/workout";

mixin (
  userProfiles : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
  weeklyPlans : List.List<WorkoutTypes.WeeklyWorkoutPlan>,
  completedWorkouts : List.List<WorkoutTypes.CompletedWorkout>,
) {
  /// Generates and stores a new weekly plan for the caller based on their profile.
  public shared ({ caller }) func generateWorkoutPlan() : async WorkoutTypes.WeeklyWorkoutPlan {
    let profile = switch (ProfileLib.get(userProfiles, caller)) {
      case (?p) p;
      case null Runtime.trap("Profile not found — please create a profile first");
    };
    // week number = total plans for this user + 1
    var userPlanCount : Nat = 0;
    weeklyPlans.forEach(func(p) {
      if (Principal.equal(p.userId, caller)) { userPlanCount += 1 };
    });
    let planId = weeklyPlans.size();
    let plan = WorkoutLib.generateWeeklyPlan(profile, userPlanCount + 1, planId);
    weeklyPlans.add(plan);
    plan;
  };

  /// Returns the caller's most recently generated plan.
  public query ({ caller }) func getLatestWorkoutPlan() : async ?WorkoutTypes.WeeklyWorkoutPlan {
    WorkoutLib.getLatestPlan(weeklyPlans, caller);
  };

  /// Records a completed workout day and applies adaptive feedback to the caller's profile.
  public shared ({ caller }) func submitWorkoutFeedback(
    planId : Nat,
    dayOfWeek : Text,
    exercises : [WorkoutTypes.Exercise],
    feedback : Common.DifficultyFeedback,
  ) : async WorkoutTypes.CompletedWorkout {
    let profile = switch (ProfileLib.get(userProfiles, caller)) {
      case (?p) p;
      case null Runtime.trap("Profile not found");
    };
    // Apply adaptive modifier to stored profile
    ProfileLib.applyFeedback(userProfiles, caller, feedback);
    WorkoutLib.recordCompleted(completedWorkouts, profile, planId, dayOfWeek, exercises, feedback);
  };

  /// Returns the caller's completed workout history, newest first.
  public query ({ caller }) func getCompletedWorkouts() : async [WorkoutTypes.CompletedWorkout] {
    WorkoutLib.getCompletedForUser(completedWorkouts, caller);
  };
};
