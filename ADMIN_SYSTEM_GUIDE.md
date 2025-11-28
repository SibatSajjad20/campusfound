# Admin System Guide

## Overview
The CampusFound app now includes a secure admin system that allows designated administrators to manage all reported items.

## Features

### Admin Capabilities
- **Approve Items**: Change item status from 'pending' to 'approved'
- **Reject Items**: Mark items as 'rejected'
- **Delete Items**: Permanently remove any item from the system
- **Resolve Items**: Mark any item as resolved (not just their own)
- **View All Items**: See all items regardless of status

### User Capabilities (Unchanged)
- Report lost/found items (status starts as 'pending')
- Resolve their own items
- View approved items only
- Chat with other users

## Item Status Flow

```
pending → approved → resolved
    ↓
rejected
```

- **pending**: New items await admin approval
- **approved**: Admin-approved items visible to all users
- **rejected**: Admin-rejected items (hidden from regular users)
- **resolved**: Item has been found/returned

## Making a User Admin

### Method 1: Using the Script (Recommended)
```bash
cd backend
node makeAdmin.js your-email@gmail.com
```

### Method 2: Direct Database Update
```javascript
// In MongoDB shell or Compass
db.students.updateOne(
  { email: "your-email@gmail.com" },
  { $set: { role: "admin" } }
)
```

### Method 3: During Registration (Development Only)
Manually update the user document after registration.

## Backend Changes

### Models
- **User (stdModel.js)**: Added `role` field (enum: 'user', 'admin')
- **Item (itemModel.js)**: 
  - Updated `status` field (enum: 'pending', 'approved', 'rejected', 'resolved')
  - Added `resolvedAt` field

### Middleware
- **admin.js**: New middleware to check admin role
- **authmw.js**: Updated to include role in JWT payload

### Routes (itemRoutes.js)
```javascript
// Admin-only routes
PATCH /api/items/:id/approve  // Approve item
PATCH /api/items/:id/reject   // Reject item
DELETE /api/items/:id          // Delete item (admin only)
PATCH /api/items/:id/resolve   // Resolve item (admin or owner)
```

### Controllers (itemController.js)
- `approveItem`: Set status to 'approved'
- `rejectItem`: Set status to 'rejected'
- `deleteItem`: Delete item permanently
- `resolveItem`: Updated to allow admin access

## Frontend Changes

### New Pages
- **AdminDashboard.tsx**: Complete admin panel with stats and item management

### Updated Components
- **Navbar.tsx**: Shows "Admin" link for admin users
- **Home.tsx**: Displays status badges on item cards
- **Profile.tsx**: Shows updated status badges
- **ItemDetail.tsx**: Admin action buttons (Approve/Reject/Delete/Resolve)

### Updated Context
- **AuthContext.jsx**: Added `isAdmin()` helper function

### Updated Types
- **types.ts**: Updated User and LostItem interfaces with role and new status values

### Updated API
- **api.ts**: Added admin endpoints (approveItem, rejectItem, deleteItem, resolveItem)

## Security Features

1. **JWT-based Authentication**: Role included in JWT payload
2. **Middleware Protection**: Admin routes protected by `adminOnly` middleware
3. **403 Forbidden**: Non-admin users get proper error response
4. **Frontend Guards**: Admin UI elements only visible to admins
5. **Backend Validation**: All admin actions validated server-side

## Testing the Admin System

### 1. Create Admin User
```bash
cd backend
node makeAdmin.js admin@example.com
```

### 2. Login as Admin
- Login with admin credentials
- Verify "Admin" link appears in navbar

### 3. Test Admin Dashboard
- Navigate to `/admin`
- View all items with different statuses
- Filter by status (pending, approved, rejected, resolved)

### 4. Test Admin Actions
- Approve a pending item
- Reject a pending item
- Delete any item
- Resolve any item

### 5. Test User Restrictions
- Login as regular user
- Verify only approved items are visible
- Verify admin routes return 403
- Verify users can only resolve their own items

## API Endpoints Summary

### Public Routes
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
```

### Protected Routes (All Users)
```
GET    /api/items/all          // Admins see all, users see approved only
GET    /api/items/lost         // Admins see all, users see approved only
GET    /api/items/found        // Admins see all, users see approved only
GET    /api/items/my-items
GET    /api/items/:id
POST   /api/items/report
PATCH  /api/items/:id/resolve  // Owner or admin
```

### Admin-Only Routes
```
PATCH  /api/items/:id/approve
PATCH  /api/items/:id/reject
DELETE /api/items/:id
```

## Environment Variables

No new environment variables required. Existing setup works with admin system.

## Database Migration

Existing items will have `status: 'pending'` by default. To approve all existing items:

```javascript
// In MongoDB shell
db.items.updateMany(
  { status: { $exists: false } },
  { $set: { status: "approved" } }
)
```

## Troubleshooting

### Admin link not showing
- Verify user has `role: 'admin'` in database
- Check JWT token includes role field
- Clear localStorage and login again

### 403 Forbidden on admin routes
- Verify JWT token is valid
- Check role in JWT payload
- Ensure middleware is applied correctly

### Items not showing for regular users
- Check item status is 'approved'
- Verify filter logic in `findItembyType`
- Check frontend API calls

## Best Practices

1. **Limit Admin Accounts**: Only create admin accounts for trusted users
2. **Audit Admin Actions**: Consider adding logging for admin actions
3. **Regular Reviews**: Periodically review pending items
4. **Clear Communication**: Inform users about approval process
5. **Backup Before Delete**: Consider soft deletes instead of permanent deletion

## Future Enhancements

- Admin activity logs
- Bulk approve/reject
- Email notifications for status changes
- Admin dashboard analytics
- Soft delete with restore capability
- Admin user management panel
