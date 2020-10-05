import React from 'react'
import { useTranslation } from 'react-i18next';

var dayjs = require('dayjs')
require('dayjs/locale/es')
var localizedFormat = require('dayjs/plugin/localizedFormat')
var relativeTime=require('dayjs/plugin/relativeTime')
dayjs.extend(localizedFormat)
var localeData = require('dayjs/plugin/localeData')
dayjs.extend(localeData)

function WWV(props) {
  const { t, i18n } = useTranslation();
dayjs.locale(i18n.lng)
dayjs.extend(relativeTime)

  if (props.wwv_data === null)
    return <p>{t('WWV.LOADING')}</p>
  else {
    let upd=dayjs(props.wwv_data.data.date);
    return <div className="component outline solar">
      <h1>{t('WWV.MAIN_TITLE')}</h1>
      <p><i>{t('WWV.SFI')}</i> {props.wwv_data.data.sfi}</p>
      <p><i>{t('WWV.PLANETARY_A_INDEX')}</i> {props.wwv_data.data.a_index}</p>
      <p><i>{t('WWV.PLANETARY_K_INDEX')}</i> {props.wwv_data.data.k_index}</p>
      <p title={upd.format('lll')} ><i>{t('WWV.UPDATED')}</i> {upd.fromNow()}</p>
    </div>;
  }
}

export default WWV;