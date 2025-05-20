import Organization from '../models/Organization.js';
import User from '../models/User.js';

// GET /api/organizations/
export const getAllOrganizations = async (req, res) => {
  try {
    // For populate to work with string userId, you might want to refactor members schema to store ObjectId
    // But since you're storing UUID string, you need to populate manually or handle client-side.
    // Here just sending as is:
    const organizations = await Organization.find();

    res.status(200).json(organizations);
  } catch (error) {
    console.error('Error fetching organizations:', error);
    res.status(500).json({ message: 'Failed to fetch organizations', error: error.message });
  }
};

// POST /api/organizations/create
export const createOrganization = async (req, res) => {
  try {
    const name = typeof req.body.name === 'string'
      ? req.body.name.trim()
      : req.body.name?.name?.trim();

    if (!name) {
      return res.status(400).json({ message: 'Organization name is required' });
    }

    const existingOrg = await Organization.findOne({ name });
    if (existingOrg) {
      return res.status(409).json({ message: 'Organization with this name already exists' });
    }

    const newOrganization = new Organization({ name });
    await newOrganization.save();

    res.status(201).json(newOrganization);
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/organizations/:id
export const getOrganizationById = async (req, res) => {
  const { id } = req.params;

  try {
    const organization = await Organization.findById(id);

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.status(200).json(organization);
  } catch (error) {
    console.error('Error fetching organization:', error);
    res.status(500).json({ message: 'Failed to fetch organization', error: error.message });
  }
};

// POST /api/organizations/:id/members
export const addMember = async (req, res) => {
  const { joiningUserId } = req.body;  // UUID string
  const { id } = req.params;

  if (!joiningUserId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Find user by userId (UUID string)
    const user = await User.findOne({ userId: joiningUserId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Find the organization by ID
    const organization = await Organization.findById(id);
    if (!organization) return res.status(404).json({ message: 'Organization not found' });

    // Check if user is already a member by comparing UUID strings
    const alreadyMember = organization.members.some(
      m => m.userId === user.userId
    );
    if (alreadyMember) {
      return res.status(409).json({ message: 'User is already a member of this organization' });
    }

    // Add member using UUID string
    organization.members.push({ userId: user.userId });
    await organization.save();

    res.status(200).json(organization);
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ message: 'Failed to add member', error: error.message });
  }
};

// POST /api/organizations/:id/tasks
export const assignTask = async (req, res) => {
  const { title, assignedTo } = req.body;
  const { id } = req.params;

  if (!title || !assignedTo) {
    return res.status(400).json({ message: 'Task title and assignedTo are required' });
  }

  try {
    const organization = await Organization.findById(id);
    if (!organization) return res.status(404).json({ message: 'Organization not found' });

    // assignedTo is a UUID string here, check membership by UUID string
    const isMember = organization.members.some(
      m => m.userId === assignedTo
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Assigned user is not a member of this organization' });
    }

    organization.tasks.push({
      title: title.trim(),
      assignedTo,
      status: 'To Do',
    });

    await organization.save();

    res.status(200).json(organization);
  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({ message: 'Failed to assign task', error: error.message });
  }
};
