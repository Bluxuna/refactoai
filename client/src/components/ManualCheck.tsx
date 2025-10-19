import { TabsContent } from "./ui/tabs";

const ManualCheck = ({ data }: { data: string }) => {
  return (
    <TabsContent value="manual_check" className="p-6 m-0">
      <pre className="text-sm font-mono whitespace-pre-wrap">{data}</pre>
    </TabsContent>
  );
};

export default ManualCheck;
