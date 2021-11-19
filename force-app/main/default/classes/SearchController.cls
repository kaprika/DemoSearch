public with sharing class SearchController{
    
    @AuraEnabled(cacheable=true)
    public static List<SObject> findRecords(String objectApiName, List<String> fields, String searchKey, 
                                            String whereConditions, String orderByAsc, String orderByDesc, String limitCondition){
        List<List<SObject>> searchRecords = new List<List<SObject>>();
        String searchKeyWord = searchKey + '*';
        //   String returningFields = objectApiName + '( Id, ' + String.join(fields, ', ') + ')';
        String returningFields = objectApiName + '( Id, ' + String.join(fields, ', '); 
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

    @AuraEnabled(cacheable=true)
    public static Map<String, String> getSObjectTypes(){
        List<String> sObjectTypesList = new List<String>();
        Map<String, String> objectsNames = new Map<String, String>();                 
        for (Schema.SObjectType objectType : Schema.getGlobalDescribe().values()) {
            Schema.DescribeSObjectResult describeSObject = objectType.getDescribe();
            if (describeSObject.isCustom() || 
               (!describeSObject.isCustomSetting() &&
                describeSObject.isSearchable() && 
                describeSObject.getRecordTypeInfos().size() > 0  &&
                describeSObject.isAccessible() &&
                describeSObject.isQueryable()) &&
                !objectType.getDescribe().name.containsIgnoreCase('relationship')) {
                    String name = objectType.getDescribe().getName();
                    String label = objectType.getDescribe().getLabel();
                    objectsNames.put(name, label);
            }
        }
        List<String> sortedKeys = new List<String>(objectsNames.keySet());
        sortedKeys.sort();
        Map<String, String> sortedNames = new Map<String, String>();
        for (String key : sortedKeys) {
            String value = objectsNames.get(key);
            sortedNames.put(key, value);
        } 
        return sortedNames;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getSObjectTypeFields(String sObjectName){
        SObjectType type = Schema.getGlobalDescribe().get(sObjectName);
        Map<String, Schema.SObjectField> fieldsMap = type.getDescribe().fields.getMap();
        List<String> fieldsList = new List<String>();
        for(Schema.SObjectField field : fieldsMap.values()) {
            if (field.getDescribe().isNameField()) {
                String fieldName = field.getDescribe().getName();
                fieldsList.add(fieldName);
                break;
            }
           /* if (!field.getDescribe().isNillable() && field.getDescribe().isAccessible()) {
                fieldsList.add(fieldName);
            }
            */
        }
        return fieldsList;
    }
}