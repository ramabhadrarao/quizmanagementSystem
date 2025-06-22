import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateUserUpdate, validateBulkUsers } from '../middleware/validation.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, status } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (role && role !== 'all') {
      query.role = role;
    }
    
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
    
    const users = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get single user
router.get('/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -resetPasswordToken -resetPasswordExpires');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Update user
router.put('/:id', requireAuth, requireRole(['admin']), validateUserUpdate, async (req, res) => {
  try {
    const { name, email, role, isActive, department, studentId } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;
    if (department !== undefined) user.department = department;
    if (studentId !== undefined) user.studentId = studentId;
    
    await user.save();
    
    res.json({
      message: 'User updated successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Toggle user active status
router.patch('/:id/toggle-status', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.isActive = !user.isActive;
    await user.save();
    
    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: user.isActive,
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ message: 'Error updating user status' });
  }
});

// Reset user password
router.post('/:id/reset-password', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const { newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

// Bulk create users
router.post('/bulk-create', requireAuth, requireRole(['admin']), validateBulkUsers, async (req, res) => {
  try {
    const { users } = req.body;
    const results = {
      success: [],
      failed: [],
    };
    
    for (const userData of users) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        
        if (existingUser) {
          results.failed.push({
            email: userData.email,
            reason: 'User already exists',
          });
          continue;
        }
        
        // Create new user
        const user = new User({
          name: userData.name,
          email: userData.email,
          password: userData.password || 'DefaultPassword123!',
          role: userData.role || 'student',
          department: userData.department,
          studentId: userData.studentId,
          isActive: userData.isActive !== false,
        });
        
        await user.save();
        results.success.push({
          email: user.email,
          name: user.name,
          role: user.role,
        });
      } catch (error) {
        results.failed.push({
          email: userData.email,
          reason: error.message,
        });
      }
    }
    
    res.json({
      message: 'Bulk user creation completed',
      results,
    });
  } catch (error) {
    console.error('Error in bulk user creation:', error);
    res.status(500).json({ message: 'Error creating users' });
  }
});

// Delete user
router.delete('/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ 
          message: 'Cannot delete the last admin user' 
        });
      }
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Export users to CSV
router.get('/export/csv', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const users = await User.find({})
      .select('name email role department studentId isActive createdAt lastLogin')
      .sort({ createdAt: -1 });
    
    // Generate CSV
    const csvHeaders = [
      'Name',
      'Email',
      'Role',
      'Department',
      'Student ID',
      'Status',
      'Created At',
      'Last Login',
    ];
    
    const csvRows = users.map(user => [
      user.name,
      user.email,
      user.role,
      user.department || '-',
      user.studentId || '-',
      user.isActive ? 'Active' : 'Inactive',
      new Date(user.createdAt).toLocaleDateString(),
      user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never',
    ]);
    
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(field => `"${field}"`).join(',')),
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="users-export.csv"');
    res.send(csvContent);
  } catch (error) {
    console.error('Error exporting users:', error);
    res.status(500).json({ message: 'Error exporting users' });
  }
});

export default router;