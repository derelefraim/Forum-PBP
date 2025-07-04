import { User } from "../../models/user";
import { v4 as uuidv4 } from "uuid";
import { generateToken } from "../utils/jwt_helper";
import { controllerWrapper } from "../utils/controllerWrapper";
import bcrypt from "bcryptjs";

const SECRET_KEY = "RAHASIA123";

// -- POST Login
export const login = controllerWrapper(async (req: any, res: any) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.status(401);
    return { message: "Email tidak ditemukan" };
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401);
    return { message: "Password salah" };
  }
  const token = generateToken(user.user_id);
  return { message: "Berhasil login", token };
});

// -- POST Register
export const register = controllerWrapper(async (req: any, res: any) => {
  const { username, email, password } = req.body;
  const userId = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    userId,
    username,
    email,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  res.status(201);
  return { success: true };
});

// -- GET All Users
export const getAllUser = controllerWrapper(async (req: any, res: any) => {
  const users = await User.findAll();
  return { success: true, users };
});

// -- GET User by ID
export const getUserById = controllerWrapper(async (req: any, res: any) => {
  const userId = req.body.userId;
  const user = await User.findOne({ where: { user_id: userId } });
  if (!user) {
    res.status(404);
    return { message: "User tidak ditemukan" };
  }
  return { success: true, user };
});

// -- Update User
export const updateUser = controllerWrapper(async (req: any, res: any) => {
  const userId = req.body.userId;
  const { username, email, password } = req.body;
  const user = await User.findOne({ where: { user_id: userId } });
  if (!user) {
    res.status(404);
    return { message: "User tidak ditemukan" };
  }
  await User.update(
    { username, email, password },
    { where: { user_id: userId } }
  );
  return { success: true };
});

// -- Logout
export const logout = controllerWrapper(async (req: any, res: any) => {
  return { message: "Berhasil logout" };
});