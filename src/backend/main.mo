import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import ProfileTypes "types/profile";
import WorkoutTypes "types/workout";
import ProgressTypes "types/progress";
import ProfileMixin "mixins/profile-api";
import WorkoutMixin "mixins/workout-api";
import ProgressMixin "mixins/progress-api";

actor {
  // Domain state
  let userProfiles = Map.empty<Principal, ProfileTypes.UserProfile>();
  let weeklyPlans = List.empty<WorkoutTypes.WeeklyWorkoutPlan>();
  let completedWorkouts = List.empty<WorkoutTypes.CompletedWorkout>();
  let weightLog = List.empty<ProgressTypes.WeightEntry>();

  // Mixin inclusions
  include ProfileMixin(userProfiles);
  include WorkoutMixin(userProfiles, weeklyPlans, completedWorkouts);
  include ProgressMixin(userProfiles, weightLog, completedWorkouts);
};
