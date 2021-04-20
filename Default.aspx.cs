using System;
using DevExpress.DashboardCommon;
using DevExpress.DashboardWeb;

public partial class Default : System.Web.UI.Page {
    protected void Page_Load(object sender, EventArgs e) {
        ASPxDashboard1.SetDataSourceStorage(CreateDataSourceStorage());
    }

    public DataSourceInMemoryStorage CreateDataSourceStorage() {
        DataSourceInMemoryStorage dataSourceStorage = new DataSourceInMemoryStorage();
        DashboardObjectDataSource objDataSource = new DashboardObjectDataSource("ObjectDataSource", typeof(ProductSales));

        objDataSource.DataMember = "GetProductSales";
        dataSourceStorage.RegisterDataSource("objectDataSource", objDataSource.SaveToXml());

        return dataSourceStorage;
    }
}