import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { useGithubActivity } from '../hooks/use-github-activity';

const KNOWN_EVENT_TYPES = [
  'PushEvent',
  'PullRequestEvent',
  'IssuesEvent',
  'CreateEvent',
  'WatchEvent',
  'ForkEvent',
] as const;

export function GithubActivityWidget() {
  const { t } = useTranslation('github-activity');
  const { data, isLoading, isError } = useGithubActivity();

  const eventLabel = (type: string): string => {
    const knownType = KNOWN_EVENT_TYPES.find((eventType) => eventType === type);
    return knownType ? t(`events.${knownType}`) : t('fallbackEvent');
  };

  return (
    <Card>
      <CardTitle>{t('title')}</CardTitle>
      <CardDescription className="mb-4">{t('subtitle')}</CardDescription>

      {isLoading && <p className="text-sm text-muted-foreground">{t('loading')}</p>}
      {isError && <p className="text-sm text-muted-foreground">{t('error')}</p>}

      {data && data.length === 0 && <p className="text-sm text-muted-foreground">{t('empty')}</p>}

      {data && data.length > 0 && (
        <ul className="space-y-3">
          {data.slice(0, 5).map((item, index) => (
            <li key={`${item.repositoryName}-${item.createdAt}-${index}`} className="text-sm">
              <span className="text-muted-foreground">{eventLabel(item.type)}</span>{' '}
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
