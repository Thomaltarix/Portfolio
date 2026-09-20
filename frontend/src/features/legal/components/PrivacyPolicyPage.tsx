import { AnalyticsOptOut } from '@/features/analytics/components/AnalyticsOptOut';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { LEGAL_IDENTITY } from '../legal-identity';
import { LegalDocument, type LegalSection } from './LegalDocument';

export function PrivacyPolicyPage() {
  const { t } = useTranslation('legal');
  const sections = t('privacy.sections', {
    returnObjects: true,
    ...LEGAL_IDENTITY,
  }) as LegalSection[];

  return (
    <>
      <Helmet>
        <title>{t('privacy.title')}</title>
        <meta name="description" content={t('privacy.description')} />
        <link rel="canonical" href={`${LEGAL_IDENTITY.siteUrl}/confidentialite`} />
      </Helmet>
      <LegalDocument
        title={t('privacy.title')}
        updatedLabel={t('updated', { date: LEGAL_IDENTITY.lastUpdated })}
        sections={sections}
      >
        <AnalyticsOptOut />
      </LegalDocument>
    </>
  );
}
