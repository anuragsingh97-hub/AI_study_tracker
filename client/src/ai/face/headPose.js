export function calculateHeadPose(landmarks) {
  if (!landmarks || landmarks.length === 0) {
    return {
      direction: "No Face",
      lookingAway: false,
    };
  }

  const face = landmarks[0];

  // Landmark indices
  const nose = face[1];
  const leftEye = face[33];
  const rightEye = face[263];

  if (!nose || !leftEye || !rightEye) {
    return {
      direction: "Unknown",
      lookingAway: false,
    };
  }

  // Midpoint of eyes
  const eyeCenterX = (leftEye.x + rightEye.x) / 2;
  const eyeCenterY = (leftEye.y + rightEye.y) / 2;

  const dx = nose.x - eyeCenterX;
  const dy = nose.y - eyeCenterY;

  let direction = "Center";

  // The nose naturally sits below the eye line, so a small positive `dy`
  // is a neutral pose—not a user looking down.  These wider tolerances work
  // better with laptops/webcams placed slightly above the user's face.
  if (dx > 0.07) direction = "Right";
  else if (dx < -0.07) direction = "Left";
  else if (dy > 0.16) direction = "Down";
  else if (dy < 0.01) direction = "Up";

  return {
    direction,
    lookingAway: direction !== "Center",
  };
}
