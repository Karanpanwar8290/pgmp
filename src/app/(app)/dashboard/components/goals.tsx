// src/app/(app)/dashboard/components/goals.tsx
'use client'

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from 'next/link';
import { Target } from 'lucide-react';
import { toggleGoal } from '../../goals/actions';
import type { Goal } from '../../goals/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function Goals({ initialGoals }: { initialGoals: Goal[] }) {
  const [goals, setGoals] = useState(initialGoals);
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleToggleGoal = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      const result = await toggleGoal(id, currentStatus);
      if (result.success) {
        const updatedGoals = goals.map(g => g.id === id ? { ...g, completed: result.completed! } : g).filter(g => !g.completed);
        setGoals(updatedGoals);
        router.refresh(); // Refresh server components

        if (result.completed) {
            toast({
                title: "Goal Achieved! 🎉",
                description: "Great job! It's now moved to your completed list.",
            });
        }
      } else {
        toast({
            title: "Uh oh!",
            description: result.error,
            variant: 'destructive'
        });
      }
    });
  };

  const activeGoals = goals.filter(goal => !goal.completed).slice(0, 3);

  return (
    <Card className="col-span-full lg:col-span-4">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Target className="w-5 h-5" />
            Active Goals
        </CardTitle>
        <CardDescription>Your current focus areas. Keep up the great work!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeGoals.length > 0 ? (
            activeGoals.map((goal) => (
              <div key={goal.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-secondary/50">
                <Checkbox
                  id={`goal-dashboard-${goal.id}`}
                  checked={goal.completed}
                  onCheckedChange={() => handleToggleGoal(goal.id!, goal.completed)}
                  disabled={isPending}
                  aria-label={`Mark goal '${goal.title}' as ${goal.completed ? 'incomplete' : 'complete'}`}
                />
                <label
                  htmlFor={`goal-dashboard-${goal.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {goal.title}
                </label>
              </div>
            ))
          ) : (
             <p className="text-sm text-muted-foreground">No active goals. Time to set some new ones!</p>
          )}
          <Button asChild variant="outline" className="w-full mt-4">
            <Link href="/goals">Manage All Goals</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
