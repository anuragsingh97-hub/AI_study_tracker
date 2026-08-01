export const formatDuration = (seconds = 0) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  return `${minutes}m ${String(safeSeconds % 60).padStart(2, "0")}s`;
};

export const formatClock = (seconds = 0) =>
  `${String(Math.floor(Math.max(0, seconds) / 60)).padStart(2, "0")}:${String(
    Math.max(0, seconds) % 60,
  ).padStart(2, "0")}`;

export const getQuestionKey = (question, index) => question._id ?? String(index);

export const getQuizFromResponse = (response) => response?.quiz ?? response?.data?.quiz ?? response?.data ?? response;

export const getResultFromResponse = (response) =>
  response?.result ?? response?.quiz ?? response?.data?.result ?? response?.data ?? response;
