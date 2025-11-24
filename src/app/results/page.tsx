import { getApprovedResults, getPrograms } from "@/lib/data";
import { ResultsRealtime } from "@/components/results-realtime";

async function getResultsData() {
  const [results, programs] = await Promise.all([
    getApprovedResults(),
    getPrograms(),
  ]);

  const programMap = new Map(programs.map((p) => [p.id, p]));

  return {
    results,
    programs,
    programMap,
  };
}

export default async function ResultsPage() {
  const data = await getResultsData();

  return (
    <ResultsRealtime
      programs={data.programs}
      results={data.results}
      programMap={data.programMap}
    />
  );
}

