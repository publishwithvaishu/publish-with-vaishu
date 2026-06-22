export type ActionState = {
  ok?: boolean;
  error?: string | null;
  success?: string | null;
  fieldErrors?: Record<string, string>;
};

export const initialActionState: ActionState = {};
