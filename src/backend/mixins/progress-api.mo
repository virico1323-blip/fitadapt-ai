import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import ProfileTypes "../types/profile";
import ProgressTypes "../types/progress";
import WorkoutTypes "../types/workout";
import ProfileLib "../lib/profile";
import ProgressLib "../lib/progress";

mixin (
  userProfiles : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
  weightLog : List.List<ProgressTypes.WeightEntry>,
  completedWorkouts : List.List<WorkoutTypes.CompletedWorkout>,
) {
  /// Logs the caller's current weight.
  public shared ({ caller }) func logWeight(weightKg : Float) : async ProgressTypes.WeightEntry {
    ProgressLib.logWeight(weightLog, caller, weightKg);
  };

  /// Returns the caller's full weight history, oldest first.
  public query ({ caller }) func getWeightHistory() : async [ProgressTypes.WeightEntry] {
    ProgressLib.getWeightHistory(weightLog, caller);
  };

  /// Returns cumulative workout stats for the caller.
  public query ({ caller }) func getWorkoutStats() : async ProgressTypes.UserStats {
    ProgressLib.computeStats(completedWorkouts, caller);
  };

  /// Returns a linear goal projection toward the caller's target weight.
  public query ({ caller }) func getGoalPrediction() : async ProgressTypes.GoalPrediction {
    let profile = switch (ProfileLib.get(userProfiles, caller)) {
      case (?p) p;
      case null Runtime.trap("Profile not found");
    };
    let history = ProgressLib.getWeightHistory(weightLog, caller);
    let currentWeight : Float = if (history.size() > 0) history[history.size() - 1].weightKg else profile.weightKg;
    let startWeight : Float = if (history.size() > 0) history[0].weightKg else profile.weightKg;
    ProgressLib.predictGoal(history, profile.targetWeightKg, currentWeight, startWeight);
  };
};
