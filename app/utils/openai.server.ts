import OpenAI from "openai";
import { getChatHistory, getChatTools } from "./db.server";
import { ChatCompletionMessage } from "openai/resources/index.mjs";


export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface Message {
    role: string;
    content: string;
}

export async function getChatResponse(chatId: string): Promise<OpenAI.Chat.Completions.ChatCompletion | null> {
    try {
        const tools = await getChatTools(chatId as string);

        const msgs = await getChatHistory(chatId);
        // console.log('messages in openai:', msgs);
        // console.log('tools in openai:', tools);
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: `You are a helpful assistant. Let's think step by step. If the user just wants to have a natural conversation, you should not use the sql tool. You don't need to explain what you're going to do before using the SQL tool. You can use the sql tool to fetch data from the database. You can also use the chart tool to create charts. For pie chart, values would be in x and labels for the values in y. Even though you can execute SQL queries using the sql tool, you dont have access to the data output from the sql tool. If you need to convert data from one chart type to another, you dont need to call the sql tool again and again to fetch the same data. You must always call only 1 function at a time, tool_calls must always be a 1 array. You will always double check and think step by step before you call the chart tool. NEVER EVER INSERT OR DELETE FROM THE TABLE. this is how shadcn component looks like: 

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function Component() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
Remember this is for remix. always make sure that when you are generating code you must this xml tags with the code in between them: <shadcn></shadcn> and only send the code. only generate code when required by user. dont send in markdown`},
                ...msgs
            ],
            model: "gpt-4o-mini",
            tools

        });
        // console.log('completion in openai:', completion);
        return completion;
    } catch (error) {
        console.error("Error getting chat response:", error);
        return null;
    }
}
  