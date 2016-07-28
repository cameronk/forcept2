/**
 *
 */

export default {

    /*
     * Fields
     */
    Fields: {
        "text": {
            name: "Text",
            description: "",
            storageMethod: "text",
            defaultSettings: {},
            defaultValue: ""
        },
        "textarea": {
            name: "Textarea",
            description: "",
            storageMethod: "text",
            defaultSettings: {},
            defaultValue: ""
        },
        "number": {
            name: "Number",
            description: "",
            storageMethod: "text",
            defaultSettings: {},
            defaultValue: ""
        },
        "date": {
            name: "Date",
            description: "",
            storageMethod: "text",
            defaultSettings: {
                useBroadSelector: false
            },
            defaultValue: ""
        },
        "radio": {
            name: "Radio",
            description: "Select a single option with a radio field or buttons",
            storageMethod: "text",
            defaultSettings: {},
            defaultValue: ""
        },
        "select": {
            name: "Select",
            description: "Select one or many options from a dropdown",
            storageMethod: "json",
            defaultSettings: {
                options: {},
                allowCustomData: false
            },
            defaultValue: []
        },
        "file": {
            name: "File",
            description: "",
            storageMethod: "json",
            defaultSettings: {
                accept: []
            },
            defaultValue: []
        },
        "header": {
            name: "Header",
            description: "Group fields with a header",
            storageMethod: "none",
            defaultSettings: {},
            defaultValue: false
        },
        "prescriber": {
            name: "Prescriber",
            description: "Prescribe medication",
            storageMethod: "json",
            defaultSettings: {},
            defaultValue: ""
        },
        "teeth-screener": {
            name: "Teeth Screener",
            description: "Screen patient teeth",
            storageMethod: "json",
            defaultSettings: {},
            defaultValue: {}
        }
    },

    /*
     * Displays
     */
    Displays: {
        "pie chart": {
            name: "Pie Chart",
            icon: "pie chart",
            description: "Display data in a pie chart",
            defaultSettings: {}
        },
        "line chart": {
            name: "Line Chart",
            icon: "line chart",
            description: "Display data in a line chart",
            defaultSettings: {}
        }
    }
};
