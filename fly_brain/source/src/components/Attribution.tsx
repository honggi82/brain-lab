import { asset } from '../lib/atlas';
import { useT } from '../lib/i18n';

/** Required by LICENSE. You may restyle or relocate this credit, but keep it readable and linked. */
export function Attribution() {
  const { t } = useT();
  return <footer>
    <span>{t('attr.builtWith')} <a href="https://github.com/cobanov/fly-connectome-template">fly-connectome-template</a> {t('attr.by')} <a href="https://github.com/cobanov">Mert Cobanov</a>. <a href={asset("TEMPLATE-LICENSE.txt")}>{t('attr.license')}</a></span>
    <span>{t('attr.data')}: <a href="https://male-cns.janelia.org/">MaleCNS · CC BY 4.0</a> · {t('attr.body')}: <a href="https://github.com/TuragaLab/flybody">Flybody · Apache 2.0</a></span>
  </footer>;
}
