import API from "./axios";

export const createStudy = (studyData) => API.post("/study", studyData);

export const getStudies = () => API.get("/study");

export const getStudyById = (id) => API.get(`/study/${id}`);

export const updateStudy = (id, studyData) =>
  API.put(`/study/${id}`, studyData);

export const deleteStudy = (id) => API.delete(`/study/${id}`);
