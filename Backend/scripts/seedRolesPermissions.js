const { sequelize } = require('../models/users'); // Import sequelize from users model
const Roles = require('../models/roles');
const Permission = require('../models/permission');

async function seedRolesAndPermissions() {
  await sequelize.sync(); // Ensure database is synced

  const rolesData = [
    { libellerole: 'Document Creator' },
    { libellerole: 'Reviewer Level 1' },
    { libellerole: 'Reviewer Level 2' },
    { libellerole: 'Approver' },
    { libellerole: 'Administrator' }
  ];

  const permissionsData = [
    { permission: 'Create Document' },
    { permission: 'View Document' },
    { permission: 'Edit Document' },
    { permission: 'Comment on Document' },
    { permission: 'Approve Document' },
    { permission: 'Manage Users' }
  ];

  try {
    await Roles.bulkCreate(rolesData, { ignoreDuplicates: true });
    await Permission.bulkCreate(permissionsData, { ignoreDuplicates: true });

    console.log('Roles and permissions have been seeded successfully.');
  } catch (error) {
    console.error('Error seeding roles and permissions:', error);
  }
}

seedRolesAndPermissions();
