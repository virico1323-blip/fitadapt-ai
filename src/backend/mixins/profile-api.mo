import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Common "../types/common";
import ProfileTypes "../types/profile";
import ProfileLib "../lib/profile";

mixin (
  userProfiles : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
) {
  /// Returns the caller's profile, or null if not yet created.
  public query ({ caller }) func getCallerUserProfile() : async ?ProfileTypes.UserProfilePublic {
    ProfileLib.get(userProfiles, caller);
  };

  /// Creates or fully replaces the caller's profile.
  public shared ({ caller }) func saveCallerUserProfile(input : ProfileTypes.UserProfileInput) : async ProfileTypes.UserProfilePublic {
    ProfileLib.update(userProfiles, caller, input);
  };

  /// Returns any user's public profile.
  public query ({ caller = _ }) func getUserProfile(user : Principal) : async ?ProfileTypes.UserProfilePublic {
    ProfileLib.get(userProfiles, user);
  };
};
