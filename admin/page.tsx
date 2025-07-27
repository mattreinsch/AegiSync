'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { getAllUsers, updateUserAccess } from './actions';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Shield, User, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Skeleton } from '@/components/ui/skeleton';

// Define a type for the user data we expect from the server
type AppUser = {
  uid: string;
  email?: string;
  subscriptionStatus?: 'active' | 'inactive';
  role?: 'admin' | 'user';
};

export default function AdminPage() {
  const { user, loading, role } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isFetching, startFetching] = useTransition();
  const [isUpdating, startUpdating] = useTransition();
  const { toast } = useToast();

  // Redirect if not an admin
  useEffect(() => {
    if (!loading && role !== 'admin') {
      toast({
        variant: 'destructive',
        title: 'Unauthorized',
        description: 'You do not have access to this page.',
      });
      router.push('/');
    }
  }, [user, loading, role, router, toast]);

  // Fetch all users
  useEffect(() => {
    if (user && role === 'admin') {
      startFetching(async () => {
        const result = await getAllUsers(user.uid);
        if (result.success && result.users) {
          setUsers(result.users as AppUser[]);
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error || 'Failed to fetch users.',
          });
        }
      });
    }
  }, [user, role, toast]);

  const handleUpdateAccess = (targetUserId: string, newStatus: 'active' | 'inactive') => {
    if (!user) return;
    startUpdating(async () => {
      const result = await updateUserAccess(user.uid, targetUserId, newStatus);
      if (result.success) {
        toast({
          title: 'Success',
          description: `User access has been ${newStatus === 'active' ? 'granted' : 'revoked'}.`,
          className: 'bg-green-500 text-white',
        });
        // Refetch users to update the UI
        const updatedUsersResult = await getAllUsers(user.uid);
        if (updatedUsersResult.success && updatedUsersResult.users) {
          setUsers(updatedUsersResult.users as AppUser[]);
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to update user access.',
        });
      }
    });
  };

  // Loading state for initial auth check and redirect
  if (loading || role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Logo />
          <Button variant="ghost" asChild>
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Home</Link>
          </Button>
        </div>
      </header>

      <main className="pt-28 pb-16 container mx-auto px-4 md:px-6">
        {/* TODO: Add more detailed reporting and analytics features here. */}
        <header className="mb-8">
            <h1 className="text-4xl font-extrabold font-headline flex items-center gap-3">
                <Shield className="h-10 w-10 text-primary"/>
                Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Manage users and their permissions.</p>
        </header>

        {isFetching ? (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.uid}>
                    <TableCell className="font-mono text-xs">{u.uid}</TableCell>
                    <TableCell>{u.email || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                        {u.role || 'user'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.subscriptionStatus === 'active' ? 'outline' : 'destructive'} className={u.subscriptionStatus === 'active' ? 'text-green-400 border-green-400' : ''}>
                        {u.subscriptionStatus || 'inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {u.subscriptionStatus === 'active' ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleUpdateAccess(u.uid, 'inactive')}
                          disabled={isUpdating || (u.role === 'admin' && u.uid === user?.uid)}
                          title={u.uid === user?.uid ? "Cannot revoke your own access" : ""}
                        >
                          Revoke Access
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleUpdateAccess(u.uid, 'active')}
                          disabled={isUpdating}
                        >
                          Grant Access
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
}
