
'use client'

import React, { useState, useTransition } from 'react';
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
import { addGoal, toggleGoal } from '../actions';
import type { Goal } from '../types';
import { useToast } from '@/hooks/use-toast';
import dynamic from 'next/dynamic';

const Confetti = dynamic(() => import('react-confetti'), { ssr: false });


function GoalCard({ goal, onToggle }: { goal: Goal; onToggle: (id: string, completed: boolean) => void }) {
    const dueDate = new Date(goal.dueDate);
    const isDue = isPast(dueDate) && !goal.completed && !isToday(dueDate);
    const isDueToday = isToday(dueDate) && !goal.completed;
    let [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(() => {
            onToggle(goal.id!, goal.completed);
        });
    };

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
                                    <span>Due: {format(dueDate, 'PPP')}</span>
                                </>
                            )}
                        </div>
                    </div>
                     <Checkbox
                        checked={goal.completed}
                        onCheckedChange={handleToggle}
                        disabled={isPending}
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

// The main client component that manages state and interactions
export default function GoalsClientComponent({ initialGoals }: { initialGoals: Goal[] }) {
    const [goals, setGoals] = useState<Goal[]>(initialGoals);
    const [open, setOpen] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const { toast } = useToast();
    let [isPending, startTransition] = useTransition();

    const handleToggleGoal = async (id: string, currentStatus: boolean) => {
        const result = await toggleGoal(id, currentStatus);
        if (result.success) {
            const updatedGoals = goals.map(g => g.id === id ? { ...g, completed: result.completed! } : g);
            setGoals(updatedGoals);

            if (result.completed) {
                toast({
                    title: "Goal Achieved! 🎉",
                    description: "Great job! Keep up the momentum.",
                });
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 5000); // Confetti for 5 seconds
            }
        } else {
             toast({
                title: "Uh oh!",
                description: result.error,
                variant: 'destructive'
            });
        }
    };
    
    const handleAddGoal = (formData: FormData) => {
        startTransition(async () => {
            const result = await addGoal(formData);
            if (result?.success) {
                // The revalidatePath in the action will refetch goals.
                // For a smoother UX, we can optimistically update the UI here later.
                toast({ title: "Goal Created!", description: "Your new goal has been saved." });
                setOpen(false);
            } else if (result?.error) {
                // Handle validation errors from server action
                const errorMsg = Array.isArray(result.error) ? result.error.join(', ') : 'Please check your input.';
                toast({ title: "Error", description: errorMsg, variant: "destructive" });
            }
        })
    }


    const activeGoals = goals.filter(g => !g.completed);
    const completedGoals = goals.filter(g => g.completed);


    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 overflow-y-auto">
             {showConfetti && <Confetti recycle={false} onConfettiComplete={() => setShowConfetti(false)} />}
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
                        <form action={handleAddGoal}>
                            <DialogHeader>
                                <DialogTitle>Create a New Goal</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="title" className="text-right">Title</Label>
                                    <Input id="title" name="title" className="col-span-3" placeholder="e.g., Run a 5K"/>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="description" className="text-right">Description</Label>
                                    <Textarea id="description" name="description" className="col-span-3" placeholder="Describe your goal..."/>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="date" className="text-right">Due Date</Label>
                                    <input type="hidden" name="dueDate" value={new Date().toISOString()} />
                                    {/* This is a simplification. A real app would use a date picker here and update the hidden input */}
                                    <p className="col-span-3 text-sm text-muted-foreground">Due date will be set to today.</p>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" type="button">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Goal"}</Button>
                            </DialogFooter>
                        </form>
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
