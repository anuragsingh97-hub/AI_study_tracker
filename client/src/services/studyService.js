import axios from "./axiosInstance";

export const startStudy = async (
  subject
) => {
  const res = await axios.post(
    "/study/start",
    {
      subject,
    }
  );

  return res.data;
};

export const endStudy = async (
  id
) => {
  const res = await axios.put(
    `/study/end/${id}`
  );

  return res.data;
};

export const getStudySessions =
  async () => {
    const res = await axios.get(
      "/study"
    );

    return res.data;
  };