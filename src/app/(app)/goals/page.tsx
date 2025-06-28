'use client';

import { useEffect, useState } from 'react';
import { firestore } from '@/lib/firebase/client';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import type { Goal } from './types';
import GoalsClientComponent from './components/goals-client';
import { useAuth } from '@/components/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';

function GoalsPageSkeleton() {
    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 overflow-y-auto">
            <div className="flex items-center justify-between space-y-2">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 md:hidden" />
                    <div>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64 mt-2" />
                    </div>
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-6">
                <div>
                    <Skeleton className="h-6 w-40 mb-4" />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                             <Card key={i} className="flex flex-col">
                                <CardHeader><Skeleton className="h-5 w-3/4" /></CardHeader>
                                <CardContent><Skeleton className="h-10 w-full" /></CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
                 <div>
                    <Skeleton className="h-6 w-48 mb-4" />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                       <Card className="flex flex-col">
                           <CardHeader><Skeleton className="h-5 w-3/4" /></CardHeader>
                           <CardContent><Skeleton className="h-10 w-full" /></CardContent>
                       </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default function GoalsPage() {
    const { user } = useAuth();
    const [initialGoals, setInitialGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchGoals = async () => {
                if (!firestore) {
                    setLoading(false);
                    return;
                }
                try {
                    const goalsQuery = query(
                        collection(firestore, 'goals'),
                        where('userId', '==', user.uid),
                        orderBy('createdAt', 'desc')
                    );
                    const goalsSnapshot = await getDocs(goalsQuery);
                    
                    const fetchedGoals = goalsSnapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            ...data,
                            id: doc.id,
                            dueDate: data.dueDate.toDate().toISOString(),
                            createdAt: data.createdAt.toDate().toISOString(),
                        } as Goal;
                    });
                    setInitialGoals(fetchedGoals);
                } catch (error) {
                    console.error("Failed to fetch goals:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchGoals();
        } else if (user === null) {
            // User is not logged in
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return <GoalsPageSkeleton />;
    }

    return <GoalsClientComponent initialGoals={initialGoals} />;
}
