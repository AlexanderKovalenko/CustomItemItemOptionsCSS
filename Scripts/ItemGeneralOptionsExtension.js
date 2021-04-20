var ItemGeneralOptionsExtension = (function () {
    var Dashboard = DevExpress.Dashboard;
    var Model = DevExpress.Dashboard.Model;
    var Designer = DevExpress.Dashboard.Designer;

    // 1. Model
    var enabledColorProperty = {
        ownerType: Model.DashboardItem,
        propertyName: "EnabledColorHeader",
        defaultValue: false,
        valueType: 'boolean'
    };
    var backgroundColorHeaderProperty = {
        ownerType: Model.DashboardItem,
        propertyName: "backgroundColorHeader",
        defaultValue: null,
        valueType: 'string'
    };
    var fontColorHeaderProperty = {
        ownerType: Model.DashboardItem,
        propertyName: "fontColorHeader",
        defaultValue: null,
        valueType: 'string'
    };

    var gridStateProperty = {
        ownerType: Model.GridItem,
        propertyName: "gridState",
        defaultValue: null,
        valueType: 'string'
    };

    Model.registerCustomProperty(enabledColorProperty);
    Model.registerCustomProperty(backgroundColorHeaderProperty);
    Model.registerCustomProperty(fontColorHeaderProperty);   
    Model.registerCustomProperty(gridStateProperty);

    // 2. Viewer
    function onItemCaptionToolbarUpdated(args) {
        if (args.dashboardItem.customProperties.getValue(enabledColorProperty.propertyName)) {
            var colorText = args.dashboardItem.customProperties.getValue(fontColorHeaderProperty.propertyName);

            $.each(args.options.staticItems, function (_, item) {
                if (item.type || item.type === "text") {
                    item.template = function () {
                        return $('<div/>').text(item.text).css('color', colorText);
                    };
                }
            });

            addCss("[data-layout-item-name=" + args.itemName + "] svg use { color: " + colorText + "!important; }");

            var backgroundColor = args.dashboardItem.customProperties.getValue(backgroundColorHeaderProperty.propertyName);
            var elements = document.querySelectorAll("div[data-layout-item-name='" + args.itemName + "'] .dx-dashboard-caption-toolbar");
            elements.forEach(function (element) {
                var toolbar = DevExpress.ui.dxToolbar.getInstance(element);
                if (toolbar) {
                    toolbar._$element[0].style.backgroundColor = backgroundColor;
                }
            });
        }
    };

    function addCss(css) {
        var head = document.getElementsByTagName('head')[0];
        var s = document.createElement('style');
        s.setAttribute('type', 'text/css');
        if (s.styleSheet) {   // IE
            s.styleSheet.cssText = css;
        } else {                // the world
            s.appendChild(document.createTextNode(css));
        }
        head.appendChild(s);
    }

    // 3. Designer
    function isDescriptionDisabled(dashboardItem) {
        return !dashboardItem.customProperties.getValue(enabledProperty.propertyName);
    }
    function isColorHeaderDisabled(dashboardItem) {
        return !dashboardItem.customProperties.getValue(enabledColorProperty.propertyName);
    }   
    function changeDisabledState(dxForm, fieldName, isDisabled, dashboardItem) {    
        let itemOptions = dxForm.itemOption(fieldName);
        if (itemOptions) {            
            let editorOptions = itemOptions.editorOptions || {}
            if (editorOptions.disabled != isDisabled) {
                editorOptions.disabled = isDisabled;
                editorOptions.value = null;
                dxForm.itemOption(fieldName, "editorOptions", editorOptions);
            }            
        }        
    }

    function onCustomizeSections(args) {
        args.addSection({
            title: "Header Color",
            onFieldDataChanged: function (e) {
                e.component.beginUpdate();
                changeDisabledState(e.component, backgroundColorHeaderProperty.propertyName, isColorHeaderDisabled(args.dashboardItem), args.dashboardItem);
                changeDisabledState(e.component, fontColorHeaderProperty.propertyName, isColorHeaderDisabled(args.dashboardItem), args.dashboardItem);
                e.component.endUpdate();
            },
            items: [
                {
                    dataField: enabledColorProperty.propertyName,
                    label: { visible: false },
                    template: Designer.FormItemTemplates.buttonGroup,
                    editorOptions: {
                        keyExpr: "value",
                        items: [{
                            value: true,
                            text: "On"
                        }, {
                            value: false,
                            text: "Off"
                        }]
                    }
                }, {
                    dataField: backgroundColorHeaderProperty.propertyName,
                    editorType: "dxColorBox",
                    label: { text: "backgroundcolor" },
                    editorOptions: {
                        editAlphaChannel: true,
                        showClearButton: true,
                        disabled: isColorHeaderDisabled(args.dashboardItem),
                        onInitialized: function (e) {
                            e.component.option("value", args.dashboardItem.customProperties.getValue(backgroundColorHeaderProperty.propertyName));
                        }
                    }
                }, {
                    dataField: fontColorHeaderProperty.propertyName,
                    editorType: "dxSelectBox",
                    label: { text: "fontcolor" },
                    editorOptions: {
                        items: [
                            { value: 'yellow', displayValue: "Yellow" },
                            { value: 'blue', displayValue: "Blue" },
                            { value: 'white', displayValue: "White" },
                            { value: 'gray', displayValue: "Gray" },
                            { value: 'darkgray', displayValue: "Dark Gray" },
                            { value: 'orange', displayValue: "Orange" },
                            { value: 'black', displayValue: "Black" },
                            { value: 'green', displayValue: "Green" },
                            { value: 'red', displayValue: "Red" }
                        ],
                        displayExpr: "displayValue",
                        valueExpr: "value",
                        disabled: isColorHeaderDisabled(args.dashboardItem),
                        onInitialized: function (e) {
                            e.component.option("value", args.dashboardItem.customProperties.getValue(fontColorHeaderProperty.propertyName));
                        }
                    }
                }, {
                    dataField: gridStateProperty.propertyName,
                    label: { visible: false },
                    template: function (data, element) {
                        var buttonContainer = document.createElement('div');
                        new DevExpress.ui.dxButton(buttonContainer, {
                            text: 'Inspect State',
                            onClick: function () {
                                var container = document.querySelector("[data-layout-item-name=" + args.dashboardItem.componentName() + "] .dx-datagrid");
                                var dataGrid = DevExpress.ui.dxDataGrid.getInstance(container.parentNode);

                                alert(JSON.stringify(dataGrid.state()));
                            }
                        });
                        return buttonContainer;
                    }
                }
            ]
        });
    };    
      
    // 4. Event Subscription
    function ItemGeneralOptionsExtension(dashboardControl) {
        this.name = "ItemGeneralOptions";
        this.start = function () {            
            
            var viewerApiExtension = dashboardControl.findExtension('viewer-api');
            if (viewerApiExtension) {
                viewerApiExtension.on('itemCaptionToolbarUpdated', onItemCaptionToolbarUpdated);                 
            }          
            var optionsPanelExtension = dashboardControl.findExtension("item-options-panel");
            if (optionsPanelExtension) {
                optionsPanelExtension.on('customizeSections', onCustomizeSections);
            }
        };
        this.stop = function () {
            var viewerApiExtension = dashboardControl.findExtension('viewer-api');
            if (viewerApiExtension) {
                viewerApiExtension.off('itemCaptionToolbarUpdated', onItemCaptionToolbarUpdated);               
            }         
            var optionsPanelExtension = dashboardControl.findExtension("item-options-panel");
            if (optionsPanelExtension) {
                optionsPanelExtension.off('customizeSections', onCustomizeSections);
            }
        };
    }
    return ItemGeneralOptionsExtension;

}());

// https://docs.devexpress.com/Dashboard/401709/web-dashboard/client-side-customization/custom-properties/dashboard-item-description-custom-property