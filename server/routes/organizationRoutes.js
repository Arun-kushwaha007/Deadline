import express from 'express';
import {
  getAllOrganizations,
  createOrganization,
  getOrganizationById,
  addMember,
  assignTask,
  getMyOrganizations,
  getOrganizationMembers, 
  removeMemberFromOrganization,
} from '../controllers/organizationController.js';

const router = express.Router();

import authMiddleware from '../middleware/authMiddleware.js';

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

// DELETE a member from an organization
router.delete('/:id/members/:memberId', authMiddleware, removeMemberFromOrganization);

export default router;
