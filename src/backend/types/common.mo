module {
  public type UserId = Principal;
  public type Timestamp = Int; // nanoseconds from Time.now()

  public type FitnessGoal = {
    #weightLoss;
    #muscleGain;
    #endurance;
    #maintenance;
    #flexibility;
  };

  public type ExperienceLevel = {
    #beginner;
    #intermediate;
    #advanced;
  };

  public type Gender = {
    #male;
    #female;
    #other;
  };

  public type DifficultyFeedback = {
    #easy;
    #medium;
    #hard;
  };
};
