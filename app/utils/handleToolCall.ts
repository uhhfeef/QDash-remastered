import { executeDuckDbQuery } from '../services/duckDbService.js';
import { createChart } from '../components/createChart.js';
import { createSpace } from '../components/createSpaceForCharts.js';
import { createCard } from '../components/createCard.js';
import { createStackedBarChart } from '../components/createStackedBarchart.js';
import { ChatCompletionMessageToolCall } from 'openai/resources/chat/completions.mjs';

export async function handleToolCall(toolCall: ChatCompletionMessageToolCall) {
    const args = JSON.parse(toolCall.function.arguments);
    let toolResult;

    console.group(`%c🛠️ Tool Call: ${toolCall.function.name}`, 'color: #4CAF50; font-weight: bold; font-size: 12px;');
    console.log('%cArguments:', 'color: #2196F3; font-weight: bold;', args);
    
    // // Remove all placeholders
    // ['.chart-container', '.stats-card-grid'].forEach(container => 
    //     document.querySelectorAll(`${container} .bg-gray-100`).forEach(el => el.remove())
    // );

    switch (toolCall.function.name) {
        case 'executeSqlQuery':
            console.log('%c📊 Executing SQL query:', 'color: #FF9800; font-weight: bold;', args.query);
            try {
                const queryResult = await executeDuckDbQuery(args.query);
            //     if (queryResult && queryResult.length > 0) {
            //         window.x = queryResult.map(row => Object.values(row)[0]);
            //         window.y = queryResult.map(row => Object.values(row)[1]);
            //         console.log('%cQuery results:', 'color: #4CAF50; font-weight: bold;');
            //         console.table({ x: window.x, y: window.y });
            //         toolResult = { message: "Query has received results and has been saved in window.x and window.y. Do NOT execute any more queries. Give this result to the next tool." };
            //         // toolResult = { success: true, x: window.x, y: window.y };
            //     }
            //     addMessageToChat(`Executed query: ${args.query}`, 'assistant');

            //     // If the query has an explanation, add it to the chat. It should have one because it has been set as required in tools config.
            //     if (args.explanation) {
            //         addMessageToChat(`Query explanation: ${args.explanation}`, 'assistant');
            //     }
            } catch (error) {
                console.error('Error executing SQL query:', error);
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                toolResult = { error: errorMessage };
                console.log(`Error executing query: ${errorMessage}`, 'assistant');
            }            
            break;

        case 'createCard':
            console.log('%c🃏 Creating Card:', 'color: #E91E63; font-weight: bold;');
            // console.log('%c🃏 Card Data:', 'color: #9C27B0; font-weight: bold;', 'x:', window.x);
            // const value = window.x[0];
            // const trendingPercentage = window.y[0];
            // createCard(args.title, value, trendingPercentage);
            // toolResult = { success: true, message: 'Card created successfully' };
            toolResult = 'Card created successfully' ;
            // addMessageToChat(`Creating card with provided data.`, 'assistant');
            break;

        case 'createChart':
            console.log('%c📈 Creating Chart:', 'color: #E91E63; font-weight: bold;');;
            // console.log('%c📈 Creating Chart:', 'color: #E91E63; font-weight: bold;', {
            //     x: window.x,
            //     y: window.y,
            //     type: args.chartType,
            //     title: args.title
            // });
            // const id = await createSpace();
            // createChart(id, window.x, window.y, args.chartType, args.title, args.xAxisTitle, args.yAxisTitle);
            // toolResult = { success: true, message: 'Chart created successfully' };
            // addMessageToChat(`Creating chart with provided data.`, 'assistant');
            break;

        case 'createStackedBarChart':
            console.log('%c📊 Creating Stacked Bar Chart:', 'color: #673AB7; font-weight: bold;');
            // console.log('%c📊 Creating Stacked Bar Chart:', 'color: #673AB7; font-weight: bold;', {
            //     x: window.x,
            //     y: window.y,
            //     stackBy: args.stackBy,
            //     title: args.title
            // });
            // const stackedBarChartId = await createSpace();
            // createStackedBarChart(stackedBarChartId, window.x, window.y, args.stackBy, args.title, args.xAxisTitle, args.yAxisTitle);
            // toolResult = { success: true, message: 'Stacked bar chart created successfully' };
            // addMessageToChat(`Creating stacked bar chart with provided data.`, 'assistant');
            break;    
    }

    console.log('%cTool Result:', 'color: #009688; font-weight: bold;', toolResult);
    console.groupEnd();

    // Tool result is sent to the next tool. The next iteration starts with the tool result and previous messages as context.
    // messages.push({
    //     role: "tool",
    //     tool_call_id: toolCall.id,
    //     content: JSON.stringify(toolResult)
    // });

    return {
        role: "tool" as const,
        tool_call_id: toolCall.id,
        content: toolResult as string
    };
} 