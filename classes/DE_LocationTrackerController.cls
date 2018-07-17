//class for fetching Service Appointment Address
global with sharing class DE_LocationTrackerController 
{
    //method to query service appointment address from given id
    @AuraEnabled
    global static ServiceAppointment getAddress(Id sId)
    {
        system.debug('sid:'+sId);
        //sId = '08p7F000000Cv1c';
        if(sid != null && String.valueOf(sid) != '')
        {
            List<String> fieldNames = new List<String>();
            fieldNames.add('Street');
            fieldNames.add('City');
            fieldNames.add('State');
            fieldNames.add('Country');
            fieldNames.add('PostalCode');
            
            // Check if the above fields are accessible for the below query. Ensuring FLS.
            if(!checkAccessibleFLS(fieldNames,'ServiceAppointment')){
                system.debug('return null if case fields not accesible');
                return null;
            }
        	return [Select Street,City,State,Country,PostalCode from ServiceAppointment where Id=:sId];
        }
        else
        {
            return null;
        }
    }
    /* This method ensures the fields are Accessible. Ensuring FLS. */
    public static boolean checkAccessibleFLS(List<String> fieldNames, String objName){
        system.debug('in check');
        boolean isSafe = false;
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        SObjectType myObj = schemaMap.get(objName);
        if(myObj.getDescribe().isAccessible()){ 
            for(String fldName: fieldNames){
                SObjectField myField = myObj.getDescribe().fields.getMap().get(fldName);
                if(myField.getDescribe().isAccessible()){
                    isSafe = true;
                }else{
                    isSafe = false;
                    break;
                }    
            }
        }else{
            isSafe = false;
        }
        return isSafe;
    }
}