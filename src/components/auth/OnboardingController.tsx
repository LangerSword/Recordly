// Sign-in onboarding is not part of this local build; this controller
// never opens anything.
import type { User } from "@supabase/supabase-js";

export function OnboardingController(_props: {
	requestNonce: number;
	ready: boolean;
	user: User | null;
	configured: boolean;
	callbackError?: string;
}) {
	return null;
}
