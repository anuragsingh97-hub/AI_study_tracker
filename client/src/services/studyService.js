import {
  createStudy,
  getStudies,
  updateStudy,
} from "../api/studyApi";

export const startStudy = async (
  subject
) => {
  const res = await createStudy({ subject });

  return res.data.study;
};

export const endStudy = async (
  id
) => {
  const res = await updateStudy(id, {
    status: "completed",
    completed: true,
    endTime: new Date().toISOString(),
  });

  return res.data.study;
};

export const getStudySessions =
  async () => {
    const res = await getStudies();

    return res.data.studies;
  };
