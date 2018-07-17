//Test class for main class
@isTest
public class DE_LocationTrackerTest {
	static testMethod void getAddressTest()
    {
        WorkOrder wo = new WorkOrder();
        wo.Subject = 'Test work order';
        insert wo;
        System.assertEquals(wo.Subject, 'Test work order');
        
        ServiceAppointment sa = new ServiceAppointment();
        sa.ParentRecordId = wo.Id;
        sa.Status = 'Scheduled';
        sa.Street = 'Vidyanagar';
        sa.City = 'Hyderabad';
        sa.State = 'Telangana';
        sa.Country = 'India';
        sa.PostalCode = '500044';
        insert sa;
        System.assertEquals(sa.Status, 'Scheduled');
        System.assertEquals(sa.City, 'Hyderabad');
        
        DE_LocationTrackerController.getAddress(sa.Id);
    }
}