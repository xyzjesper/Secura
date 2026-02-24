export type ErrorCodeCallback = {
  code: number;
  message: string;
};

export type LoginCallback = {
  success: boolean;
  message: string;
  onboarding: boolean;
  code?: string;
};
