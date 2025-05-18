import Organization from '../models/Organization.js';
import User from '../models/User.js';

export const getAllOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.find().populate('members.userId', 'name email');
    res.status(200).json(orgs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createOrganization = async (req, res) => {
  const { name } = req.body;
  try {
    const newOrg = new Organization({ name });
    await newOrg.save();
    res.status(201).json(newOrg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrganizationById = async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id)
      .populate('members.userId', 'name email')
      .populate('tasks.assignedTo', 'name email');
    if (!org) return res.status(404).json({ message: 'Organization not found' });
    res.status(200).json(org);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addMember = async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const org = await Organization.findById(id);
    if (!org) return res.status(404).json({ message: 'Organization not found' });

    if (org.members.find(m => m.userId.toString() === user._id.toString()))
      return res.status(400).json({ message: 'Member already added' });

    org.members.push({ userId: user._id });
    await org.save();

    const updated = await Organization.findById(id).populate('members.userId', 'name email');
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const assignTask = async (req, res) => {
  const { title, assignedTo } = req.body;
  const { id } = req.params;

  try {
    const org = await Organization.findById(id);
    if (!org) return res.status(404).json({ message: 'Organization not found' });

    const task = {
      title,
      assignedTo,
      status: 'To Do'
    };

    org.tasks.push(task);
    await org.save();

    const updated = await Organization.findById(id)
      .populate('members.userId', 'name email')
      .populate('tasks.assignedTo', 'name email');

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
