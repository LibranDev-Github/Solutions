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

    var SPARAM_SUITELET_SCRIPTID = 'custscript_sparam_sl_script';
    var SPARAM_SUITELET_DEPLOYID = 'custscript_sparam_sl_deploymentid';
    var SPARAM_TITLE = 'custscript_sparam_sl_title';
    var SPARAM_RECORD = 'custscript_sparam_sl_record';
    var SPARAM_STATUS = 'custscript_sparam_sl_status';
    var SPARAM_APPROVER= 'custscript_sparam_sl_approver';

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



            var current_user = runtime.getCurrentUser().id;
            //var current_role = runtime.getCurrentUser().role;
            var approval_status = thisRecord.getValue({
                fieldId: approval_status_field
            });
            var next_approver = thisRecord.getValue({
                fieldId: next_approver_field
            });

            var is_condition_passed = false;
            if (approval_status == '2') {
                is_condition_passed = true;
           }

         //   //log.debug("script",script)
            //log.debug("recordType",recordType)
            //log.debug("script_id",script_id)
            //log.debug("deploy_id",deploy_id)
           //log.debug("title",title)
          //  //log.debug("current_user",current_user)
          //  //log.debug("approval_status",approval_status)
        //    //log.debug("next_approver",next_approver)
            if (is_condition_passed) {
                var suitelet_url = url.resolveScript({
                    scriptId: script_id,
                    deploymentId: deploy_id,
                    params: {
                        'custpage_invadj_id': thisRecord.id,
                        'custpage_recordtype': recordType,
                    }
                });
            //log.debug("next_apsuitelet_urlprover",suitelet_url)

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