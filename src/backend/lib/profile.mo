import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import ProfileTypes "../types/profile";

module {
  public func toPublic(p : ProfileTypes.UserProfile) : ProfileTypes.UserProfilePublic {
    {
      userId = p.userId;
      name = p.name;
      age = p.age;
      gender = p.gender;
      heightCm = p.heightCm;
      weightKg = p.weightKg;
      fitnessGoal = p.fitnessGoal;
      experienceLevel = p.experienceLevel;
      targetWeightKg = p.targetWeightKg;
      createdAt = p.createdAt;
      intensityModifier = p.intensityModifier;
    };
  };

  public func create(
    profiles : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
    caller : Common.UserId,
    input : ProfileTypes.UserProfileInput,
  ) : ProfileTypes.UserProfilePublic {
    let profile : ProfileTypes.UserProfile = {
      userId = caller;
      name = input.name;
      age = input.age;
      gender = input.gender;
      heightCm = input.heightCm;
      weightKg = input.weightKg;
      fitnessGoal = input.fitnessGoal;
      experienceLevel = input.experienceLevel;
      targetWeightKg = input.targetWeightKg;
      createdAt = Time.now();
      var intensityModifier = 0;
    };
    profiles.add(caller, profile);
    toPublic(profile);
  };

  public func update(
    profiles : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
    caller : Common.UserId,
    input : ProfileTypes.UserProfileInput,
  ) : ProfileTypes.UserProfilePublic {
    switch (profiles.get(caller)) {
      case (?existing) {
        // Preserve intensityModifier and createdAt across updates
        let updated : ProfileTypes.UserProfile = {
          userId = caller;
          name = input.name;
          age = input.age;
          gender = input.gender;
          heightCm = input.heightCm;
          weightKg = input.weightKg;
          fitnessGoal = input.fitnessGoal;
          experienceLevel = input.experienceLevel;
          targetWeightKg = input.targetWeightKg;
          createdAt = existing.createdAt;
          var intensityModifier = existing.intensityModifier;
        };
        profiles.add(caller, updated);
        toPublic(updated);
      };
      case null {
        create(profiles, caller, input);
      };
    };
  };

  public func get(
    profiles : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
    userId : Common.UserId,
  ) : ?ProfileTypes.UserProfilePublic {
    switch (profiles.get(userId)) {
      case (?p) ?toPublic(p);
      case null null;
    };
  };

  public func applyFeedback(
    profiles : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
    userId : Common.UserId,
    feedback : Common.DifficultyFeedback,
  ) {
    switch (profiles.get(userId)) {
      case (?p) {
        let delta : Int = switch (feedback) {
          case (#hard) 1;
          case (#easy) -1;
          case (#medium) 0;
        };
        let current = p.intensityModifier;
        let newMod : Int = if (current + delta > 3) 3
          else if (current + delta < -3) -3
          else current + delta;
        p.intensityModifier := newMod;
      };
      case null {
        Runtime.trap("Profile not found for feedback");
      };
    };
  };
};
