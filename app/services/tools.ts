

// to do: refactor like swarm
export function generateTools(tableSchema: string) {
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
        // {
        //     "type": "function",
        //     "function": {
        //         "name": "create_shadcn_barchart",
        //         "description": "Creates a shadcn barchart component in Remix",
        //         "strict": true,
        //         "parameters": {
        //             "type": "object",
        //             "properties": {
        //                 "component": {
        //                     "type": "string",
        //                     "description": "The barchart JSX component to create. It must be coded in JSX.",
        //                 }
        //             },
        //             "required": ["component"],
        //             "additionalProperties": false
        //         }
        //     }
        // }
    ];
}
