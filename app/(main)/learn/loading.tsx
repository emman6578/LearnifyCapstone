import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader className="h-12 w-12 animate-spin text-muted-foreground text-white" />
    </div>
  );
};

export default Loading;
