<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Default" %>

<!DOCTYPE html>

<html>
<head runat="server">
    <title>Test</title>

    <style type="text/css">
        html, body, form {  
            height: 100%;  
            margin: 0;  
            padding: 0;  
            overflow: hidden;  
        }
    </style>

    <script type="text/javascript">
        //<![CDATA[
        function onBeforeRender(s, e) {
            var dashboardControl = s.GetDashboardControl();
            dashboardControl.registerExtension(new ItemGeneralOptionsExtension(dashboardControl));
        }
        //]]>
    </script>
</head>
<body>
    <form id="form1" runat="server">
        <dx:ASPxDashboard ID="ASPxDashboard1" runat="server" DashboardStorageFolder="~/App_Data/Dashboards" Height="100%">
            <ClientSideEvents BeforeRender="onBeforeRender" />
        </dx:ASPxDashboard>
        <script src="Scripts/ItemGeneralOptionsExtension.js"></script>
    </form>
</body>
</html>