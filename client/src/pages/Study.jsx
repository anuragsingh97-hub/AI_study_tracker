import { useState, useEffect, useRef } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import CameraPreview from "../components/study/CameraPreview";
import StudyTimer from "../components/study/StudyTimer";
import SessionControls from "../components/study/SessionControls";
import FocusCard from "../components/study/FocusCard";

import useFaceDetection from "../hooks/useFaceDetection";

export default function Study() {

    const [running, setRunning] = useState(false);

    const webcamRef = useRef(null);

    const faceDetected = useFaceDetection(webcamRef);

    useEffect(() => {

        let timer;

        if (!faceDetected && running) {

            timer = setTimeout(() => {

                setRunning(false);

                alert("Face not detected. Session Paused.");

            }, 5000);

        }

        return () => clearTimeout(timer);

    }, [faceDetected, running]);

    return (

        <DashboardLayout>

            <h1 className="text-4xl font-bold text-white mb-8">

                Study Session

            </h1>

            <div className="grid lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2">

                    <CameraPreview
                        webcamRef={webcamRef}
                        faceDetected={faceDetected}
                    />

                </div>

                <FocusCard />

            </div>

            <div className="mt-6">

                <StudyTimer running={running} />

                <SessionControls
                    onStart={() => setRunning(true)}
                    onPause={() => setRunning(false)}
                    onResume={() => setRunning(true)}
                    onEnd={() => setRunning(false)}
                />

            </div>

        </DashboardLayout>

    );

}