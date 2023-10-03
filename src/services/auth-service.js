const bcrypt = require('bcrypt');
const uuid = require('uuid');
const sequelize = require('sequelize');
const db = require('../sequelize/models');
const UserModel = require('../sequelize/models/user')(db, sequelize.DataTypes);
const MailService = require('./mail-service');
const UserDto = require('../dtos/user-dto');
const TokenService = require('./token-service');
const ApiError = require('../exceptions/api-error');


const {
  API_URL
} = require('../config');

class AuthService {
  async login(email, password) {
    const user = await UserModel.findOne({ where: { email } });

    if (!user) {
      throw ApiError.BadRequest('User with this email not found');
    }

    const isPassEquals = await bcrypt.compare(password, user.password);

    if (!isPassEquals) {
      throw ApiError.BadRequest('Incorrect password');
    }

    const userDto = new UserDto(user);

    const tokens = TokenService.generateToken({ ...userDto });

    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    if (!user.isActivated) {
      return {
        ...tokens,
        user: {
          ...userDto,
          isActivated: false,
        },
      }
    }

    return { ...tokens, user: userDto };
  }

  async register(firstName, lastName, nickname, email, password) {
    const candidate = await UserModel.findOne({ where: { email, isActivated: true } });

    if (candidate) {
      throw ApiError.BadRequest(`User with email ${email} already exists`);
    }
    
    if (nickname.findOne({ where: { nickname } })) {
      throw ApiError.BadRequest(`User with nickname ${nickname} already exists`);
    }

    const candidateNotActivated = await UserModel.findOne({ where: { email, isActivated: false } });

    if (candidateNotActivated) {
      UserModel.destroy({ where: { email } });
    }


    const activationLink = uuid.v4();

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      nickname,
      password: hash,
      isActivated: false,
      activationLink,
    })

    await MailService.sendActivationMail(email, `${process.env.ENV === 'DEV' ? process.env.API_URL_DEV : process.env.API_URL_PROD}/auth/activate/${activationLink}`);

    const userDto = new UserDto(user);
    const tokens = TokenService.generateToken({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ where: { activationLink } });
    const existingUser = await UserModel.findOne({ where: { email: user.email, isActivated: true } });

    if (!user) {
      throw ApiError.BadRequest('Incorrect activation link');
    }

    if (existingUser) {
      throw ApiError.BadRequest('User with this email already activated');
    }

    user.isActivated = true;
    await user.save();

    return 'User successfully activated';
  };

  async getAllUsers() {
    const users = UserModel.findAll();

    return users;
  }

  async sendActivationLink(email) {
    const user = await UserModel.findOne({ where: { email } });

    if (!user) {
      throw ApiError.BadRequest('User with this email not found');
    }

    if (user.isActivated) {
      throw ApiError.BadRequest('User with this email already activated');
    }

    const activationLink = uuid.v4();

    user.activationLink = activationLink;

    await user.save();

    await MailService.sendActivationMail(email, `${API_URL}/auth/activate/${activationLink}`);

    return activationLink;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      // console.log('refreshToken', refreshToken);
      throw ApiError.UnauthorizedError();
    }

    const userData = TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await TokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await UserModel.findOne({ where: { id: userData.id } });

    if (!user.Activated) {

      return user.email;
      // throw ApiError.BadRequest('User with this email not activated');
    }

    const userDto = new UserDto(user);
    const tokens = TokenService.generateToken({ ...userDto });

    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }
}

module.exports = new AuthService();
