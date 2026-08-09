import api from "../api/axios";

// Fetch quiz by studyId
export const getQuizByStudyId = async (studyId) => {
  const { data } = await api.get(`/quiz/${studyId}`);
  return data;
};

// Submit quiz answers
export const submitQuiz = async (studyId, payload) => {
  const { data } = await api.post(`/quiz/${studyId}/submit`, payload);
  return data;
};

export const getCompletedQuizzes = async () => {
  const { data } = await api.get("/quiz/completed");
  return data.quizzes ?? [];
};
