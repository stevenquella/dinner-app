import type { User } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import { writable } from "svelte/store";

const client = createClient(
	import.meta.env.VITE_SUPABASE_URL as string,
	import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

const user = writable<User>(client.auth.user());

const getUser = () => client.auth.user();

// update the user on auth state change
client.auth.onAuthStateChange(function (event, session) {
	user.set(session?.user);
});

export * from "./meals";
export * from "./users";
export {
	client,
	/** user store */
	user,
	/** get the current user, assumes there is a valid session */
	getUser,
};
