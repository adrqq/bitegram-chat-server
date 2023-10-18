module.exports = class UserDto {
  id;
  firstName;
  lastName;
  nickname;
  email;
  isActivated;
  bio;
  profilePicture;
  incomingFriendRequests;
  friends;

  constructor(model) {
    this.id = model.id;
    this.firstName = model.firstName;
    this.lastName = model.lastName;
    this.nickname = model.nickname;
    this.email = model.email;
    this.isActivated = model.isActivated;
    this.bio = model.bio;
    this.profilePicture = model.profilePicture;
    this.incomingFriendRequests = model.incomingFriendRequests;
    this.friends = model.friends;
  }
}