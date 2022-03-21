/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/runtime', 'N/url', 'N/error'],
/**
 * @param {format} format
 * @param {record} record
 */
function(runtime, url, error) {

    var SPARAM_SUITELET_SCRIPTID = 'custscript_aw_sparam_sl_script';
    var SPARAM_SUITELET_DEPLOYID = 'custscript_aw_sparam_sl_deploymentid';
    var SPARAM_TITLE = 'custscript_aw_sparam_sl_title';
    var SPARAM_RECORD = 'custscript_aw_sparam_sl_record';
    var SPARAM_STATUS = 'custscript_aw_sparam_sl_status';
    var SPARAM_APPROVER = 'custscript_aw_sparam_sl_approver';
    var SPARAM_REASON = 'custscript_aw_sparam_sl_reject_reason';

    function beforeLoad(context) {
        if (context.type == context.UserEventType.VIEW) {
            var thisRecord = context.newRecord;
            var form = context.form;
            var script = runtime.getCurrentScript();
            var script_id = script.getParameter(SPARAM_SUITELET_SCRIPTID);
            var deploy_id = script.getParameter(SPARAM_SUITELET_DEPLOYID);
            var title = script.getParameter(SPARAM_TITLE);
            var recordType = script.getParameter(SPARAM_RECORD);
            var approval_status_field = script.getParameter(SPARAM_STATUS);
            var next_approver_field = script.getParameter(SPARAM_APPROVER);
            var reject_reason_field = script.getParameter(SPARAM_REASON);
            var current_user = runtime.getCurrentUser().id;
            
            //var current_role = runtime.getCurrentUser().role;
            var approval_status = thisRecord.getValue({
                fieldId: approval_status_field
            });
            var next_approver = thisRecord.getValue({
                fieldId: next_approver_field
            });
            var reject_reason = thisRecord.getValue({
                fieldId: reject_reason_field
            });
            var LogDetails = {
                script_id : script_id,
                deploy_id : deploy_id,
                title : title,
                recordType : recordType,
                approval_status_field : approval_status_field,
                approval_status : approval_status,
                next_approver_field : next_approver_field,
                next_approver : next_approver,
                reject_reason_field : reject_reason_field,
                reject_reason : reject_reason,
                current_user : current_user
            }
            log.debug("Enter UE ",LogDetails);




            var is_condition_passed = false;
            if (approval_status == '2') {
                is_condition_passed = true;
           }
            if (is_condition_passed) {
                var suitelet_url = url.resolveScript({
                    scriptId: script_id,
                    deploymentId: deploy_id,
                    params: {
                        'custpage_record_id': thisRecord.id,
                        'custpage_record_type': recordType,
                        'custpage_reject_reason': reject_reason,
                        'custpage_reject_reason_id' : reject_reason_field,
                        'custpage_approval_status': approval_status_field,
                    }
                });
                form.addButton({
                    id: 'custpage_sl_' + script_id + '_' + deploy_id,
                    label: title,
                    functionName: "window.open('"+ suitelet_url +"', '_self');"
                });
            }

        }
    }

    function isNullOrEmpty(data) {
        return (data == null || data == '');
    }

    return {
        beforeLoad: beforeLoad
    };

});