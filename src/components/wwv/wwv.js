import React from 'react'
import { useTranslation } from 'react-i18next';
import dayjs from '../../time'

function WWV(props) {
  const { t, i18n } = useTranslation();

  if (props.wwv_data === null)
    return <p>{t('WWV.LOADING')}</p>
  else {
    let upd = dayjs(props.wwv_data.data.date);
    return <div className="card">
      <div className="card-header">
        <div className="card-header-title">
          {t('WWV.MAIN_TITLE')}
        </div>
      </div>

      <div className="card-content">
        <p><i>{t('WWV.SFI')}</i> {props.wwv_data.data.sfi}</p>
        <p><i>{t('WWV.PLANETARY_A_INDEX')}</i> {props.wwv_data.data.a_index}</p>
        <p><i>{t('WWV.PLANETARY_K_INDEX')}</i> {props.wwv_data.data.k_index}</p>
        <p title={upd.format('lll')} ><i>{t('WWV.UPDATED')}</i> {upd.fromNow()}</p>
      </div>
    </div>
  }
}

export default WWV;