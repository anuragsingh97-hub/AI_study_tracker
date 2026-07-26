import axios from "axios";

const API = "http://localhost:5000/api/quiz";

export const generateQuiz = async (data, token) => {
  const res = await axios.post(
    `${API}/generate`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};