export const fetchTroubleShootsApi = async (): Promise<Response> => {
  try {
    const response = await fetch("/api/troubleshoot/get_all");
    return response;
  } catch (e) {
    throw new Error(`Network Error Occurred`);
  }
};
