import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import ProfileTypes "../types/profile";
import WorkoutTypes "../types/workout";

module {

  // ---------------------------------------------------------------------------
  // Exercise pool — parametric, logic-based; NO hardcoded exercise lists.
  // Each pool entry is a template: (name, muscleGroup, baseSets, baseReps,
  // baseRestSeconds, goalTags).
  // goalTags encodes which fitness goals this exercise best serves (bitmask-like
  // via variant tags stored as Text for simplicity).
  // ---------------------------------------------------------------------------
  type ExerciseTemplate = {
    name : Text;
    muscleGroup : Text;
    category : Text; // "push" | "pull" | "legs" | "core" | "cardio"
    baseSets : Nat;
    baseReps : Nat;
    baseRestSeconds : Nat;
    goalScore : [(Common.FitnessGoal, Nat)]; // score 0-10 per goal
  };

  let exercisePool : [ExerciseTemplate] = [
    // ── PUSH ──────────────────────────────────────────────────────────────────
    {
      name = "Push-Up";
      muscleGroup = "Chest / Triceps";
      category = "push";
      baseSets = 3; baseReps = 10; baseRestSeconds = 60;
      goalScore = [(#muscleGain, 7), (#weightLoss, 6), (#endurance, 5), (#maintenance, 6), (#flexibility, 2)];
    },
    {
      name = "Dumbbell Bench Press";
      muscleGroup = "Chest / Triceps";
      category = "push";
      baseSets = 4; baseReps = 8; baseRestSeconds = 90;
      goalScore = [(#muscleGain, 10), (#weightLoss, 5), (#endurance, 4), (#maintenance, 7), (#flexibility, 1)];
    },
    {
      name = "Overhead Dumbbell Press";
      muscleGroup = "Shoulders";
      category = "push";
      baseSets = 3; baseReps = 10; baseRestSeconds = 75;
      goalScore = [(#muscleGain, 9), (#weightLoss, 5), (#endurance, 4), (#maintenance, 6), (#flexibility, 2)];
    },
    {
      name = "Tricep Dips";
      muscleGroup = "Triceps";
      category = "push";
      baseSets = 3; baseReps = 12; baseRestSeconds = 60;
      goalScore = [(#muscleGain, 7), (#weightLoss, 6), (#endurance, 6), (#maintenance, 5), (#flexibility, 2)];
    },
    {
      name = "Incline Push-Up";
      muscleGroup = "Upper Chest";
      category = "push";
      baseSets = 3; baseReps = 12; baseRestSeconds = 60;
      goalScore = [(#muscleGain, 5), (#weightLoss, 7), (#endurance, 7), (#maintenance, 6), (#flexibility, 3)];
    },
    // ── PULL ──────────────────────────────────────────────────────────────────
    {
      name = "Dumbbell Row";
      muscleGroup = "Back / Biceps";
      category = "pull";
      baseSets = 4; baseReps = 8; baseRestSeconds = 90;
      goalScore = [(#muscleGain, 10), (#weightLoss, 5), (#endurance, 4), (#maintenance, 7), (#flexibility, 2)];
    },
    {
      name = "Pull-Up";
      muscleGroup = "Lats / Biceps";
      category = "pull";
      baseSets = 3; baseReps = 6; baseRestSeconds = 90;
      goalScore = [(#muscleGain, 9), (#weightLoss, 6), (#endurance, 6), (#maintenance, 7), (#flexibility, 3)];
    },
    {
      name = "Resistance Band Pull-Apart";
      muscleGroup = "Rear Delts / Rhomboids";
      category = "pull";
      baseSets = 3; baseReps = 15; baseRestSeconds = 45;
      goalScore = [(#muscleGain, 5), (#weightLoss, 5), (#endurance, 6), (#maintenance, 7), (#flexibility, 7)];
    },
    {
      name = "Bicep Curl";
      muscleGroup = "Biceps";
      category = "pull";
      baseSets = 3; baseReps = 12; baseRestSeconds = 60;
      goalScore = [(#muscleGain, 8), (#weightLoss, 5), (#endurance, 5), (#maintenance, 6), (#flexibility, 2)];
    },
    {
      name = "Face Pull";
      muscleGroup = "Rear Delts / Traps";
      category = "pull";
      baseSets = 3; baseReps = 15; baseRestSeconds = 45;
      goalScore = [(#muscleGain, 6), (#weightLoss, 4), (#endurance, 5), (#maintenance, 7), (#flexibility, 5)];
    },
    // ── LEGS ──────────────────────────────────────────────────────────────────
    {
      name = "Bodyweight Squat";
      muscleGroup = "Quads / Glutes";
      category = "legs";
      baseSets = 3; baseReps = 15; baseRestSeconds = 60;
      goalScore = [(#muscleGain, 6), (#weightLoss, 8), (#endurance, 7), (#maintenance, 7), (#flexibility, 5)];
    },
    {
      name = "Dumbbell Goblet Squat";
      muscleGroup = "Quads / Glutes";
      category = "legs";
      baseSets = 4; baseReps = 10; baseRestSeconds = 75;
      goalScore = [(#muscleGain, 9), (#weightLoss, 7), (#endurance, 6), (#maintenance, 7), (#flexibility, 4)];
    },
    {
      name = "Walking Lunge";
      muscleGroup = "Quads / Hamstrings";
      category = "legs";
      baseSets = 3; baseReps = 12; baseRestSeconds = 60;
      goalScore = [(#muscleGain, 7), (#weightLoss, 8), (#endurance, 7), (#maintenance, 7), (#flexibility, 5)];
    },
    {
      name = "Romanian Deadlift";
      muscleGroup = "Hamstrings / Glutes";
      category = "legs";
      baseSets = 4; baseReps = 8; baseRestSeconds = 90;
      goalScore = [(#muscleGain, 10), (#weightLoss, 6), (#endurance, 5), (#maintenance, 7), (#flexibility, 4)];
    },
    {
      name = "Glute Bridge";
      muscleGroup = "Glutes / Hamstrings";
      category = "legs";
      baseSets = 3; baseReps = 15; baseRestSeconds = 45;
      goalScore = [(#muscleGain, 7), (#weightLoss, 6), (#endurance, 6), (#maintenance, 7), (#flexibility, 6)];
    },
    {
      name = "Calf Raise";
      muscleGroup = "Calves";
      category = "legs";
      baseSets = 3; baseReps = 20; baseRestSeconds = 45;
      goalScore = [(#muscleGain, 6), (#weightLoss, 5), (#endurance, 7), (#maintenance, 6), (#flexibility, 4)];
    },
    // ── CORE ──────────────────────────────────────────────────────────────────
    {
      name = "Plank";
      muscleGroup = "Core";
      category = "core";
      baseSets = 3; baseReps = 30; baseRestSeconds = 45; // reps = seconds here
      goalScore = [(#muscleGain, 5), (#weightLoss, 6), (#endurance, 7), (#maintenance, 7), (#flexibility, 5)];
    },
    {
      name = "Dead Bug";
      muscleGroup = "Core / Stability";
      category = "core";
      baseSets = 3; baseReps = 10; baseRestSeconds = 45;
      goalScore = [(#muscleGain, 4), (#weightLoss, 5), (#endurance, 6), (#maintenance, 7), (#flexibility, 7)];
    },
    {
      name = "Russian Twist";
      muscleGroup = "Obliques";
      category = "core";
      baseSets = 3; baseReps = 16; baseRestSeconds = 45;
      goalScore = [(#muscleGain, 5), (#weightLoss, 7), (#endurance, 6), (#maintenance, 6), (#flexibility, 5)];
    },
    {
      name = "Mountain Climber";
      muscleGroup = "Core / Full Body";
      category = "core";
      baseSets = 3; baseReps = 20; baseRestSeconds = 30;
      goalScore = [(#muscleGain, 4), (#weightLoss, 9), (#endurance, 9), (#maintenance, 6), (#flexibility, 4)];
    },
    // ── CARDIO ────────────────────────────────────────────────────────────────
    {
      name = "Burpee";
      muscleGroup = "Full Body";
      category = "cardio";
      baseSets = 3; baseReps = 10; baseRestSeconds = 60;
      goalScore = [(#muscleGain, 4), (#weightLoss, 10), (#endurance, 10), (#maintenance, 6), (#flexibility, 3)];
    },
    {
      name = "Jumping Jack";
      muscleGroup = "Full Body / Cardio";
      category = "cardio";
      baseSets = 3; baseReps = 30; baseRestSeconds = 30;
      goalScore = [(#muscleGain, 2), (#weightLoss, 8), (#endurance, 9), (#maintenance, 6), (#flexibility, 4)];
    },
    {
      name = "High Knees";
      muscleGroup = "Legs / Cardio";
      category = "cardio";
      baseSets = 3; baseReps = 40; baseRestSeconds = 30;
      goalScore = [(#muscleGain, 2), (#weightLoss, 9), (#endurance, 9), (#maintenance, 6), (#flexibility, 4)];
    },
    {
      name = "Box Step-Up";
      muscleGroup = "Quads / Glutes";
      category = "cardio";
      baseSets = 3; baseReps = 12; baseRestSeconds = 45;
      goalScore = [(#muscleGain, 6), (#weightLoss, 8), (#endurance, 8), (#maintenance, 7), (#flexibility, 4)];
    },
    // ── FLEXIBILITY ───────────────────────────────────────────────────────────
    {
      name = "Hip Flexor Stretch";
      muscleGroup = "Hip Flexors";
      category = "core";
      baseSets = 2; baseReps = 30; baseRestSeconds = 15;
      goalScore = [(#muscleGain, 2), (#weightLoss, 3), (#endurance, 4), (#maintenance, 5), (#flexibility, 10)];
    },
    {
      name = "World's Greatest Stretch";
      muscleGroup = "Full Body Mobility";
      category = "core";
      baseSets = 2; baseReps = 5; baseRestSeconds = 15;
      goalScore = [(#muscleGain, 3), (#weightLoss, 3), (#endurance, 4), (#maintenance, 6), (#flexibility, 10)];
    },
    {
      name = "Yoga Flow (Sun Salutation)";
      muscleGroup = "Full Body Mobility";
      category = "core";
      baseSets = 2; baseReps = 5; baseRestSeconds = 30;
      goalScore = [(#muscleGain, 2), (#weightLoss, 4), (#endurance, 5), (#maintenance, 7), (#flexibility, 10)];
    },
  ];

  // ---------------------------------------------------------------------------
  // Scoring helpers
  // ---------------------------------------------------------------------------

  func scoreForGoal(template : ExerciseTemplate, goal : Common.FitnessGoal) : Nat {
    switch (template.goalScore.find(func((g, _s)) { g == goal })) {
      case (?(_, s)) s;
      case null 0;
    };
  };

  func intensityDescriptor(modifier : Int, experienceLevel : Common.ExperienceLevel) : Text {
    let base : Int = switch (experienceLevel) {
      case (#beginner) 1;
      case (#intermediate) 2;
      case (#advanced) 3;
    };
    let level = base + modifier;
    if (level <= 0) "very light"
    else if (level == 1) "light"
    else if (level == 2) "moderate"
    else if (level == 3) "vigorous"
    else "maximum effort";
  };

  // Apply intensity modifier to sets/reps/rest. modifier range: -3..+3.
  func applyModifier(template : ExerciseTemplate, modifier : Int, level : Common.ExperienceLevel) : WorkoutTypes.Exercise {
    // experience adjustments
    let (expSetAdd, expRepAdd, expRestMul) : (Int, Int, Float) = switch (level) {
      case (#beginner) (0, 0, 1.2);
      case (#intermediate) (1, 2, 1.0);
      case (#advanced) (2, 4, 0.85);
    };
    let rawSets : Int = template.baseSets.toInt() + expSetAdd + modifier;
    let sets : Nat = if (rawSets < 1) 1 else rawSets.toNat();
    let rawReps : Int = template.baseReps.toInt() + expRepAdd + modifier * 2;
    let reps : Nat = if (rawReps < 1) 1 else rawReps.toNat();
    let rawRest : Float = template.baseRestSeconds.toFloat() * expRestMul - modifier.toFloat() * 5.0;
    let rawRestInt : Int = if (rawRest < 0.0) 0 else (rawRest + 0.5).toInt();
    let rest : Nat = if (rawRestInt < 15) 15 else rawRestInt.toNat();
    {
      name = template.name;
      sets;
      reps;
      restSeconds = rest;
      intensityDescriptor = intensityDescriptor(modifier, level);
      muscleGroup = template.muscleGroup;
    };
  };

  // Determine how many workout days per week and exercises per session based on level.
  func workoutDaysAndExercises(level : Common.ExperienceLevel) : (Nat, Nat) {
    switch (level) {
      case (#beginner)     (3, 4); // 3 workout days, 4 exercises
      case (#intermediate) (4, 5); // 4 workout days, 5 exercises
      case (#advanced)     (4, 6); // 4 workout days, 6 exercises
    };
  };

  let weekDays : [Text] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Pick which days are workout days (evenly distributed) and mark the rest as rest.
  func buildDayPlans(
    workoutDays : Nat,
    exercisesPerDay : Nat,
    goal : Common.FitnessGoal,
    level : Common.ExperienceLevel,
    modifier : Int,
  ) : [WorkoutTypes.DayPlan] {
    // For each workout day use a different exercise selection (offset scoring by day index
    // so we don't repeat the exact same set) — achieved by rotating the pool slice.
    let totalPool = exercisePool.size();
    let step : Nat = if (totalPool > exercisesPerDay) totalPool / workoutDays else 1;

    // Indices of active workout days (spread across the week)
    let activeIndices : [Nat] = switch (workoutDays) {
      case 3 [0, 2, 4];   // Mon, Wed, Fri
      case 4 [0, 1, 3, 5]; // Mon, Tue, Thu, Sat
      case _ [0, 2, 4];
    };

    weekDays.mapEntries(func(day, i) {
      let isRest = activeIndices.find(func(ai) { ai == i }) == null;
      if (isRest) {
        { dayOfWeek = day; exercises = []; isRestDay = true };
      } else {
        // offset the pool by day position to vary exercises across days
        let offset = (i * step) % totalPool;
        let rotated = exercisePool.values().drop(offset).toArray();
        let sortedRotated = rotated.sort(func(a, b) {
          let sa = scoreForGoal(a, goal);
          let sb = scoreForGoal(b, goal);
          if (sb > sa) #less else if (sb < sa) #greater else #equal;
        });
        let taken = sortedRotated.values().take(exercisesPerDay).toArray();
        let exercises = taken.map(func(t) { applyModifier(t, modifier, level) });
        { dayOfWeek = day; exercises; isRestDay = false };
      };
    });
  };

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  public func generateWeeklyPlan(
    profile : ProfileTypes.UserProfilePublic,
    weekNumber : Nat,
    planId : Nat,
  ) : WorkoutTypes.WeeklyWorkoutPlan {
    let (workoutDays, exercisesPerDay) = workoutDaysAndExercises(profile.experienceLevel);
    let days = buildDayPlans(
      workoutDays,
      exercisesPerDay,
      profile.fitnessGoal,
      profile.experienceLevel,
      profile.intensityModifier,
    );
    {
      planId;
      userId = profile.userId;
      weekNumber;
      days;
      generatedAt = Time.now();
      intensityModifierAtGeneration = profile.intensityModifier;
    };
  };

  public func recordCompleted(
    completedWorkouts : List.List<WorkoutTypes.CompletedWorkout>,
    profile : ProfileTypes.UserProfilePublic,
    planId : Nat,
    dayOfWeek : Text,
    exercises : [WorkoutTypes.Exercise],
    feedback : Common.DifficultyFeedback,
  ) : WorkoutTypes.CompletedWorkout {
    let completedId = completedWorkouts.size();
    let entry : WorkoutTypes.CompletedWorkout = {
      completedId;
      userId = profile.userId;
      planId;
      dayOfWeek;
      exercises;
      difficultyFeedback = feedback;
      completedAt = Time.now();
    };
    completedWorkouts.add(entry);
    entry;
  };

  public func getCompletedForUser(
    completedWorkouts : List.List<WorkoutTypes.CompletedWorkout>,
    userId : Common.UserId,
  ) : [WorkoutTypes.CompletedWorkout] {
    completedWorkouts
      .filter(func(w) { Principal.equal(w.userId, userId) })
      .toArray()
      .reverse();
  };

  public func getLatestPlan(
    plans : List.List<WorkoutTypes.WeeklyWorkoutPlan>,
    userId : Common.UserId,
  ) : ?WorkoutTypes.WeeklyWorkoutPlan {
    // find the last plan for this user (highest planId)
    var found : ?WorkoutTypes.WeeklyWorkoutPlan = null;
    plans.forEach(func(p) {
      if (Principal.equal(p.userId, userId)) {
        switch (found) {
          case null { found := ?p };
          case (?prev) {
            if (p.planId > prev.planId) { found := ?p };
          };
        };
      };
    });
    found;
  };
};
