import { Request, Response } from 'express';
import { getAllUsersService, createUserService, deleteUserService, updateUserService, getUserByIdService } from '../services/userService';
import { IUser } from '../models/interfaces';
import { failResponse, successResponse } from '../utils/response';
import { StatusCode } from '../utils/StatusCodes';
import { Messages, UserAddressFields } from '../utils/constants';


export interface UserQuery { search: string, page: number, limit: number, userType: string }

// GET all users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsersService(req.query as any);
    successResponse(res, users, '', StatusCode.OK);
  } catch (error: any) {
    failResponse(res, error?.message || error, StatusCode.Bad_Request)
  }
};

// POST create new user
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const newUser: IUser | any = await createUserService({ ...req.body, createdBy: null, updatedBy: null });
    if (newUser?.message === Messages.Duplicate_Email || !newUser?.email) {
      failResponse(res, newUser?.message, StatusCode.Bad_Request)
      return;
    }
    successResponse(res, newUser, Messages.User_Created, StatusCode.Created);
  } catch (error: any) {
    failResponse(res, error?.message || error, StatusCode.Bad_Request)
  }
};


// Delete delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const newUser: IUser | any = await deleteUserService(id);
    if (newUser?.message) {
      failResponse(res, newUser?.message, StatusCode.Bad_Request)
      return;
    }
    successResponse(res, { email: newUser?.email }, Messages.User_Deleted, StatusCode.OK);
  } catch (error: any) {
    failResponse(res, error?.message || error, StatusCode.Bad_Request)
  }
};

// Put update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const updatedUser: IUser | any = await updateUserService(id, req.body);
    if (updatedUser?.message) {
      failResponse(res, updatedUser?.message, StatusCode.Bad_Request);
      return
    }
    successResponse(res, updatedUser, Messages.User_Updated, StatusCode.OK);
  } catch (err: any) {
    console.log('err', err)
    failResponse(res, err?.message || err, StatusCode.Bad_Request)
  }
}

// Get user By Id
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const user: IUser | any = await getUserByIdService(id);
    if (user?.message) {
      failResponse(res, user?.message, StatusCode.Bad_Request);
      return
    }
    successResponse(res, user, Messages.User_Updated, StatusCode.OK);
  } catch (err: any) {
    console.log('err', err)
    failResponse(res, err?.message || err, StatusCode.Bad_Request)
  }
}
