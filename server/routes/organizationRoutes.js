const express = require('express');
const router = express.Router();
const orgController = require('../controllers/organizationController');

router.get('/', orgController.getAllOrganizations);
router.post('/create', orgController.createOrganization);
router.get('/:id', orgController.getOrganizationById);
router.post('/:id/add-member', orgController.addMember);
router.post('/:id/assign-task', orgController.assignTask);

module.exports = router;
