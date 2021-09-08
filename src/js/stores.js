import { writable } from 'svelte/store';

export const currentPub = writable({});
export const history = writable([]);
export const leaderboard = writable({ scores: [], allScores: [], counts: []});