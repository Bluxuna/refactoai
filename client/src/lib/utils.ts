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
  const roadMapTopics = await fetch("http://127.0.0.1:8000/topics");
  const response = await roadMapTopics.json();
  const rawData: response[] = response.topics;

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
};
