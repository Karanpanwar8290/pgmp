'use server';

import { firestore } from '@/lib/firebase/admin';
import { revalidatePath } from 'next/cache';
import { GoalSchema } from './types';


export async function addGoal(userId: string, formData: FormData) {
  if (!firestore) {
    return { error: 'Database not configured.' };
  }
   if (!userId) {
    return { error: 'You must be logged in to create a goal.' };
  }

  const values = {
    userId: userId,
    title: formData.get('title'),
    description: formData.get('description'),
    dueDate: formData.get('dueDate'),
    completed: false,
  };

  const parsed = GoalSchema.safeParse(values);

  if (!parsed.success) {
    return {
      error: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const goalRef = firestore.collection('goals').doc();
    await goalRef.set({
        ...parsed.data,
        createdAt: new Date(),
    });
    revalidatePath('/goals');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (e) {
    console.error(e);
    return {
        error: "Failed to create goal."
    }
  }
}

export async function toggleGoal(userId: string, goalId: string, completed: boolean) {
    if (!firestore) {
      return { error: 'Database not configured.' };
    }
    if (!userId) {
      return { error: 'You must be logged in to update a goal.' };
    }

    try {
        // Optional: you could add a security rule in Firestore to ensure userId matches goal's owner
        await firestore.collection('goals').doc(goalId).update({
            completed: !completed,
        });
        revalidatePath('/goals');
        revalidatePath('/dashboard');
        return { success: true, completed: !completed };
    } catch(e) {
        console.error(e);
        return {
            error: "Failed to update goal."
        }
    }
}
