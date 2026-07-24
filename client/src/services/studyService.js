import API from "../api/axios";

export const startStudy = async (
  subject
) => {
  const res = await API.post(
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
  const res = await API.put(
    `/study/end/${id}`
  );

  return res.data;
};

export const getStudySessions =
  async () => {
    const res = await API.get(
      "/study"
    );

    return res.data;
  };
