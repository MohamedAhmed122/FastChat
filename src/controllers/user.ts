// controllers/userController.ts
import {Request, Response} from 'express';
import User from '../models/user';

// Controller function to create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const {firstName, lastName, avatar} = req.body;

    // Create a new user instance
    const user = new User({firstName, lastName, avatar});

    await user.save();

    res.status(201).json({success: true, user});
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({success: false, error: 'Failed to create user'});
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Find all users in the database
    const users = await User.find();

    res.json({users});
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({success: false, error: 'Failed to fetch users'});
  }
};
