sap.ui.define([
    "sap/ui/core/format/DateFormat"
], function (
    DateFormat
) {
    "use strict";

    return {
        formatListItemHighlight(sDeliveryDate) {
            const oDateFormat = DateFormat.getDateInstance();
            const oDeliveryDate = oDateFormat.parse(sDeliveryDate);
            const oTodayMidnight = new Date().setHours(0, 0, 0, 0);

            if (oDeliveryDate < oTodayMidnight) {
                return "Error"
            }
            return "Success";
        },
    };
});