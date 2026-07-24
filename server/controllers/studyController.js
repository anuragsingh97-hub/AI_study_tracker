import mongoose from "mongoose";
import Study from "../models/Study.js";

const writableFields = [
  "subject",
  "topic",
  "goal",
  "status",
  "startTime",
  "endTime",
  "plannedDuration",
  "actualDuration",
  "pauseDuration",
  "pauseCount",
  "completed",
  "focusScore",
  "distractionCount",
  "distractions",
  "notes",
];

const studyPayload = (body) => {
  const payload = Object.fromEntries(
    writableFields
      .filter((field) => body[field] !== undefined)
      .map((field) => [field, body[field]]),
  );

  if (Array.isArray(payload.distractions) && body.distractionCount === undefined) {
    payload.distractionCount = payload.distractions.length;
  }

  return payload;
};

const invalidId = (id) => !mongoose.isValidObjectId(id);

const sendError = (res, status, message) =>
  res.status(status).json({ success: false, message });

export const createStudy = async (req, res) => {
  try {
    const study = await Study.create({
      ...studyPayload(req.body),
      user: req.user.id,
    });

    return res.status(201).json({ success: true, study });
  } catch (error) {
    return sendError(
      res,
      error.name === "ValidationError" || error.name === "CastError" ? 400 : 500,
      error.message,
    );
  }
};

export const getStudies = async (req, res) => {
  try {
    const studies = await Study.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: studies.length, studies });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const getStudyById = async (req, res) => {
  if (invalidId(req.params.id)) return sendError(res, 400, "Invalid study session id");

  try {
    const study = await Study.findOne({ _id: req.params.id, user: req.user.id });
    if (!study) return sendError(res, 404, "Study session not found");

    return res.status(200).json({ success: true, study });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const updateStudy = async (req, res) => {
  if (invalidId(req.params.id)) return sendError(res, 400, "Invalid study session id");

  try {
    const study = await Study.findOne({ _id: req.params.id, user: req.user.id });
    if (!study) return sendError(res, 404, "Study session not found");

    Object.assign(study, studyPayload(req.body));
    await study.save();

    return res.status(200).json({ success: true, message: "Study session updated", study });
  } catch (error) {
    return sendError(
      res,
      error.name === "ValidationError" || error.name === "CastError" ? 400 : 500,
      error.message,
    );
  }
};

export const deleteStudy = async (req, res) => {
  if (invalidId(req.params.id)) return sendError(res, 400, "Invalid study session id");

  try {
    const study = await Study.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!study) return sendError(res, 404, "Study session not found");

    return res.status(200).json({ success: true, message: "Study session deleted" });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
