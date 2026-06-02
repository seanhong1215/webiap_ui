import moment, { Moment } from 'moment';
const processTypeConverter = (startTime, endTime, executable) => {
    const nowDate = moment(new Date()).format('YYYY-MM-DD');
    let type;
    if (startTime == '9999-12-31') {
        type = 1;
    } else if (nowDate < startTime && endTime >= startTime) {
        type = 2;
    } else if (nowDate >= startTime && nowDate <= endTime) {
        type = 3;
    } else if (nowDate > endTime || startTime > endTime) {
        type = 4;
    }
    return type;
};
const convertMinuteToDuration = (time) => {
    if (time == '*') {
        return { days: 0, hours: 0, minutes: 0 };
    }
    const multiplyItem = Math.sign(time) == -1 ? -1 : 1;
    time *= multiplyItem;
    const days = Math.floor(time / (24 * 60));
    const hours = Math.floor((time - days * 24 * 60) / 60);
    const minutes = time - days * 24 * 60 - hours * 60;
    console.log(`${days},${hours},${minutes}`);
    return {
        days: days * multiplyItem,
        hours: hours * multiplyItem,
        minutes: minutes * multiplyItem,
    };
};
const convertDurationToMinute = (duration) => {
    return duration.days * 24 * 60 + duration.hours * 60 + duration.minutes;
};
const getElementTotalHeight = (element) => {
    const computedStyle = getComputedStyle(element);
    const height = computedStyle.height === 'auto' ? '0px' : computedStyle.height;
    // computedStyle's height is include padding and margin, so we don't need to add those.
    return height;
};

const compareObjIsSame = (eleObj1, eleObj2) => {
    const deepEqual = (object1, object2) => {
        const keys1 = Object.keys(object1);
        const keys2 = Object.keys(object2);
        const isObject = (object) => {
            return object != null && typeof object === 'object';
        };
        if (keys1.length !== keys2.length) {
            return false;
        }

        for (let index = 0; index < keys1.length; index++) {
            const val1 = object1[keys1[index]];
            const val2 = object2[keys2[index]];
            const areObjects = isObject(val1) && isObject(val2);
            if ((areObjects && !deepEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
                return false;
            }
        }
        return true;
    };
    return !deepEqual(eleObj1, eleObj2);
};

const compareObjIsSame_v2 = (eleObj1, eleObj2) => {
    const deepEqual = (object1, object2) => {
        const keys1 = Object.keys(object1);
        const keys2 = Object.keys(object2);
        const isObject = (object) => {
            return object != null && typeof object === 'object';
        };

        for (let index = 0; index < keys1.length; index++) {
            const val1 = object1[keys1[index]];
            const val2 = object2[keys1[index]];
            const areObjects = isObject(val1) && isObject(val2);
            if ((areObjects && !deepEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
                return false;
            }
        }
        return true;
    };
    return !deepEqual(eleObj1, eleObj2);
};

export default {
    processTypeConverter,
    convertMinuteToDuration,
    convertDurationToMinute,
    getElementTotalHeight,
    compareObjIsSame,
    compareObjIsSame_v2,
};
