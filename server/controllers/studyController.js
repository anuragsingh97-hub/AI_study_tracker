import StudySession from "../models/StudySession.js";

export const startSession = async (req, res) => {
  try {
    const session = await StudySession.create({
      userId: req.user.id,
      subject: req.body.subject,
      topic: req.body.topic,
      startTime: new Date(),
    });

    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const endSession = async (req, res) => {
  try {
    const session = await StudySession.findOne({ _id: req.params.id, userId: req.user.id });

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    session.endTime = new Date();

    session.duration =
      Math.floor(
        (session.endTime - session.startTime) /
          1000
      );

    session.status = "completed";

    await session.save();

    res.json(session);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getSessions = async (req, res) => {
  const sessions =
    await StudySession.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

  res.json(sessions);
};
