sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/m/MessageBox",    
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/Fragment",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (
        Controller,
        Filter,
        FilterOperator,
        MessageBox,
        DateFormat,
        Fragment,
    ) {
        "use strict";

        const DEFAULT_PROVIDER_ID = "2760216418";
        const PARCEL_UPDATE_GROUP_ID = 'parcels';
        const PARCEL_STATUS_CONFIRMED = 2;
        const PARCEL_STATUS_CREATED_BY_SCAN = 3;
        const DATE_FORMAT = DateFormat.getDateInstance({ pattern : "yyyy-MM-dd" });
        const TIME_FORMAT = DateFormat.getTimeInstance({ pattern: "HH:mm:ss.S" });

        return Controller.extend("my.parcelscanner.scanner.controller.Overview", {

            /* =========================================================== */
            /* lifecycle methods                                           */
            /* =========================================================== */

            onInit() {
                // nothing
            },

            /* =========================================================== */
            /* event handlers                                              */
            /* =========================================================== */

            onFilterParcels(oEv) {
                const oList = this.byId("parcelList");
			    const oBinding = oList.getBinding("items");
                const aFilter = [];
                const sQuery = oEv.getParameter("query");

                if (sQuery) {
                    aFilter.push(new Filter("ID", FilterOperator.Contains, sQuery));
                }
                aFilter.push(this._getDefaultFilter());

                oBinding.filter(aFilter);
            },

            onCreateButtonPressed(oEv) {
                if (!this._oDialog) {
                    Fragment.load({id: this.getView().getId(), name: 'my.parcelscanner.scanner.view.fragments.CreateParcelDialog', controller: this})
                        .then((oDialog) => {
                            this._oDialog = oDialog;
                            this.getView().addDependent(this._oDialog);
                            this._oDialog.open();
                        });
                } else {
                    this._oDialog.open();
                }
            },

            onListItemPressed(oEv) {
                const oCtx = oEv.getSource().getBindingContext();
                const tsNow = new Date().toISOString();

                MessageBox.confirm(this.getText("overview.parcelList.messageBox.confirm", [oCtx.getProperty("ID")]), {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: (sAction) => {
                        if (sAction === "OK") {
                            oCtx.setProperty("status", PARCEL_STATUS_CONFIRMED, PARCEL_UPDATE_GROUP_ID);
                            oCtx.setProperty("scanDateTime", tsNow, PARCEL_UPDATE_GROUP_ID); 
                        }
                    }
                });
            },

            onCreateParcelDialogSaveBtnPressed(oEv) {
              const iId = this.byId("idInput").getValue();
              const oSelectedItem = this.byId("providerSelect").getSelectedItem();
              const sProviderName = oSelectedItem.getText();
              const iProviderId = oSelectedItem.getKey();              

              if (iId.length > 0) {
                this._createParcel(iId, sProviderName, iProviderId);
              } else {
                this.byId("idInput").setValueState("Error");
              }
            },

            onCreateParcelDialogCloseBtnPressed () {
                this.byId("idInput").setValueState("None");
                this.byId("idInput").setValue(null);
                this._oDialog.close();
            },

            /* =========================================================== */
            /* internal methods                                            */
            /* =========================================================== */

            _createParcel(iId, sProviderName, iProviderId) {
                const oDate = new Date();
                const dateStr = DATE_FORMAT.format(oDate);
                const timeStr = TIME_FORMAT.format(oDate);
                const tsNow = new Date().toISOString();
                const oCtx = this.byId("parcelList").getBinding("items");

                oCtx.attachEventOnce("createCompleted", (oEv) => {
                    this._oDialog.setBusy(false);    
                    if (oEv.getParameters().success) {
                        this.byId("idInput").setValue(null);
                        this._oDialog.close();                  
                    } else {
                        this.byId("idInput").setValueState("Error");
                    }               
                }, this);

                this._oDialog.setBusy(true);
                this.byId("parcelList").getBinding("items")
                    .create({
                        ID: iId,
                        providerId: iProviderId,
                        providerName: sProviderName,
                        status: PARCEL_STATUS_CREATED_BY_SCAN,
                        scanDateTime: tsNow,
                        deliveryDate: dateStr,
                        deliveryTime: timeStr,
                    });   
            },

           _getDefaultFilter() {
                return new Filter({
                    filters: [
                        new Filter("providerId", FilterOperator.EQ, DEFAULT_PROVIDER_ID),
                    ],
                    and: true
                })
           },

            /* =========================================================== */
            /* helper methods                                              */
            /* =========================================================== */

            getModel(sName) {
                let oModel = this.getView().getModel(sName);
                if (!oModel) {
                    oModel = this.getOwnerComponent().getModel(sName);
                }
                return oModel;
            },

            getText(sKey, aPlaceholder) {
                return this.getModel("i18n").getResourceBundle().getText(sKey, aPlaceholder);
            },
        });
    });
