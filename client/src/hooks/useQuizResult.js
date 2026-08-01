import { useEffect, useState } from "react";
import { getQuizByStudyId } from "../services/quizService";
import { getQuizFromResponse } from "../utils/quizUtils";

// Lets result and review screens survive a browser refresh when the API returns
// the completed quiz and its persisted evaluation fields.
export default function useQuizResult(studyId, initialResult) {
  const [result, setResult] = useState(initialResult ?? null);
  const [loading, setLoading] = useState(!initialResult);
  useEffect(() => {
    if (initialResult) return undefined;
    let mounted = true;
    getQuizByStudyId(studyId).then((response) => {
      if (mounted) setResult(getQuizFromResponse(response));
    }).catch(() => {
      if (mounted) setResult(null);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, [initialResult, studyId]);
  return { result, loading };
}
