// 依流程的起訖日期推導狀態代碼:
//   1 初始(尚未設定生效日,startTime === '9999-12-31')
//   2 待生效(生效日在未來)
//   3 執行中(今日落在生效區間內)
//   4 已關閉(已過結束日,或起訖日反轉)
const processTypeConverter = (startTime, endTime) => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    if (startTime === '9999-12-31') return 1;
    if (today < startTime && endTime >= startTime) return 2;
    if (today >= startTime && today <= endTime) return 3;
    return 4;
};

export default {
    processTypeConverter,
};
