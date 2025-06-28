// src/app/(app)/dashboard/components/goals.tsx
'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from 'next/link';
import { Target } from 'lucide-react';

const initialGoals = [
  { id: 1, title: "Meditate 3 times a week", completed: true },
  { id: 2, title: "Run 5km", completed: false },
  { id: 3, title: "Read for 15 minutes before bed", completed: false },
  { id: 4, title: "Drink 8 glasses of water daily", completed: true },
];

export function Goals() {
  const [goals, setGoals] = useState(initialGoals);

  const toggleGoal = (id: number) => {
    setGoals(goals.map(goal => goal.id === id ? { ...goal, completed: !goal.completed } : goal));
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
                  id={`goal-${goal.id}`}
                  checked={goal.completed}
                  onCheckedChange={() => toggleGoal(goal.id)}
                  aria-label={`Mark goal '${goal.title}' as ${goal.completed ? 'incomplete' : 'complete'}`}
                />
                <label
                  htmlFor={`goal-${goal.id}`}
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
