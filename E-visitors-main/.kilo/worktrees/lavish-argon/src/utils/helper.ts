import type { User } from "../api/auth";

// ✅ Check if user has a specific permission

export const checkPermissions = (user: User, permission: string) => {
if(!user)
return false;

  // If user is a super admin, automatically grant access
  const isSuperAdmin = user.roles?.some(role =>
    (role.name || '').toLowerCase() === 'super_admin' || (role.name || '').toLowerCase() === 'super admin'
  );
  if (isSuperAdmin) return true;

   // Loop through all roles and their permissions
  return user.roles?.some(role =>
    role.permissions?.some(p => p.name.toLowerCase() === permission.toLowerCase())
  ) || false;

};

// ✅ Check if user has a specific role
export const checkRole=(user:User|null,roleName:string):boolean=>{
    if(!user) return false;

    const normalizedRole=roleName.toLocaleLowerCase();
    const hasRole=user.roles?.some(role=>role.name.toLocaleLowerCase()===normalizedRole);
   // If user is a super admin, automatically grant access
  const isSuperAdmin = user.roles?.some(role => role.name.toLowerCase() === "super admin");
   return hasRole||isSuperAdmin;
};