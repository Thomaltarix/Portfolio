import { CONTACT_LINKS } from '@/features/contact/contact-links';

// Single source of truth for the identity details shown on the legal pages.

export const LEGAL_IDENTITY = {
  publisherName: 'Thomas Boué',
  contactEmail: CONTACT_LINKS.email,
  hostName: 'OVH SAS',
  hostAddress: '2 rue Kellermann, 59100 Roubaix, France',
  hostPhone: '1007 (depuis la France)',
  hostWebsite: 'https://www.ovhcloud.com',
  siteUrl: 'https://thomasboue.com',
  lastUpdated: '2026-09-20',
} as const;
