public with sharing class SearchController{
    public SearchController(){
    }

    @AuraEnabled(cacheable=true)
    public static List<SObject> findRecords(String objectApiName, List<String> fields, String searchKey, 
                                            String whereConditions, String orderByAsc, String orderByDesc, String limitCondition){
        List<List<SObject>> searchRecords = new List<List<SObject>>();
        if (searchKey!='') {
            String searchKeyWord = searchKey + '*';
         //   String returningFields = objectApiName + '( Id, ' + String.join(fields, ', ') + ')';
            String returningFields = objectApiName + '( Id, ' + String.join(fields, ', '); // + ')';
            if (whereConditions != '') {
                returningFields = returningFields + ' WHERE ' + whereConditions;
            }
            if (orderByASC != '') {
                returningFields = returningFields + ' ORDER BY ' + orderByAsc + ' ASC ';
            }
            if (orderByDESC != '') {
                returningFields = returningFields + ', ' + orderByDesc + ' DESC ';
            }
            returningFields = returningFields + ')';
            if (limitCondition != '') {
                returningFields = returningFields + ' LIMIT ' + limitCondition;
            }
            String queryString = 'FIND :searchKeyWord IN ALL FIELDS RETURNING ' + returningFields;
            searchRecords = Search.query(queryString);
            return searchRecords.get(0);  
        }
        return searchRecords.get(0);
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getSObjectTypes(){
        List<String> sObjectTypesList = new List<String>();
        for (Schema.SObjectType objectType : Schema.getGlobalDescribe().values()) {
            Schema.DescribeSObjectResult describeSObjectResultObject = objectType.getDescribe();
            if (describeSObjectResultObject.isCustom() || 
               (!describeSObjectResultObject.isCustomSetting() &&
              describeSObjectResultObject.isSearchable() && 
                       describeSObjectResultObject.getRecordTypeInfos().size() > 0  &&
            describeSObjectResultObject.isAccessible() &&
            describeSObjectResultObject.isQueryable())) {
               String name = objectType.getDescribe().getName();
               String label = objectType.getDescribe().getLabel();
               sObjectTypesList.add(name);
            }
        }
        sObjectTypesList.sort();
        return sObjectTypesList;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getSObjectTypeFields(String sObjectName){
        SObjectType type = Schema.getGlobalDescribe().get(sObjectName);
        Map<String, Schema.SObjectField> fieldsMap = type.getDescribe().fields.getMap();
        List<String> fieldsList = new List<String>();
        for(Schema.SObjectField field : fieldsMap.values()) {
            String fieldName = field.getDescribe().getName();
            if (field.getDescribe().isNameField()) {
                fieldsList.clear();
                fieldsList.add(fieldName);
                return fieldsList;
            }
            if (!field.getDescribe().isNillable() && field.getDescribe().isAccessible()) {
                fieldsList.add(fieldName);
            }
        }
        return fieldsList;
    }
}