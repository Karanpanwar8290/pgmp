'use server';

import { firestore } from '@/lib/firebase/admin';
import { revalidatePath } from 'next/cache';
import { generateChatTitle } from '@/ai/flows/generate-chat-title';
import { chat as callChatApi } from '@/ai/flows/chat';
import type { Message } from './types';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Fetches a list of chat sessions for a given user.
 */
export async function getChatList(userId: string) {
  if (!firestore) return [];

  const snapshot = await firestore
    .collection('chats')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map(doc => ({
    id: doc.id,
    title: doc.data().title || 'Untitled Chat',
  }));
}

/**
 * Fetches a single chat session, ensuring the user has permission.
 */
export async function getChat(chatId: string, userId: string) {
    if (!firestore) return null;

    const doc = await firestore.collection('chats').doc(chatId).get();

    if (!doc.exists || doc.data()?.userId !== userId) {
        return null; // Or throw an error for permission denied
    }

    const data = doc.data();
    return {
        id: doc.id,
        title: data?.title,
        messages: data?.messages || [],
    };
}


/**
 * Handles sending a message, creating a new chat if necessary.
 */
export async function sendMessage({ chatId, userId, message, history }: { chatId: string | null; userId: string; message: string; history: Message[] }) {
    // We'll always need the AI response, so let's get it first.
    const aiResponseContent = await callChatApi({
        history: history,
        message: message,
    });
    const modelMessage: Message = { role: 'model', content: aiResponseContent };

    // If Firestore isn't configured, we can't save the chat.
    // We'll return a temporary response so the UI can still function for the current session.
    if (!firestore) {
        console.error("sendMessage: Firestore is not configured. Chat conversation will not be saved.");
        const isNewChat = !chatId;
        return {
            chatId: isNewChat ? 'unsaved-chat' : chatId,
            title: isNewChat ? 'Unsaved Chat' : '', 
            aiResponse: modelMessage,
        };
    }

    // --- Logic for when Firestore IS configured ---
    const userMessage: Message = { role: 'user', content: message };
    let currentChatId = chatId;
    let newTitle = '';

    // If it's a new chat, create it in the database first
    if (!currentChatId) {
        newTitle = await generateChatTitle(message);
        const chatRef = await firestore.collection('chats').add({
            userId,
            title: newTitle,
            createdAt: FieldValue.serverTimestamp(),
            messages: [], // Will be updated with full history later
        });
        currentChatId = chatRef.id;
    }

    // Append new messages to the document
    await firestore.collection('chats').doc(currentChatId).update({
        messages: FieldValue.arrayUnion(userMessage, modelMessage)
    });
    
    revalidatePath('/chat');

    return {
        chatId: currentChatId!,
        title: newTitle, // Will be empty if it's an existing chat
        aiResponse: modelMessage,
    };
}

/**
 * Deletes a chat session.
 */
export async function deleteChat(chatId: string, userId: string) {
    if (!firestore) {
        console.error("deleteChat: Firestore is not configured. Cannot delete from database.");
        // Since the chat was never saved, we can consider this a "success" from the client's perspective
        // as it will allow the UI to remove the ephemeral chat from its list.
        return { success: true };
    }

    const chatRef = firestore.collection('chats').doc(chatId);
    const doc = await chatRef.get();

    if (doc.exists && doc.data()?.userId === userId) {
        await chatRef.delete();
        revalidatePath('/chat');
        return { success: true };
    }

    return { success: false, error: 'Chat not found or permission denied.' };
}
