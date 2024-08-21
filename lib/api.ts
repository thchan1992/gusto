import { Quiz } from "./types/Quiz";

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

export const createTroubleShootApi = async (
  troubleshootTitle: string
): Promise<Response> => {
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

export const createQuizApi = async (
  isFirst: boolean,
  title: string,
  troubleShootId: string,
  imageUrl: string
): Promise<Response> => {
  try {
    const response = await fetch("/api/quiz/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isFirst: isFirst,
        title: title,
        troubleShootId: troubleShootId,
        imageUrl: imageUrl,
      }),
    });
    return response;
  } catch (e) {
    throw new Error(`Network Error Occurred`);
  }
};

export const createOptionApi = async (
  quizId: string,
  optionList: {
    text: string;
    nextQuizId: string;
  }[]
): Promise<Response> => {
  try {
    const response = await fetch("/api/quiz/create_option", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quizId: quizId,
        optionList: optionList,
      }),
    });
    return response;
  } catch (e) {
    throw new Error(`Network Error Occurred`);
  }
};

export const updateQuestionApi = async (
  updatedQuestion: Quiz
): Promise<Response> => {
  try {
    const response = await fetch("/api/quiz/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updatedQuestion: updatedQuestion,
      }),
    });
    return response;
  } catch (e) {
    throw new Error(`Network Error Occurred`);
  }
};

export const removeQuizApi = async (
  quizId: string,
  troubleshootId: string
): Promise<Response> => {
  try {
    const response = await fetch(
      "/api/quiz/remove/" + quizId + "/" + troubleshootId,
      {
        method: "DELETE",
      }
    );
    return response;
  } catch (e) {}
};

export const removeTroubleShootApi = async (id: string): Promise<Response> => {
  try {
    const response = await fetch("/api/troubleshoot/remove/" + id, {
      method: "DELETE",
    });
    return response;
  } catch (e) {
    throw new Error(`Network Error Occurred`);
  }
};
