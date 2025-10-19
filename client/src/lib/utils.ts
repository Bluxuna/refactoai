import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface response {
  id: number;
  topic: string;
  name: string;
}

export const grouper = async () => {
  try {
    console.log(import.meta.env.VITE_API_URL);
    const roadMapTopics = await fetch(`${import.meta.env.VITE_API_URL}/tasks`);
    const response = await roadMapTopics.json();
    const rawData: response[] = response.tasks;

    const grouped = rawData.reduce((acc, task) => {
      let group = acc.find((g) => g.topic === task.topic);
      if (!group) {
        group = { topic: task.topic, tasks: [] };
        acc.push(group);
      }
      group.tasks.push({ name: task.name, id: task.id });
      return acc;
    }, [] as { topic: string; tasks: { name: string; id: number }[] }[]);

    return grouped;
  } catch (err) {
    console.log(err);
    throw new Error("Something Went Wrong While Grouping Data");
  }
};
