import { TabsContent } from "@radix-ui/react-tabs";

const CodeRun = () => {
  const output = false;
  return (
    <TabsContent value="output" className="p-6 m-0">
      {output ? (
        <pre className="text-sm font-mono whitespace-pre-wrap">{output}</pre>
      ) : (
        <p className="text-muted-foreground text-sm">
          Click "Code Check" or "Submit" to see output here
        </p>
      )}
    </TabsContent>
  );
};

export default CodeRun;
