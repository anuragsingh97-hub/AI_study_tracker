// import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config();

// async function models() {
//     try {
//         const res = await axios.get(
//             "https://generativelanguage.googleapis.com/v1beta/models",
//             {
//                 headers: {
//                     "x-goog-api-key": process.env.GEMINI_API_KEY
//                 }
//             }
//         );

//         console.log(res.data);
//     } catch (err) {
//         console.log(err.response?.data || err.message);
//     }
// }

// models();
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function listModels() {
  try {
    const res = await axios.get(
      "https://generativelanguage.googleapis.com/v1beta/models",
      {
        headers: {
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );

    console.log(
      res.data.models.map((m) => ({
        name: m.name,
        displayName: m.displayName,
      }))
    );
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
}

listModels();