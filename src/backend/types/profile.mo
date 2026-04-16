import Common "common";

module {
  public type UserProfile = {
    userId : Common.UserId;
    name : Text;
    age : Nat;
    gender : Common.Gender;
    heightCm : Float;
    weightKg : Float;
    fitnessGoal : Common.FitnessGoal;
    experienceLevel : Common.ExperienceLevel;
    targetWeightKg : ?Float;
    createdAt : Common.Timestamp;
    var intensityModifier : Int; // adaptive adjustment: -2..+2 relative to baseline
  };

  // Shared (API boundary) version — no var fields
  public type UserProfilePublic = {
    userId : Common.UserId;
    name : Text;
    age : Nat;
    gender : Common.Gender;
    heightCm : Float;
    weightKg : Float;
    fitnessGoal : Common.FitnessGoal;
    experienceLevel : Common.ExperienceLevel;
    targetWeightKg : ?Float;
    createdAt : Common.Timestamp;
    intensityModifier : Int;
  };

  // Input type used when creating/updating a profile
  public type UserProfileInput = {
    name : Text;
    age : Nat;
    gender : Common.Gender;
    heightCm : Float;
    weightKg : Float;
    fitnessGoal : Common.FitnessGoal;
    experienceLevel : Common.ExperienceLevel;
    targetWeightKg : ?Float;
  };
};
