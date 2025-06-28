'use server';

import { firestore } from '@/lib/firebase/admin';
import { revalidatePath } from 'next/cache';
import { GoalSchema } from './types';

// Mock user ID for now
const MOCK_USER_ID = 'user_123';

export async function addGoal(formData: FormData) {
  if (!firestore) {
    return { error: 'Database not configured. Please set Firebase credentials.' };
  }

  const values = {
    userId: MOCK_USER_ID,
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

export async function toggleGoal(goalId: string, completed: boolean) {
    if (!firestore) {
      return { error: 'Database not configured. Please set Firebase credentials.' };
    }

    try {
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
