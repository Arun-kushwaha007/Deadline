import express from 'express';
import {
  getAllOrganizations,
  createOrganization,
  getOrganizationById,
  addMember,
  assignTask,
} from '../controllers/organizationController.js';

const router = express.Router();

router.get('/', getAllOrganizations);
router.post('/create', createOrganization);
router.get('/:id', getOrganizationById);
router.post('/:id/add-member', addMember);
router.post('/:id/assign-task', assignTask);

export default router;
