import { TabsContent } from "@radix-ui/react-tabs";

const CodeRun = ({ data }: { data: string }) => {
  return (
    <TabsContent value="output" className="p-6 m-0">
      {data ? (
        <pre
          className={`text-sm font-mono whitespace-pre-wrap ${
            data.startsWith("Error") ? "text-red-500" : "text-green-300"
          }`}
        >
          {data}
        </pre>
      ) : (
        <p className="text-muted-foreground text-sm">
          Click "Code Check" or "Submit" to see output here
        </p>
      )}
    </TabsContent>
  );
};

export default CodeRun;
