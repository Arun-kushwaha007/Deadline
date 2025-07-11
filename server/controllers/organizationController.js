import Organization from '../models/Organization.js';
import User from '../models/User.js';
import { sendNotification } from '../utils/notificationUtils.js';

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

    const memberUserIds = organization.members.map(m => m.userId);

    if (memberUserIds.length === 0) {
      return res.status(200).json([]); // No members to fetch
    }


    const membersUsers = await User.find({ userId: { $in: memberUserIds } }).select('userId name email profilePicture'); 


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
        profilePicture: userDetails ? userDetails.profilePicture : '',
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
  const { joiningUserId, role } = req.body;  // Expect joiningUserId (UUID string) and role
  const { id: orgId } = req.params; // Organization's MongoDB _id

  if (!joiningUserId) {
    return res.status(400).json({ message: 'User ID (joiningUserId) is required' });
  }
  if (!role) {
    return res.status(400).json({ message: 'User role is required' });
  }

  // Validate role value against enum in Organization model
  const validRoles = Organization.schema.path('members.role').enumValues;
  if (!validRoles.includes(role)) {
      return res.status(400).json({ message: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
  }

  try {
    // Find user by their UUID (userId field in User model)
    const user = await User.findOne({ userId: joiningUserId });
    if (!user) {
      return res.status(404).json({ message: 'User not found with the provided User ID' });
    }

    // Find the organization by its MongoDB _id
    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const alreadyMember = organization.members.some(
      m => m.userId === user.userId // user.userId is the UUID string from the found User document
    );
    if (alreadyMember) {
      return res.status(409).json({ message: 'User is already a member of this organization' });
    }

    // Add member using their UUID string and the provided role
    organization.members.push({ userId: user.userId, role: role }); 
    await organization.save();

   
    const io = req.app.get('io');
    const redisClient = req.app.get('redis');
    if (io && redisClient && user) {
      await sendNotification({
        io,
        redisClient,
        userId: user.userId, // Use the UUID userId
        type: 'info', 
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
      const newTask = organization.tasks[organization.tasks.length - 1]; 
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

// DELETE /api/organizations/:id/members/:memberId
export const removeMemberFromOrganization = async (req, res) => {
  const { id: orgId, memberId: memberUuidToRemove } = req.params;
  const requesterUuid = req.user.userId; // UUID of the user making the request

  try {
    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Find the requester's membership and role in this organization
    const requesterMembership = organization.members.find(
      (m) => m.userId === requesterUuid
    );

    if (!requesterMembership) {
      return res.status(403).json({ message: 'Requester is not a member of this organization' });
    }

    // Only admins or coordinators can remove members
    if (!['admin', 'coordinator'].includes(requesterMembership.role)) {
      return res.status(403).json({ message: 'User does not have permission to remove members' });
    }

    // Find the index of the member to remove (by UUID)
    const memberIndexToRemove = organization.members.findIndex(
      (m) => m.userId === memberUuidToRemove
    );

    if (memberIndexToRemove === -1) {
      return res.status(404).json({ message: 'Member not found in this organization' });
    }

    const memberToRemove = organization.members[memberIndexToRemove];

    // Prevent removing the last admin
    if (memberToRemove.role === 'admin') {
      const adminCount = organization.members.filter(m => m.role === 'admin').length;
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot remove the last admin of the organization' });
      }
    }
    
    // Prevent coordinator from removing admin
    if (requesterMembership.role === 'coordinator' && memberToRemove.role === 'admin') {
        return res.status(403).json({ message: 'Coordinators cannot remove admins.'});
    }

    // Remove the member
    organization.members.splice(memberIndexToRemove, 1);
    await organization.save();



    res.status(200).json({ message: 'Member removed successfully', organization });
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({ message: 'Failed to remove member', error: error.message });
  }
};

// DELETE /api/organizations/:id
export const deleteOrganization = async (req, res) => {
  const { id: orgId } = req.params;
  const requesterUuid = req.user.userId; // UUID of the user making the request

  try {
    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Find the requester's membership and role in this organization
    const requesterMembership = organization.members.find(
      (m) => String(m.userId) === String(requesterUuid)
    );

    if (!requesterMembership) {
   
      return res.status(403).json({ message: 'Requester is not a member of this organization' });
    }

    // Only admins can delete an organization
    if (requesterMembership.role !== 'admin') {
      return res.status(403).json({ message: 'User does not have permission to delete this organization. Only admins can perform this action.' });
    }

    // Proceed with deletion
    await Organization.findByIdAndDelete(orgId);

  
    res.status(200).json({ message: 'Organization deleted successfully' });
  } catch (error) {
    console.error('Error deleting organization:', error);
    res.status(500).json({ message: 'Failed to delete organization', error: error.message });
  }
};
