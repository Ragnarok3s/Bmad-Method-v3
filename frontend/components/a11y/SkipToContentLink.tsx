'use client';

import { useTranslation } from '@/lib/i18n';

type SkipToContentLinkProps = {
  targetId: string;
  className?: string;
};

export function SkipToContentLink({ targetId, className }: SkipToContentLinkProps) {
  const { t } = useTranslation('common');
  const classes = ['skip-link'];
  if (className) {
    classes.push(className);
  }

  return (
    <a className={classes.join(' ')} href={`#${targetId}`}>
      {t('skipToMainContent')}
    </a>
  );
}
