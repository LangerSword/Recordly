// Sign-in is not part of this local build. The dialog stays in the tree so
// callers keep their shapes, but it never renders anything.
import type { User } from "@supabase/supabase-js";

export type SignInReason = "account" | "share";

type Props = {
	variant?: "compact" | "wide";
	onboarding?: boolean;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	reason?: SignInReason;
	user: User | null;
	configured: boolean;
	callbackError?: string;
	onAuthenticated: () => void;
};

export function RecordlySignInDialog(_props: Props) {
	return null;
}
