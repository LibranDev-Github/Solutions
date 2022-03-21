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
        var record_id = request.parameters.custpage_record_id;
        var recordType = request.parameters.custpage_record_type;
        var approvalStatus = request.parameters.custpage_approval_status;
        var ReasonField = request.parameters.custpage_reject_reason;
        var ReasonFieldID = request.parameters.custpage_reject_reason_id;

        var LogDetails = {
            record_id : record_id,
            recordType : recordType,    
            approvalStatus : approvalStatus,
            ReasonField : ReasonField,
            ReasonFieldID : ReasonFieldID
        }
        //log.debug("Enter Suitelet",LogDetails);

        var loaded_record = record.load({
            type: recordType,
            id: record_id
        });
        //'m-d-Y h:i:s
        var FormattedDate = new Date().toLocaleString('en-US', {timeZone: 'America/Los_Angeles'})

        if (request.method == 'POST') {
        var previous_reasons = request.parameters.custpage_previous_reasons;


        var Dated_Reason_Field = "[" + FormattedDate  + "] " + ReasonField
        var newRejectReason = previous_reasons + "\r\n" + Dated_Reason_Field
        log.debug("Enter POST",LogDetails);
           
            if (!isNullOrEmpty(record_id)) {
                loaded_record.setValue({
                    fieldId: ReasonFieldID,
                    value: newRejectReason
                });
                loaded_record.setValue({
                    fieldId: approvalStatus,
                    value: 4
                });
                loaded_record.save({
                    ignoreMandatoryFields: true
                });

                redirect.toRecord({
                    id: record_id,
                    type: recordType
                });
            }
        }
        //OutPost
        var appStat = loaded_record.getValue({
            fieldId: approvalStatus
        });
        log.debug(approvalStatus,appStat);

        var form = serverWidget.createForm({
            title: 'Reject'
        });

        var btn_submit = form.addSubmitButton({
            label: 'Submit'
        });

        var record_url = url.resolveRecord({
            recordId: record_id,
            recordType: recordType
        });

        //log.debug("record_url",record_url);

        var btn_back = form.addButton({
            label: 'Back',
            id: 'custpage_btn_back',
            functionName: "window.open('"+ record_url +"', '_self');"
        });

        var record_id_field = form.addField({
            type: serverWidget.FieldType.SELECT,
            id: 'custpage_record_id',
            label: 'Record',
            source: recordType
        });

        record_id_field.defaultValue = record_id;
        //log.debug("Record ID",record_id_field.defaultValue);

        //----------------------------------------------
        var fld_rejField = form.addField({
            type: serverWidget.FieldType.TEXT,
            id: "custpage_reject_reason_id",
            label: 'ReasonField',
        });

        fld_rejField.defaultValue = ReasonFieldID;

        fld_rejField.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
        });
        //----------------------------------------------
        var fld_prevRes= form.addField({
            type: serverWidget.FieldType.LONGTEXT,
            id: "custpage_previous_reasons",
            label: 'Previous Reject Reasons',
        });
        fld_prevRes.defaultValue = loaded_record.getValue({
                 fieldId: ReasonFieldID
             });
        fld_prevRes.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.INLINE
        });
        //----------------------------------------------
        var fld_appStatus= form.addField({
            type: serverWidget.FieldType.TEXT,
            id: "custpage_approval_status",
            label: 'approvalStatus',
        });
        fld_appStatus.defaultValue = approvalStatus;
        fld_appStatus.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
        });
        //----------------------------------------------

        var fld_recType = form.addField({
            type: serverWidget.FieldType.TEXT,
            id: "custpage_record_type",
            label: 'Type',
        });

        fld_recType.defaultValue = recordType;

        record_id_field.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.INLINE
        });

        fld_recType.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
        });


        var fld_rejectionreason = form.addField({
            type: serverWidget.FieldType.LONGTEXT,
            id: 'custpage_reject_reason',
            label: 'Rejection Reason',
        });

        fld_rejectionreason.isMandatory = true;

        fld_rejectionreason.updateLayoutType({
            layoutType : serverWidget.FieldLayoutType.OUTSIDEBELOW
        });
       // fld_rejectionreason.defaultValue = loaded_record.getValue({
       //     fieldId: ReasonFieldID
       // });



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
