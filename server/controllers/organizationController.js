import Organization from '../models/Organization.js';
import User from '../models/User.js';

// Get all organizations
export const getAllOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.find().populate('members.userId', 'name email');
    res.status(200).json(orgs);
  } catch (err) {
    console.error('Error fetching organizations:', err);
    res.status(500).json({ message: 'Failed to fetch organizations', error: err.message });
  }
};

export const createOrganization = async (req, res) => {
  try {
    // Check if name is nested
    const name = typeof req.body.name === 'string' ? req.body.name : req.body.name?.name;

    if (!name) {
      return res.status(400).json({ message: 'Organization name is required' });
    }

    const newOrg = new Organization({ name });
    await newOrg.save();
    res.status(201).json(newOrg);
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get organization by ID
export const getOrganizationById = async (req, res) => {
  const { id } = req.params;

  try {
    const org = await Organization.findById(id)
      .populate('members.userId', 'name email')
      .populate('tasks.assignedTo', 'name email');

    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.status(200).json(org);
  } catch (err) {
    console.error('Error fetching organization:', err);
    res.status(500).json({ message: 'Failed to fetch organization', error: err.message });
  }
};

// Add member to organization
export const addMember = async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;

  if (!email) {
    return res.status(400).json({ message: 'User email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const org = await Organization.findById(id);
    if (!org) return res.status(404).json({ message: 'Organization not found' });

    const isAlreadyMember = org.members.some(m => m.userId.toString() === user._id.toString());
    if (isAlreadyMember) {
      return res.status(400).json({ message: 'User is already a member of this organization' });
    }

    org.members.push({ userId: user._id });
    await org.save();

    const updatedOrg = await Organization.findById(id).populate('members.userId', 'name email');
    res.status(200).json(updatedOrg);
  } catch (err) {
    console.error('Error adding member:', err);
    res.status(500).json({ message: 'Failed to add member', error: err.message });
  }
};

// Assign task to a member in the organization
export const assignTask = async (req, res) => {
  const { title, assignedTo } = req.body;
  const { id } = req.params;

  if (!title || !assignedTo) {
    return res.status(400).json({ message: 'Task title and assignedTo are required' });
  }

  try {
    const org = await Organization.findById(id);
    if (!org) return res.status(404).json({ message: 'Organization not found' });

    const isMember = org.members.some(m => m.userId.toString() === assignedTo);
    if (!isMember) {
      return res.status(400).json({ message: 'Assigned user is not a member of this organization' });
    }

    const task = {
      title,
      assignedTo,
      status: 'To Do'
    };

    org.tasks.push(task);
    await org.save();

    const updatedOrg = await Organization.findById(id)
      .populate('members.userId', 'name email')
      .populate('tasks.assignedTo', 'name email');

    res.status(200).json(updatedOrg);
  } catch (err) {
    console.error('Error assigning task:', err);
    res.status(500).json({ message: 'Failed to assign task', error: err.message });
  }
};
