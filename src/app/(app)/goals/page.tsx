
import { firestore } from '@/lib/firebase/admin';
import type { Goal } from './types';
import GoalsClientComponent from './components/goals-client';

// The page itself is now a Server Component responsible for data fetching
export default async function GoalsPage() {
    let initialGoals: Goal[] = [];

    if (firestore) {
        try {
            const goalsSnapshot = await firestore.collection('goals').where('userId', '==', 'user_123').orderBy('createdAt', 'desc').get();
            initialGoals = goalsSnapshot.docs.map(doc => {
                const data = doc.data();
                // Firestore returns Timestamps, which are not directly serializable for the client.
                // We convert them to JSON-compatible formats (ISO strings).
                // The client component will rehydrate them into Date objects.
                return {
                    ...data,
                    id: doc.id,
                    dueDate: data.dueDate.toDate().toISOString(),
                    createdAt: data.createdAt.toDate().toISOString(),
                } as Goal;
            });
        } catch (error) {
            console.error("Failed to fetch goals:", error);
            // Gracefully handle error, keep initialGoals as empty array
        }
    }

    return <GoalsClientComponent initialGoals={initialGoals} />;
}
