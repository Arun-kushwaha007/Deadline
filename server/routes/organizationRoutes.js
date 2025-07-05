import express from 'express';
import {
  getAllOrganizations,
  createOrganization,
  getOrganizationById,
  addMember,
  assignTask,
  getMyOrganizations,
  getOrganizationMembers, // Import the new controller function
} from '../controllers/organizationController.js';

const router = express.Router();

import authMiddleware from '../middleware/authMiddleware.js';

// GET all organizations (should this be /mine or a separate admin route?)
// For now, keeping it as is, but /mine is more specific for user's orgs.
router.get('/', authMiddleware, getAllOrganizations); 

// GET organizations for the logged-in user
router.get('/mine', authMiddleware, getMyOrganizations);

// POST create a new organization
router.post('/create', authMiddleware, createOrganization);

// GET specific organization by ID
router.get('/:id', getOrganizationById);

// GET members of a specific organization by ID
router.get('/:id/members', authMiddleware, getOrganizationMembers);

// POST add a member to an organization
router.post('/:id/members', addMember);

// POST assign a task to a member
router.post('/:id/tasks', assignTask);

export default router;
