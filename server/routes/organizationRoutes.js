import express from 'express';
import {
  getAllOrganizations,
  createOrganization,
  getOrganizationById,
  addMember,
  assignTask,
} from '../controllers/organizationController.js';

const router = express.Router();

import authMiddleware from '../middleware/authMiddleware.js';

// GET all organizations
router.get('/', authMiddleware, getAllOrganizations);

// POST create a new organization
router.post('/create', authMiddleware, createOrganization);

// GET specific organization by ID
router.get('/:id', getOrganizationById);

// POST add a member to an organization
router.post('/:id/members', addMember);

// POST assign a task to a member
router.post('/:id/tasks', assignTask);

export default router;
