import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isAnalyticsOptedOut, setAnalyticsOptOut } from '../analytics-opt-out';

export function AnalyticsOptOut() {
  const { t } = useTranslation('legal');
  const [optedOut, setOptedOut] = useState(isAnalyticsOptedOut);

  const handleChange = (checked: boolean) => {
    setAnalyticsOptOut(checked);
    setOptedOut(checked);
  };

  return (
    <section className="mt-10 rounded-lg border border-border p-5">
      <h2 className="text-lg font-semibold">{t('optOut.heading')}</h2>
      <label className="mt-3 flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          className="mt-1 size-4"
          checked={optedOut}
          onChange={(event) => handleChange(event.target.checked)}
        />
        <span>{t('optOut.label')}</span>
      </label>
    </section>
  );
}
