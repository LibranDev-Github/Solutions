/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/runtime', 'N/search', 'N/ui/serverWidget', 'N/record', 'N/redirect', 'N/url'],
/**
 * @param {runtime} runtime
 * @param {search} search
 * @param {serverWidget} serverWidget
 */
function(runtime, search, serverWidget, record, redirect, url) {

    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
        var request = context.request;
        var invadj_id = request.parameters.custpage_invadj_id;
        var recType = request.parameters.custpage_recordtype;
        var recordType;
        if(recType == "vendor"){
            recordType = record.Type.VENDOR;
        }else if(recType == "customer"){
            recordType = record.Type.CUSTOMER;
        }

        //log.debug("request: ", request);
        var invadj_rec = record.load({
            type: recordType,
            id: invadj_id
        });

        //log.debug("[POST]custpage_invadj_id: ", invadj_id);
        //log.debug("[POST]recordType: ", recordType);

        if (request.method == 'POST') {
           
            if (!isNullOrEmpty(invadj_id)) {
                var rejection_reason = request.parameters.custpage_rejection_reason;
                invadj_rec.setValue({
                    fieldId: 'custentity_aw_reject_reason_entity',
                    value: rejection_reason
                });
                invadj_rec.setValue({
                    fieldId: 'custentity_app_stat_entity',
                    value: 4
                });
                invadj_rec.save({
                    ignoreMandatoryFields: true
                });

                redirect.toRecord({
                    id: invadj_id,
                    type: recordType
                });
            }
        }
        //OutPost

        var form = serverWidget.createForm({
            title: 'Reject'
        });

        var btn_submit = form.addSubmitButton({
            label: 'Submit'
        });

        var record_url = url.resolveRecord({
            recordId: invadj_id,
            recordType: recordType
        });

        //log.debug("record_url",record_url);

        var btn_back = form.addButton({
            label: 'Back',
            id: 'custpage_btn_back',
            functionName: "window.open('"+ record_url +"', '_self');"
        });

        var fld_journalentry = form.addField({
            type: serverWidget.FieldType.SELECT,
            id: 'custpage_invadj_id',
            label: 'Record',
            source: recordType
        });

        fld_journalentry.defaultValue = invadj_id;
        //log.debug("Record ID",fld_journalentry.defaultValue);

        var fld_recType = form.addField({
            type: serverWidget.FieldType.TEXT,
            id: "custpage_recordtype",
            label: 'Type',
        });

        fld_recType.defaultValue = recordType;

        fld_journalentry.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.INLINE
        });

        fld_recType.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
        });


        var fld_rejectionreason = form.addField({
            type: serverWidget.FieldType.LONGTEXT,
            id: 'custpage_rejection_reason',
            label: 'Rejection Reason',
        });

        fld_rejectionreason.isMandatory = true;

        fld_rejectionreason.updateLayoutType({
            layoutType : serverWidget.FieldLayoutType.OUTSIDEBELOW
        });
        fld_rejectionreason.defaultValue = invadj_rec.getValue({
            fieldId: 'custentity_aw_reject_reason_entity'
        });



        var frm = context.response.writePage(form);
        //log.debug("form",frm)
        
    }

    function isNullOrEmpty(data) {
        return (data == null || data == '');
    }

    return {
        onRequest: onRequest
    };

});
