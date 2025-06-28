// src/app/(app)/goals/page.tsx
'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, PlusCircle, Target, Trophy } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';
import { addDays, format, isPast, isToday } from 'date-fns';

type Goal = {
    id: number;
    title: string;
    description: string;
    dueDate: Date;
    completed: boolean;
};

const initialGoals: Goal[] = [
    { id: 1, title: 'Run a 5K', description: 'Train and complete a 5-kilometer run.', dueDate: addDays(new Date(), 30), completed: false },
    { id: 2, title: 'Daily Mindfulness', description: 'Practice 10 minutes of mindfulness meditation every day.', dueDate: addDays(new Date(), -5), completed: true },
    { id: 3, title: 'Weekly Yoga', description: 'Attend one yoga class per week to improve flexibility.', dueDate: addDays(new Date(), 2), completed: false },
    { id: 4, title: 'Improve Sleep Hygiene', description: 'No screens 1 hour before bed, aim for 8 hours of sleep.', dueDate: addDays(new Date(), 60), completed: false },
    { id: 5, title: 'Drink 8 glasses of water', description: 'Stay hydrated throughout the day.', dueDate: addDays(new Date(), -10), completed: true },
    { id: 6, title: 'Meal Prep Lunches', description: 'Prepare healthy lunches for the week every Sunday.', dueDate: addDays(new Date(), -1), completed: false },
];

function GoalCard({ goal, onToggle }: { goal: Goal; onToggle: (id: number) => void }) {
    const isDue = isPast(goal.dueDate) && !goal.completed && !isToday(goal.dueDate);
    const isDueToday = isToday(goal.dueDate) && !goal.completed;

    return (
        <Card className={cn("flex flex-col", goal.completed ? 'bg-secondary/50' : 'bg-card', (isDue || isDueToday) && 'border-destructive')}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="grid gap-1">
                        <CardTitle>{goal.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {goal.completed ? (
                                <>
                                    <Trophy className="w-4 h-4 text-green-500" />
                                    <span>Completed!</span>
                                </>
                            ) : (
                                <>
                                    <CalendarIcon className="w-4 h-4" />
                                    <span>Due: {format(goal.dueDate, 'PPP')}</span>
                                </>
                            )}
                        </div>
                    </div>
                     <Checkbox
                        checked={goal.completed}
                        onCheckedChange={() => onToggle(goal.id)}
                        className="h-5 w-5"
                    />
                </div>
                {(isDue || isDueToday) && !goal.completed &&
                    <div className="flex items-center gap-2 text-sm text-destructive font-medium pt-2">
                        <Clock className="w-4 h-4"/>
                        <span>{isDue ? 'Past due' : 'Due today'}</span>
                    </div>
                }
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">{goal.description}</p>
            </CardContent>
        </Card>
    );
}

export default function GoalsPage() {
    const [goals, setGoals] = useState<Goal[]>(initialGoals);
    const [open, setOpen] = useState(false);
    const [newGoalTitle, setNewGoalTitle] = useState('');
    const [newGoalDescription, setNewGoalDescription] = useState('');
    const [newGoalDate, setNewGoalDate] = useState<Date | undefined>();

    const handleToggleGoal = (id: number) => {
        setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
    };

    const handleAddGoal = () => {
        if (newGoalTitle && newGoalDate) {
            const newGoal: Goal = {
                id: goals.length + 1,
                title: newGoalTitle,
                description: newGoalDescription,
                dueDate: newGoalDate,
                completed: false
            };
            setGoals([newGoal, ...goals]);
            setNewGoalTitle('');
            setNewGoalDescription('');
            setNewGoalDate(undefined);
            setOpen(false);
        }
    }

    const activeGoals = goals.filter(g => !g.completed);
    const completedGoals = goals.filter(g => g.completed);


    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 overflow-y-auto">
            <div className="flex items-center justify-between space-y-2">
                <div className="flex items-center gap-2">
                    <div className="md:hidden">
                        <SidebarTrigger />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight font-headline">My Goals</h2>
                        <p className="text-muted-foreground">Set, track, and accomplish your wellbeing objectives.</p>
                    </div>
                </div>
                 <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                         <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Goal
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create a New Goal</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">Title</Label>
                                <Input id="title" value={newGoalTitle} onChange={(e) => setNewGoalTitle(e.target.value)} className="col-span-3" placeholder="e.g., Run a 5K"/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">Description</Label>
                                <Textarea id="description" value={newGoalDescription} onChange={(e) => setNewGoalDescription(e.target.value)} className="col-span-3" placeholder="Describe your goal..."/>
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="date" className="text-right">Due Date</Label>
                                 <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "col-span-3 justify-start text-left font-normal",
                                            !newGoalDate && "text-muted-foreground"
                                        )}
                                        >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {newGoalDate ? format(newGoalDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={newGoalDate}
                                            onSelect={setNewGoalDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleAddGoal} disabled={!newGoalTitle || !newGoalDate}>Save Goal</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-semibold font-headline mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> Active Goals</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {activeGoals.length > 0 ? (
                            activeGoals.map(goal => <GoalCard key={goal.id} goal={goal} onToggle={handleToggleGoal} />)
                        ) : (
                           <p className="text-muted-foreground col-span-full">You've completed all your goals! Time to create some new ones.</p>
                        )}
                    </div>
                </div>

                 <div>
                    <h3 className="text-xl font-semibold font-headline mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-green-500" /> Completed Goals</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {completedGoals.length > 0 ? (
                            completedGoals.map(goal => <GoalCard key={goal.id} goal={goal} onToggle={handleToggleGoal} />)
                        ) : (
                             <p className="text-muted-foreground col-span-full">No completed goals yet. Keep working on your active goals!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
