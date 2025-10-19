import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col gap-2 justify-between items-center">
        <Loader className="animate-spin w-[50px] h-[50px]" />
        <p className="text-white text-4xl">Loading</p>
      </div>
    </div>
  );
};

export default Loading;
