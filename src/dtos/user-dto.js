module.exports = class UserDto {
  id;
  firstName;
  lastName;
  nickname;
  email;
  isActivated;

  constructor(model) {
    this.id = model.id;
    this.firstName = model.firstName;
    this.lastName = model.lastName;
    this.nickname = model.nickname;
    this.email = model.email;
    this.isActivated = model.isActivated;
  }
}