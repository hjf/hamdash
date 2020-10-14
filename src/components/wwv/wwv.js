import React from 'react'
import { useTranslation } from 'react-i18next';
import { Level } from '../levels/level'
import dayjs from '../../time'
import { MyCard } from '../mycard'

function WWV(props) {
  const { t, i18n } = useTranslation();

  if (props.wwv_data === null)
    return <p>{t('WWV.LOADING')}</p>
  else {
    let upd = dayjs(props.wwv_data.data.date);
    return <MyCard title={t('WWV.MAIN_TITLE')} icon="sun">
        <Level data={
          [
            { "title": t('WWV.SFI'), "value": props.wwv_data.data.sfi },
            { "title": t('WWV.PLANETARY_A_INDEX'), "value": props.wwv_data.data.a_index },
            { "title": t('WWV.PLANETARY_K_INDEX'), "value": props.wwv_data.data.k_index },
          ]
        } />
        <p className="is-italic is-pulled-right" title={upd.format('lll')} >{t('WWV.UPDATED')} {upd.fromNow()}</p>
        <hr className="is-invisible" />
   
    </MyCard>
  }
}

export default WWV;