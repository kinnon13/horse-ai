// TEMP STUB
interface PageViewProps {
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

export function PageView({ loading, error, setError }: PageViewProps) {
  return <div>Page View Placeholder</div>;
}