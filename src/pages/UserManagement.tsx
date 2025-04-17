
import { Users } from 'lucide-react';

const UserManagement = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage library users and their permissions
        </p>
      </div>
      
      <div className="py-12 flex flex-col items-center justify-center text-center">
        <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-medium mb-2">User Management</h2>
        <p className="text-muted-foreground max-w-md">
          This feature will be available in a future update. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default UserManagement;
