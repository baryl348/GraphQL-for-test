const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Event = require("../../models/event");
const User = require("../../models/user");

const transformEvent = (event) => {
  return {
    ...event._doc,
    start: event._doc.start,
    end: event._doc.end,
    loading: event._doc.loading,
  };
};

module.exports = {
  events: async (args, req) => {
    // if (!req.isAuth) {
    //   throw new Error("Не авторизован!");
    // }
    try {
      const events = await Event.find();
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },


  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Не авторизован!");
    }
    const event = new Event({
      title: args.eventInput.title,
      completed: args.eventInput.completed,
      executionTime: args.eventInput.executionTime,
      activeTime: args.eventInput.activeTime,
      employeesInProcess: args.eventInput.employeesInProcess,
      scriptsInProcess: args.eventInput.scriptsInProcess,
      start: args.eventInput.start,
      end: args.eventInput.end,
      loading: args.eventInput.loading,
    });
    try {
      const result = await event.save();
      return transformEvent(result);
    } catch (err) {
      throw err;
    }
  },
  createUser: async (args, req) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("Пользователь существует!");
      }
      const hashPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashPassword,
        firstName: args.userInput.firstName,
        secondName: args.userInput.secondName,
      });
      const result = await user.save();
      return { ...result._doc, password: null };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      throw new Error("Пользователь не найден!");
    }
    const isEqual = await bcrypt.compare(password, existingUser.password);
    if (!isEqual) {
      throw new Error("Пароль введен не верно!");
    }
    const token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "secretOrPrivateKeyForUserToken123",
      {
        expiresIn: "1h",
      }
    );
    return {
      userId: existingUser.id,
      token: token,
      tokenExpiration: 1,
      firstName: existingUser.firstName,
      secondName: existingUser.secondName,
    };
  },
  verifyUser: async ({ email, password }) => {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      throw new Error("Пользователь не найден!");
    }
    const isEqual = await bcrypt.compare(password, existingUser.password);
    if (!isEqual) {
      throw new Error("Пароль введен не верно!");
    }

    // const user = (existingUser = await User.findOne({ email, password }));
    // if (!user) throw new Error("Пользователь не найден!");

    const { firstName, secondName, id: userId, token } = existingUser;
    return {
      userId,
      token,
      tokenExpiration: 1,
      firstName,
      secondName,
    };
  },
  updateUser: async (args, req) => {
    const hashPassword = await bcrypt.hash(args.userInput.password, 12);
    // if (!req.isAuth) {
    //   throw new Error("Не авторизован!");
    // }
    const existingUser = await User.findById(args.id);
    existingUser.overwrite({
      email: args.userInput.email,
      password: hashPassword,
      firstName: args.userInput.firstName,
      secondName: args.userInput.secondName,
    });

    const result = await existingUser.save();
    return { ...result._doc, password: null };
  },
};
