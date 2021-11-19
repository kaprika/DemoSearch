@IsTest
public with sharing class SearchControllerTest {

    @IsTest
    public static void findRecordsTest() {
        String objectApiName = TestDataFactory.getObjectApiName('Account');
        Test.startTest();
        List<String> fields = SearchController.getSObjectTypeFields(objectApiName);
        String searchKey = 'united'; 
        String searchKeyWord = searchKey + '*';
        String value = '\'%Corp%\'';
        String whereConditions = 'Name LIKE \'%Corp%\'';
        String orderByAsc = 'Name';
        String orderByDesc = 'Id';
        String limitCondition = '3';
        List<SObject> actualRecords = SearchController.findRecords(objectApiName, fields, searchKey, whereConditions, orderByAsc, orderByDesc, limitCondition);
        String searchQuery = 'FIND :searchKeyWord IN ALL FIELDS RETURNING Account (Id, Name WHERE Name LIKE :value ORDER BY Name ASC, Id DESC) LIMIT 3';
        List<SObject> expectedRecords = Search.query(searchQuery).get(0);
        Test.stopTest();
        System.assertEquals(expectedRecords.size(), actualRecords.size(), 'the size is not the same');
        for (SObject record : expectedRecords) {
            System.assertEquals(true, actualRecords.contains(record), 'records are different');
        }
    }

    @IsTest
    public static void getSObjectTypeFieldsTest() {
        String sObjectName1 = 'Account';
        String sObjectName2 = 'Task';
        Test.startTest();
        String fieldName1 = SearchController.getSObjectTypeFields(sObjectName1).get(0);
        String fieldName2 = SearchController.getSObjectTypeFields(sObjectName2).get(0);
        Test.stopTest();
        System.assertEquals('Name', fieldName1);
        System.assertEquals('Subject', fieldName2);
    }
   
    @IsTest
    public static void getSObjectTypesTest(){
        Test.startTest();
        Map<String, String> sObjectTypes = SearchController.getSObjectTypes();
        Test.stopTest();
        Set<String> apiNames = sObjectTypes.keySet();
        List<String> apiNamesList = new List<String>();
        apiNamesList.add('Account');
        apiNamesList.add('Contact');
        apiNamesList.add('Case');
        apiNamesList.add('Task');
        apiNamesList.add('Asset');
        System.assertEquals(true, apiNames.containsAll(apiNamesList));
    }
}
