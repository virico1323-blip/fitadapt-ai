import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Common "../types/common";
import ProgressTypes "../types/progress";
import WorkoutTypes "../types/workout";

module {

  public func logWeight(
    weightLog : List.List<ProgressTypes.WeightEntry>,
    userId : Common.UserId,
    weightKg : Float,
  ) : ProgressTypes.WeightEntry {
    let entryId = weightLog.size();
    let entry : ProgressTypes.WeightEntry = {
      entryId;
      userId;
      weightKg;
      loggedAt = Time.now();
    };
    weightLog.add(entry);
    entry;
  };

  public func getWeightHistory(
    weightLog : List.List<ProgressTypes.WeightEntry>,
    userId : Common.UserId,
  ) : [ProgressTypes.WeightEntry] {
    weightLog
      .filter(func(e) { Principal.equal(e.userId, userId) })
      .toArray();
  };

  func difficultyScore(d : Common.DifficultyFeedback) : Float {
    switch (d) {
      case (#easy)   1.0;
      case (#medium) 2.0;
      case (#hard)   3.0;
    };
  };

  // Compute streak: count consecutive days (up to today) that have at least
  // one completed workout, starting from the most recent.
  func computeStreak(workouts : [WorkoutTypes.CompletedWorkout]) : Nat {
    if (workouts.size() == 0) return 0;

    // Collect unique calendar days (nanoseconds / 86_400_000_000_000)
    let nsPerDay : Int = 86_400_000_000_000;
    let today : Int = Time.now() / nsPerDay;

    // Build a Set-like structure via sorted unique day integers
    var days : [Int] = workouts.map<WorkoutTypes.CompletedWorkout, Int>(func(w) {
      w.completedAt / nsPerDay
    });
    // Sort descending
    days := days.sort(func(a, b) {
      if (a > b) #less else if (a < b) #greater else #equal
    });
    // Deduplicate
    var uniqueDays : [Int] = [];
    var prev : ?Int = null;
    for (d in days.values()) {
      switch (prev) {
        case (?p) { if (p != d) { uniqueDays := uniqueDays.concat([d]); prev := ?d } };
        case null { uniqueDays := [d]; prev := ?d };
      };
    };

    // Count streak from today backwards
    var streak = 0;
    var expected = today;
    for (d in uniqueDays.values()) {
      if (d == expected) {
        streak += 1;
        expected -= 1;
      } else if (d < expected) {
        // gap — stop
        // use label to break — not supported in Motoko; we'll track a flag
        expected := -1; // sentinel to stop counting
      };
    };
    streak;
  };

  public func computeStats(
    completedWorkouts : List.List<WorkoutTypes.CompletedWorkout>,
    userId : Common.UserId,
  ) : ProgressTypes.UserStats {
    let userWorkouts = completedWorkouts
      .filter(func(w) { Principal.equal(w.userId, userId) })
      .toArray();

    let total = userWorkouts.size();
    if (total == 0) {
      return { totalWorkoutsCompleted = 0; currentStreak = 0; averageDifficultyScore = 0.0 };
    };

    let scoreSum = userWorkouts.foldLeft(
      0.0,
      func(acc, w) { acc + difficultyScore(w.difficultyFeedback) },
    );
    let avg = scoreSum / total.toFloat();
    let streak = computeStreak(userWorkouts);

    { totalWorkoutsCompleted = total; currentStreak = streak; averageDifficultyScore = avg };
  };

  public func predictGoal(
    weightHistory : [ProgressTypes.WeightEntry],
    targetWeightKg : ?Float,
    currentWeightKg : Float,
    startWeightKg : Float,
  ) : ProgressTypes.GoalPrediction {
    // Need at least 2 entries for a rate calculation
    if (weightHistory.size() < 2) {
      return {
        currentWeightKg;
        targetWeightKg;
        progressPercent = 0.0;
        estimatedWeeksRemaining = null;
        weeklyRateKg = 0.0;
      };
    };

    // Oldest entry first (history is already sorted oldest-first from getWeightHistory)
    let first = weightHistory[0];
    let last  = weightHistory[weightHistory.size() - 1];

    let nsPerWeek : Float = 7.0 * 24.0 * 3600.0 * 1_000_000_000.0;
    let elapsedNs : Float = (last.loggedAt - first.loggedAt).toFloat();
    let elapsedWeeks : Float = if (elapsedNs <= 0.0) 1.0 else elapsedNs / nsPerWeek;

    let weightChange : Float = last.weightKg - first.weightKg;
    let weeklyRate : Float = weightChange / elapsedWeeks;

    // Progress percent toward goal
    let (progressPercent, estimatedWeeks) : (Float, ?Float) = switch (targetWeightKg) {
      case null (0.0, null);
      case (?target) {
        let totalChange = startWeightKg - target; // positive = weight-loss goal
        let achieved   = startWeightKg - currentWeightKg;
        let pct : Float = if (totalChange == 0.0) 100.0
          else (achieved / totalChange) * 100.0;
        let clampedPct : Float = if (pct < 0.0) 0.0 else if (pct > 100.0) 100.0 else pct;

        // Estimate weeks remaining (null if no meaningful rate toward goal)
        let remaining = target - currentWeightKg; // negative = need to lose, positive = need to gain
        let est : ?Float = if (weeklyRate == 0.0) null
          else {
            // Rate and remaining must be in the same direction
            let weeksLeft = remaining / weeklyRate;
            if (weeksLeft <= 0.0) ?0.0 else ?weeksLeft;
          };
        (clampedPct, est);
      };
    };

    {
      currentWeightKg;
      targetWeightKg;
      progressPercent;
      estimatedWeeksRemaining = estimatedWeeks;
      weeklyRateKg = weeklyRate;
    };
  };
};
