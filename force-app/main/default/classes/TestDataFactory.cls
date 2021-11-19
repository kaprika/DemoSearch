@IsTest
public class TestDataFactory {

    public static String getObjectApiName(String objectName) {
        return Schema.getGlobalDescribe().get(objectName).getDescribe().name;
    }  
}
