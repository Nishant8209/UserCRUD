import { Router } from 'express';
import {  createUser, deleteUser,  getUserById, getUsers, updateUser, } from '../controllers/userController';

const router = Router();

// Define routes
router.get('/',  getUsers);
router.post('/create', createUser);
router.delete('/:id',  deleteUser)
router.put('/:id',  updateUser);
router.get('/:id', getUserById);



export default router;