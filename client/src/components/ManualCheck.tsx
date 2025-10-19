import { TabsContent } from "./ui/tabs";

const ManualCheck = ({
  data,
  isLoading,
}: {
  data: string;
  isLoading: boolean;
}) => {
  return (
    <TabsContent value="manual_check" className="p-6 m-0">
      {isLoading ? (
        <div>Checking For Mistakes...</div>
      ) : data ? (
        <pre className="text-sm font-mono whitespace-pre-wrap">{data}</pre>
      ) : (
        <div>
          <p className="text-muted-foreground text-sm">
            Click "Code Check" or "Submit" to see output here
          </p>
        </div>
      )}
    </TabsContent>
  );
};

export default ManualCheck;
