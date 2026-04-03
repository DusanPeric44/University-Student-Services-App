import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Modal } from '../shared/Modal';
import { useState } from 'react';
import { Plus, Edit, Trash2, Shield, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  color: string;
}

export function AdminRoleManagement() {
  const availablePermissions: Permission[] = [
    { id: 'view_dashboard', name: 'View Dashboard', description: 'Access to main dashboard', category: 'General' },
    { id: 'view_courses', name: 'View Courses', description: 'View course information', category: 'Courses' },
    { id: 'create_courses', name: 'Create Courses', description: 'Create new courses', category: 'Courses' },
    { id: 'edit_courses', name: 'Edit Courses', description: 'Modify existing courses', category: 'Courses' },
    { id: 'delete_courses', name: 'Delete Courses', description: 'Remove courses', category: 'Courses' },
    { id: 'view_users', name: 'View Users', description: 'Access user information', category: 'Users' },
    { id: 'create_users', name: 'Create Users', description: 'Add new users', category: 'Users' },
    { id: 'edit_users', name: 'Edit Users', description: 'Modify user information', category: 'Users' },
    { id: 'delete_users', name: 'Delete Users', description: 'Remove users', category: 'Users' },
    { id: 'view_grades', name: 'View Grades', description: 'Access grade information', category: 'Grades' },
    { id: 'enter_grades', name: 'Enter Grades', description: 'Input student grades', category: 'Grades' },
    { id: 'edit_grades', name: 'Edit Grades', description: 'Modify existing grades', category: 'Grades' },
    { id: 'view_attendance', name: 'View Attendance', description: 'Access attendance records', category: 'Attendance' },
    { id: 'mark_attendance', name: 'Mark Attendance', description: 'Record student attendance', category: 'Attendance' },
    { id: 'view_reports', name: 'View Reports', description: 'Access system reports', category: 'Reports' },
    { id: 'generate_reports', name: 'Generate Reports', description: 'Create new reports', category: 'Reports' },
    { id: 'manage_roles', name: 'Manage Roles', description: 'Create and modify roles', category: 'Admin' },
    { id: 'system_settings', name: 'System Settings', description: 'Access system configuration', category: 'Admin' },
  ];

  const [roles, setRoles] = useState<Role[]>([
    {
      id: 1,
      name: 'Student',
      description: 'Standard student access with limited permissions',
      userCount: 2700,
      permissions: ['view_dashboard', 'view_courses', 'view_grades', 'view_attendance'],
      color: 'blue'
    },
    {
      id: 2,
      name: 'Professor',
      description: 'Faculty member with teaching and grading permissions',
      userCount: 85,
      permissions: ['view_dashboard', 'view_courses', 'edit_courses', 'view_users', 'view_grades', 'enter_grades', 'edit_grades', 'view_attendance', 'mark_attendance', 'view_reports'],
      color: 'green'
    },
    {
      id: 3,
      name: 'Administrator',
      description: 'Full system access with all permissions',
      userCount: 5,
      permissions: availablePermissions.map(p => p.id),
      color: 'purple'
    },
    {
      id: 4,
      name: 'Teaching Assistant',
      description: 'Limited faculty access for assisting professors',
      userCount: 15,
      permissions: ['view_dashboard', 'view_courses', 'view_users', 'view_grades', 'view_attendance', 'mark_attendance'],
      color: 'orange'
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
    color: 'blue',
  });

  const handleCreateRole = () => {
    const newRole: Role = {
      id: Date.now(),
      ...formData,
      userCount: 0,
    };
    setRoles([...roles, newRole]);
    setShowCreateModal(false);
    toast.success('Role created successfully');
    resetForm();
  };

  const handleEditRole = () => {
    if (selectedRole) {
      const updatedRoles = roles.map(r =>
        r.id === selectedRole.id
          ? { ...r, ...formData }
          : r
      );
      setRoles(updatedRoles);
      setShowEditModal(false);
      toast.success('Role updated successfully');
      resetForm();
      setSelectedRole(null);
    }
  };

  const handleDeleteRole = (id: number) => {
    const role = roles.find(r => r.id === id);
    if (role && role.userCount > 0) {
      toast.error('Cannot delete role with active users');
      return;
    }
    setRoles(roles.filter(r => r.id !== id));
    toast.success('Role deleted successfully');
  };

  const openEditModal = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions],
      color: role.color,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: [],
      color: 'blue',
    });
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const permissionCategories = Array.from(new Set(availablePermissions.map(p => p.category)));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Role & Access Management</h1>
          <p className="text-gray-600">Configure user roles and permissions</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4" />
          Create Role
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Roles</p>
            <p className="text-gray-900">{roles.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Active Users</p>
            <p className="text-blue-600">{roles.reduce((sum, r) => sum + r.userCount, 0)}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Permissions</p>
            <p className="text-purple-600">{availablePermissions.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Categories</p>
            <p className="text-green-600">{permissionCategories.length}</p>
          </div>
        </Card>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roles.map(role => (
          <Card key={role.id}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`bg-${role.color}-100 p-3 rounded-lg`}>
                  <Shield className={`w-6 h-6 text-${role.color}-600`} />
                </div>
                <div>
                  <h3 className="text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(role)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Edit role"
                >
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDeleteRole(role.id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  aria-label="Delete role"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className={`px-3 py-1 bg-${role.color}-100 text-${role.color}-700 rounded-full`}>
                  {role.userCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Permissions</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                  {role.permissions.length}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-700 mb-2">Key Permissions:</p>
              <div className="flex flex-wrap gap-2">
                {role.permissions.slice(0, 5).map(permId => {
                  const perm = availablePermissions.find(p => p.id === permId);
                  return perm ? (
                    <span key={permId} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {perm.name}
                    </span>
                  ) : null;
                })}
                {role.permissions.length > 5 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    +{role.permissions.length - 5} more
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* All Permissions Reference */}
      <Card title="Available Permissions Reference">
        <div className="space-y-6">
          {permissionCategories.map(category => (
            <div key={category}>
              <h4 className="text-gray-900 mb-3">{category}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {availablePermissions
                  .filter(p => p.category === category)
                  .map(permission => (
                    <div key={permission.id} className="border border-gray-200 rounded-lg p-3">
                      <p className="text-gray-900 text-sm mb-1">{permission.name}</p>
                      <p className="text-xs text-gray-600">{permission.description}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Create Role Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="Create New Role"
        size="xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setShowCreateModal(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreateRole} disabled={!formData.name || formData.permissions.length === 0}>
              <Plus className="w-4 h-4" />
              Create Role
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Role Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Department Head"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Describe the role and its purpose"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Color</label>
            <select
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="purple">Purple</option>
              <option value="orange">Orange</option>
              <option value="red">Red</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-3">
              Permissions * ({formData.permissions.length} selected)
            </label>
            <div className="border border-gray-300 rounded-lg p-4 max-h-[400px] overflow-y-auto">
              {permissionCategories.map(category => (
                <div key={category} className="mb-4 last:mb-0">
                  <h4 className="text-gray-900 mb-2">{category}</h4>
                  <div className="space-y-2">
                    {availablePermissions
                      .filter(p => p.category === category)
                      .map(permission => (
                        <label
                          key={permission.id}
                          className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              checked={formData.permissions.includes(permission.id)}
                              onChange={() => togglePermission(permission.id)}
                              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{permission.name}</p>
                            <p className="text-xs text-gray-600">{permission.description}</p>
                          </div>
                        </label>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
          setSelectedRole(null);
        }}
        title="Edit Role"
        size="xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setShowEditModal(false);
              resetForm();
              setSelectedRole(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditRole} disabled={!formData.name || formData.permissions.length === 0}>
              <Edit className="w-4 h-4" />
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Role Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Color</label>
            <select
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="purple">Purple</option>
              <option value="orange">Orange</option>
              <option value="red">Red</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-3">
              Permissions * ({formData.permissions.length} selected)
            </label>
            <div className="border border-gray-300 rounded-lg p-4 max-h-[400px] overflow-y-auto">
              {permissionCategories.map(category => (
                <div key={category} className="mb-4 last:mb-0">
                  <h4 className="text-gray-900 mb-2">{category}</h4>
                  <div className="space-y-2">
                    {availablePermissions
                      .filter(p => p.category === category)
                      .map(permission => (
                        <label
                          key={permission.id}
                          className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              checked={formData.permissions.includes(permission.id)}
                              onChange={() => togglePermission(permission.id)}
                              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{permission.name}</p>
                            <p className="text-xs text-gray-600">{permission.description}</p>
                          </div>
                        </label>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
