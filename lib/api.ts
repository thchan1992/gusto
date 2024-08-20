export const fetchTroubleShootsApi = async (): Promise<Response> => {
  try {
    const response = await fetch("/api/troubleshoot/get_all");
    return response;
  } catch (e) {
    throw new Error(`Network Error Occurred`);
  }
};

export const fetchOneTroubleShootApi = async (
  id: string
): Promise<Response> => {
  try {
    const response = await fetch("/api/troubleshoot/get/" + id);
    return response;
  } catch (e) {
    throw new Error(`Network Error Occurred`);
  }
};

export const fetchOnePublicTroubleShootApi = async (
  token: string
): Promise<Response> => {
  try {
    const response = await fetch("/api/get_troubleshoot_public/" + token);
    return response;
  } catch (e) {
    throw new Error(`Network Error Occurred`);
  }
};

export const createTroubleShootApi = async (troubleshootTitle: string) => {
  try {
    const response = await fetch("/api/troubleshoot/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: troubleshootTitle,
      }),
    });
    return response;
  } catch (e) {
    throw new Error(`Network Error Occurred`);
  }
};
