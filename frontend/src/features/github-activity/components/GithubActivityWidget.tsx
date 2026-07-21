import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { useGithubActivity } from '../hooks/use-github-activity';

const EVENT_LABELS: Record<string, string> = {
  PushEvent: 'pushed to',
  PullRequestEvent: 'opened a pull request on',
  IssuesEvent: 'opened an issue on',
  CreateEvent: 'created',
  WatchEvent: 'starred',
  ForkEvent: 'forked',
};

export function GithubActivityWidget() {
  const { data, isLoading, isError } = useGithubActivity();

  return (
    <Card>
      <CardTitle>Recent GitHub activity</CardTitle>
      <CardDescription className="mb-4">Pulled live from the public events API.</CardDescription>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {isError && (
        <p className="text-sm text-muted-foreground">GitHub activity is unavailable right now.</p>
      )}

      {data && data.length === 0 && (
        <p className="text-sm text-muted-foreground">No recent public activity.</p>
      )}

      {data && data.length > 0 && (
        <ul className="space-y-3">
          {data.slice(0, 5).map((item, index) => (
            <li key={`${item.repositoryName}-${item.createdAt}-${index}`} className="text-sm">
              <span className="text-muted-foreground">
                {EVENT_LABELS[item.type] ?? 'was active on'}
              </span>{' '}
              <a
                href={item.repositoryUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-foreground hover:text-accent"
              >
                {item.repositoryName}
              </a>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
