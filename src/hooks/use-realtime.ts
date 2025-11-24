"use client";

import { useEffect, useCallback, useRef } from "react";
import { getPusherClient, CHANNELS, EVENTS } from "@/lib/pusher-client";
import { useRouter } from "next/navigation";

type EventCallback = (data: any) => void;

export function useRealtimeSubscription(
  channelName: string,
  eventName: string,
  callback: EventCallback,
  deps: React.DependencyList = []
) {
  const callbackRef = useRef(callback);
  const router = useRouter();

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback, ...deps]);

  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe(channelName);

    const handler = (data: any) => {
      callbackRef.current(data);
    };

    channel.bind(eventName, handler);

    return () => {
      channel.unbind(eventName, handler);
      pusher.unsubscribe(channelName);
    };
  }, [channelName, eventName]);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  return { refresh };
}

// Specific hooks for different use cases
export function useResultUpdates(onUpdate: () => void) {
  useRealtimeSubscription(CHANNELS.RESULTS, EVENTS.RESULT_APPROVED, onUpdate);
  useRealtimeSubscription(CHANNELS.RESULTS, EVENTS.RESULT_REJECTED, onUpdate);
  useRealtimeSubscription(CHANNELS.RESULTS, EVENTS.RESULT_SUBMITTED, onUpdate);
  useRealtimeSubscription(CHANNELS.RESULTS, EVENTS.RESULT_UPDATED, onUpdate);
}

export function useAssignmentUpdates(onUpdate: () => void) {
  useRealtimeSubscription(CHANNELS.ASSIGNMENTS, EVENTS.ASSIGNMENT_CREATED, onUpdate);
  useRealtimeSubscription(CHANNELS.ASSIGNMENTS, EVENTS.ASSIGNMENT_DELETED, onUpdate);
}

export function useRegistrationUpdates(onUpdate: () => void) {
  useRealtimeSubscription(CHANNELS.REGISTRATIONS, EVENTS.REGISTRATION_CREATED, onUpdate);
  useRealtimeSubscription(CHANNELS.REGISTRATIONS, EVENTS.REGISTRATION_DELETED, onUpdate);
}

export function useStudentUpdates(onUpdate: () => void) {
  useRealtimeSubscription(CHANNELS.STUDENTS, EVENTS.STUDENT_CREATED, onUpdate);
  useRealtimeSubscription(CHANNELS.STUDENTS, EVENTS.STUDENT_UPDATED, onUpdate);
  useRealtimeSubscription(CHANNELS.STUDENTS, EVENTS.STUDENT_DELETED, onUpdate);
}

export function useScoreboardUpdates(onUpdate: () => void) {
  useRealtimeSubscription(CHANNELS.SCOREBOARD, EVENTS.SCOREBOARD_UPDATED, onUpdate);
}

