import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { secret } from "../config/config.js";
import User from "../model/User.js";

const sequelize = User.sequelize;

export const registerUser = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, last_name, phone, address, email, password, type_of_user } =
      req.body;
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "The email is already registered in the system." });
    } else {
      await User.create({
        name: name,
        last_name: last_name,
        phone: phone,
        address: address,
        email: email,
        password: hashedPassword,
        type_of_user: type_of_user,
      });
    }
    const userCreated = await User.findOne({ where: { email }, transaction });
    const token = jwt.sign(
      {
        id: userCreated.id,
        email: userCreated.email,
        type_of_user: userCreated.type_of_user,
      },
      secret,
      { expiresIn: 60 * 30 }
    );
    await transaction.commit();
    res.json({ auth: true, token: token });
  } catch (error) {
    await transaction.rollback();
    console.error("Error registering user as administrator.", error);
    res.status(500).send("Internal Server Error.");
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    if (!user.status) {
      return res.status(400).json({ message: "User account is inactive." });
    }
    const passwordIsValid = await bcryptjs.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    const token = jwt.sign(
      {
        id: user.user_id,
        email: email,
        type_of_user: user.type_of_user,
      },
      secret,
      { expiresIn: 60 * 30 }
    );
    res.json({ auth: true, token: token });
  } catch (error) {
    console.error("Error logging in user.", error);
    res.status(500).send("Internal Server Error.");
  }
};

export const updateUser = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      id,
      name,
      last_name,
      phone,
      address,
      email,
      password,
      type_of_user,
    } = req.body;
    const existingUser = await User.findByPk(id, { transaction });
    if (!existingUser) {
      await transaction.rollback();
      return res.status(400).json({ message: "User does not exist." });
    }
    if (existingUser.status === false) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "User exists but is logically deleted." });
    }
    let hashedPassword = existingUser.password;
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashedPassword = await bcryptjs.hash(password, salt);
    }
    await User.update(
      {
        id,
        name,
        last_name,
        phone,
        address,
        email,
        password: hashedPassword,
        type_of_user,
      },
      {
        where: { id: id },
      }
    );
    await transaction.commit();
    res.json({ message: "User updated successfully." });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating user.", error);
    res.status(500).send("Internal Server Error.");
  }
};

export const deleteLogicallyUser = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.body;
    const existingUser = await User.findByPk(id);
    if (!existingUser) {
      await transaction.rollback();
      return res.status(404).json({ message: "User does not exist." });
    }
    if (!existingUser.status) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "User has already been logically deleted." });
    }
    await User.update(
      {
        status: false,
      },
      {
        where: { id: id },
      }
    );
    await transaction.commit();
    res.status(200).json({ message: "User logically deleted successfully." });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting user logically.", error);
    res.status(500).send("Internal Server Error.");
  }
};

export const userList = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const numericLimit = parseInt(limit, 10);
    const numericPage = parseInt(page, 10);
    const offset = (numericPage - 1) * numericLimit;
    const totalUsers = await User.count({ where: { status: true } });
    const users = await User.findAll({
      where: { status: true },
      attributes: { exclude: ["password"] },
      limit: numericLimit,
      offset: offset,
    });
    const totalPages = Math.ceil(totalUsers / numericLimit);
    if (!users || (Array.isArray(users) && users.length === 0)) {
      return res.status(404).json({ message: "No users found." });
    }
    res.json({
      totalUsers: totalUsers,
      totalPages: totalPages,
      currentPage: numericPage,
      users: users,
    });
  } catch (error) {
    console.error("Error when displaying the list of users", error);
    res.status(500).send("Internal Server Error.");
  }
};

export const listDoctors = async (req, res, next) => {
  try {
    const doctors = await User.findAll({
      where: { type_of_user: "DOCTOR", status: true },
      attributes: { exclude: ["password"] },
    });
    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found." });
    }
    res.json(doctors);
  } catch (error) {
    console.error("Error listing doctors", error);
    res.status(500).send("Internal Server Error.");
  }
};

export const totalDoctors = async (req, res, next) => {
  try {
    const totalDoctors = await User.count({
      where: { type_of_user: "DOCTOR", status: true },
    });
    res.json({ totalDoctors });
  } catch (error) {
    console.error("Error counting doctors", error);
    res.status(500).send("Internal Server Error.");
  }
};
