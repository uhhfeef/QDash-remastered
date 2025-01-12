export function generateTools(tableSchema) {
    return [
        {
            type: "function",
            function: {
                name: "executeSqlQuery",
                strict: true,
                description: `Execute a SQL query on the database based on user request.Schema is: ${tableSchema}`,
                parameters: {
                    type: "object",
                    properties: {
                        "explanation": {
                            type: "array",
                            description: "The explanation of the query",
                            items: { type: "string" }
                        },
                        "query": {
                            type: "string",
                            description: "The SQL query to execute"
                        }
                    },
                    required: ["explanation", "query"],
                    additionalProperties: false
                }
            },
        },
        {
            type: "function",
            function: {
                name: "createChart",
                description: "Create a chart with the provided x and y values. ",
                parameters: {
                    type: "object",
                    properties: {
                        x: { 
                            type: "array", 
                            description: "The fetched database x values for the chart", 
                            items: { type: "number" } 
                        },
                        y: { 
                            type: "array", 
                            description: "The fetched database y values for the chart", 
                            items: { type: ["number", "string"] } 
                        },
                        chartType: { 
                            type: "string", 
                            description: "The type of chart to create", 
                            enum: ["line", "bar", "scatter", "pie"]
                        },
                        title: {
                            type: "string",
                            description: "The title of the chart"
                        },
                        xAxisTitle: {
                            type: "string",
                            description: "The label for the x-axis"
                        },
                        yAxisTitle: {
                            type: "string",
                            description: "The label for the y-axis"
                        }
                    },
                    required: ["x", "y", "chartType", "title"],
                    additionalProperties: false
                }
            }
        },
        {
            type: "function",
            function: {
                name: "createCard",
                description: "Create a card with a single value and title",
                parameters: {
                    type: "object",
                    properties: {
                        value: {
                            type: ["string", "number"],
                            description: "The value to display in the card"
                        },
                        title: {
                            type: "string",
                            description: "The title of the card"
                        },
                        trend: {
                            type: ["string", "number"],
                            description: "The trend value to display in the card"
                        }
                    },
                    required: ["value", "title", "trend"],
                    additionalProperties: false
                }
            }
        }
    ];
}
