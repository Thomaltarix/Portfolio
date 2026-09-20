import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { LEGAL_IDENTITY } from '../legal-identity';
import { LegalDocument, type LegalSection } from './LegalDocument';

export function LegalNoticePage() {
  const { t } = useTranslation('legal');
  const sections = t('legalNotice.sections', {
    returnObjects: true,
    ...LEGAL_IDENTITY,
  }) as LegalSection[];

  return (
    <>
      <Helmet>
        <title>{t('legalNotice.title')}</title>
        <meta name="description" content={t('legalNotice.description')} />
        <link rel="canonical" href={`${LEGAL_IDENTITY.siteUrl}/mentions-legales`} />
      </Helmet>
      <LegalDocument
        title={t('legalNotice.title')}
        updatedLabel={t('updated', { date: LEGAL_IDENTITY.lastUpdated })}
        sections={sections}
      />
    </>
  );
}
