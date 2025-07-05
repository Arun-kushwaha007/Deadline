import Organization from '../models/Organization.js';
import User from '../models/User.js';
import { sendNotification } from '../utils/notificationUtils.js'; // Added import

// GET /api/organizations/
export const getAllOrganizations = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user.userId;

    // Find organizations where the current user is a member
    const organizations = await Organization.find({ "members.userId": userId });

    // Manually populate member user details
    const organizationsWithDetails = await Promise.all(
      organizations.map(async (org) => {
        // Get all member UUIDs
        const memberUserIds = org.members.map(m => m.userId);

        // Fetch user objects for those UUIDs
        const membersUsers = await User.find({ userId: { $in: memberUserIds } }).select('userId name email');

        // Map userId (UUID string) to user object
        const userMap = {};
        membersUsers.forEach(user => {
          userMap[String(user.userId)] = user;
        });

        // Attach user info + role for each member
        const membersWithUser = org.members.map((member) => {
          return {
            role: member.role,
            userId: userMap[String(member.userId)] || {
              userId: member.userId,
              name: 'Unknown User',
              email: '',
            },
          };
        });

        // Return the enriched organization object
        return {
          ...org.toObject(),
          members: membersWithUser,
        };
      })
    );

    res.status(200).json(organizationsWithDetails);
  } catch (error) {
    console.error('Error fetching organizations:', error);
    res.status(500).json({ message: 'Failed to fetch organizations', error: error.message });
  }
};

// GET /api/organizations/:id/members
export const getOrganizationMembers = async (req, res) => {
  const { id } = req.params; // This is the MongoDB _id of the organization

  try {
    const organization = await Organization.findById(id);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Extract member UUIDs from the organization's members array
    // Assuming organization.members stores objects like { userId: 'uuid-string', role: 'role-name' }
    const memberUserIds = organization.members.map(m => m.userId);

    if (memberUserIds.length === 0) {
      return res.status(200).json([]); // No members to fetch
    }

    // Fetch user details for these member UUIDs
    // Assuming User model has a 'userId' field that stores the UUID string
    const membersUsers = await User.find({ userId: { $in: memberUserIds } }).select('userId name email profilePicture'); // Added profilePicture

    // Create a map of UUID -> user object for efficient lookup
    const userMap = {};
    membersUsers.forEach(user => {
      userMap[user.userId] = user.toObject(); // Convert to plain object
    });

    // Enrich the organization's member list with full user details
    const enrichedMembers = organization.members.map(member => {
      const userDetails = userMap[member.userId];
      return {
        userId: member.userId, // The UUID string
        role: member.role,
        name: userDetails ? userDetails.name : 'Unknown User',
        email: userDetails ? userDetails.email : '',
        profilePicture: userDetails ? userDetails.profilePicture : '', // Added profilePicture
        // You can add _id (MongoDB ObjectId of User document) if needed, e.g., userDetails._id
      };
    });

    res.status(200).json(enrichedMembers);
  } catch (error) {
    console.error('Error fetching organization members:', error);
    res.status(500).json({ message: 'Failed to fetch organization members', error: error.message });
  }
};

// GET /api/organizations/mine
// Fetches organizations where the logged-in user is a member
export const getMyOrganizations = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'User not authenticated for fetching organizations.' });
    }
    const userUuid = req.user.userId; // Logged-in user's string UUID

    const organizations = await Organization.find({ 
      'members.userId': userUuid 
    }).select('name _id'); // Select only name and _id

    res.status(200).json(organizations);
  } catch (error) {
    console.error('Error fetching "my" organizations:', error);
    res.status(500).json({ message: 'Server error while fetching your organizations', error: error.message });
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

    // Add the creator as a member with admin role
    if (req.user && req.user.userId) {
      newOrganization.members.push({ userId: req.user.userId, role: 'admin' });
    } else {
      // This case should ideally not be reached if authMiddleware is effective
      console.error('User ID not found in req.user for organization creator');
      return res.status(400).json({ message: 'User information not found for organization creator.' });
    }

    await newOrganization.save();

    res.status(201).json(newOrganization);
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/organizations/:id
// GET /api/organizations/:id
export const getOrganizationById = async (req, res) => {
  const { id } = req.params;

  try {
    const organization = await Organization.findById(id);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Fetch users for members by userId UUID string
    const memberUserIds = organization.members.map(m => m.userId);
    const membersUsers = await User.find({ userId: { $in: memberUserIds } }).select('userId name email');

    // Map userId to user object for quick lookup
    const userMap = {};
    membersUsers.forEach(user => {
      userMap[user.userId] = user;
    });

    // Attach user info to members
    const membersWithUser = organization.members.map(member => ({
      ...member.toObject(),
      userId: userMap[member.userId] || { userId: member.userId, name: 'Unknown User' }
    }));

    // Do similar for tasks assignedTo
    const taskAssignedUserIds = organization.tasks
      .map(task => task.assignedTo)
      .filter(id => id != null);

    const assignedUsers = await User.find({ userId: { $in: taskAssignedUserIds } }).select('userId name');

    const assignedUserMap = {};
    assignedUsers.forEach(user => {
      assignedUserMap[user.userId] = user;
    });

    // Attach user info to tasks
    const tasksWithUser = organization.tasks.map(task => ({
      ...task.toObject(),
      assignedTo: task.assignedTo ? assignedUserMap[task.assignedTo] || { userId: task.assignedTo, name: 'Unknown User' } : null,
    }));

    // Build response object with populated members and tasks
    const organizationWithDetails = {
      ...organization.toObject(),
      members: membersWithUser,
      tasks: tasksWithUser,
    };

    res.status(200).json(organizationWithDetails);
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
    organization.members.push({ userId: user.userId, role: 'member' }); // Assuming default role 'member'
    await organization.save();

    // Send notification to the newly added member
    const io = req.app.get('io');
    const redisClient = req.app.get('redis');
    if (io && redisClient && user) {
      await sendNotification({
        io,
        redisClient,
        userId: user.userId, // Use the UUID userId
        type: 'info', // Or a more specific type like 'addedToOrganization'
        message: `You have been added to the organization '${organization.name}'.`,
        entityId: organization._id,
        entityModel: 'Organization',
      });
    } else {
      console.warn('Socket.IO or Redis client not available, or user not found. Skipping real-time notification for add member.');
    }

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

    // Send notification to the assignee
    const assigneeUser = await User.findOne({ userId: assignedTo }); // Find user by UUID to get ObjectId
    const io = req.app.get('io');
    const redisClient = req.app.get('redis');

    if (io && redisClient && assigneeUser) {
      const newTask = organization.tasks[organization.tasks.length - 1]; // Get the newly added task
      if (newTask) {
        await sendNotification({
          io,
          redisClient,
          userId: assigneeUser.userId, // Use the UUID userId
          type: 'taskAssigned',
          message: `You have been assigned a new task '${newTask.title}' in organization '${organization.name}'.`,
          entityId: newTask._id, // ObjectId of the sub-document task
          entityModel: 'OrgTask', 
        });
      } else {
        console.warn('Could not find the newly created task in organization for notification.');
      }
    } else {
      console.warn('Socket.IO or Redis client not available, or assignee user not found. Skipping real-time notification for task assignment.');
    }

    res.status(200).json(organization);
  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({ message: 'Failed to assign task', error: error.message });
  }
};
