import React from 'react'
import { useTranslation } from 'react-i18next';
import { Level } from '../levels/level'
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
        <div className="card-header-icon">
          <span className="icon ">
            <i className="fas fa-sun"></i>
          </span>
        </div>
      </div>

      <div className="card-content">
        <Level data={
          [
            { "title": t('WWV.SFI'), "value": props.wwv_data.data.sfi },
            { "title": t('WWV.PLANETARY_A_INDEX'), "value": props.wwv_data.data.a_index },
            { "title": t('WWV.PLANETARY_K_INDEX'), "value": props.wwv_data.data.k_index },
          ]
        } />
        <p className="is-italic is-pulled-right" title={upd.format('lll')} >{t('WWV.UPDATED')} {upd.fromNow()}</p>
        <hr className="is-invisible" />
      </div>
    </div>
  }
}

export default WWV;