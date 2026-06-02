const typeMap = (vueInstance) => {
    return {
        online: {
            modalTitle: vueInstance.$t('onOffLine.online'),
            component: 'TypeAContent',
            effect: {
                title: vueInstance.$t('onOffLine.pleaseSetOnlineTime'),
                immediate: vueInstance.$t('onOffLine.immediateOnline'),
                custom: vueInstance.$t('onOffLine.customOnline'),
            },
            dialog(effectType, time) {
                let dialogMap = { title: '', message: '' };
                dialogMap.title = vueInstance.$t('onOffLine.onlineSuccess');
                if (effectType === 'immediate') {
                    dialogMap.message = vueInstance.$t('onOffLine.onlineSuccessMessage1');
                } else {
                    dialogMap.message = `${time}${vueInstance.$t('onOffLine.onlineSuccessMessage2')}`;
                }
                return dialogMap;
            },
        },
        offline: {
            modalTitle: vueInstance.$t('onOffLine.offline'),
            component: 'TypeBContent',
            effect: {
                title: vueInstance.$t('onOffLine.pleaseSetOffLineTime'),
                immediate: vueInstance.$t('onOffLine.immediateOffLine'),
                custom: vueInstance.$t('onOffLine.customOffLine'),
            },
            processWay: {
                title: vueInstance.$t('onOffLine.offLineProcessWay'),
            },
            dialog(effectType, time) {
                let dialogMap = { title: '', message: '' };
                dialogMap.title = vueInstance.$t('onOffLine.offLineSuccess');
                if (effectType === 'immediate') {
                    dialogMap.message = vueInstance.$t('onOffLine.offLineSuccessMessage1');
                } else {
                    dialogMap.message = `${time}${vueInstance.$t('onOffLine.offLineSuccessMessage2')}`;
                }
                return dialogMap;
            },
        },
        release: {
            modalTitle: vueInstance.$t('onOffLine.release'),
            effect: {
                title: vueInstance.$t('onOffLine.pleaseSetReleaseTime'),
                immediate: vueInstance.$t('onOffLine.immediateRelease'),
                custom: vueInstance.$t('onOffLine.customRelease'),
            },
            processWay: {
                title: vueInstance.$t('onOffLine.releaseProcessWay'),
            },
            init: {
                component: 'TypeAContent',
            },
            noneInit: {
                component: 'TypeBContent',
            },
            dialog(effectType, time) {
                let dialogMap = { title: '', message: '' };
                dialogMap.title = vueInstance.$t('onOffLine.releaseSuccess');
                if (effectType === 'immediate') {
                    dialogMap.message = vueInstance.$t('onOffLine.releaseSuccessMessage1');
                } else {
                    dialogMap.message = `${time}${vueInstance.$t('onOffLine.releaseSuccessMessage1')}`;
                }
                return dialogMap;
            },
        },
        modify: {
            modalTitle: vueInstance.$t('versionControl.modifyAndAnnounce'),
            component: 'TypeCContent',
            dialog(effectType, time) {
                let dialogMap = { title: '', message: '' };
                dialogMap.title = vueInstance.$t('onOffLine.modifyReleaseSuccess');
                if (effectType === 'immediate') {
                    dialogMap.message = vueInstance.$t('onOffLine.modifyReleaseSuccessMessage1');
                } else if (effectType === 'notnow') {
                    dialogMap.message = vueInstance.$t('onOffLine.modifyReleaseSuccessMessage2');
                } else {
                    dialogMap.message = `${time}${vueInstance.$t('onOffLine.modifyReleaseSuccessMessage3')}`;
                }
                return dialogMap;
            },
        },
    };
};
export default typeMap;
