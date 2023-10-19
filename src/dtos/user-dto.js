module.exports = class UserDto {
  id;
  firstName;
  lastName;
  nickname;
  email;
  isActivated;
  bio;
  profilePicture;
  outgoingFriendRequests;
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
    this.outgoingFriendRequests = model.outgoingFriendRequests;
    this.incomingFriendRequests = model.incomingFriendRequests;
    this.friends = model.friends;
  }
}