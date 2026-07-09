import Webcam from "react-webcam";

export default function CameraPreview({ webcamRef, faceDetected }) {
  return (
    <div className="bg-slate-900 rounded-3xl p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-white text-xl">AI Camera</h2>

        <span
          className={`px-3 py-1 rounded-full text-white

                    ${faceDetected ? "bg-green-600" : "bg-red-600"}`}
        >
          {faceDetected ? "Face Detected" : "No Face"}
        </span>
      </div>

      <Webcam
        ref={webcamRef}
        audio={false}
        mirrored={true}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          width: 640,
          height: 480,
          facingMode: "user",
        }}
        className="rounded-2xl w-full"
      />
    </div>
  );
}
