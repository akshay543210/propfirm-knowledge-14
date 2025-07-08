import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";

interface OperationStatusProps {
  status: {
    type: 'success' | 'error' | null;
    message: string;
  };
}

const OperationStatus = ({ status }: OperationStatusProps) => {
  if (!status.type) return null;

  return (
    <Card className="mb-6 border-0">
      <CardContent className={`p-4 ${
        status.type === 'success' 
          ? 'bg-green-500/10 border-green-500/20' 
          : 'bg-red-500/10 border-red-500/20'
      } rounded-lg border`}>
        <div className="flex items-center gap-2">
          {status.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-400" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-400" />
          )}
          <span className={`${
            status.type === 'success' ? 'text-green-400' : 'text-red-400'
          } font-medium`}>
            {status.message}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OperationStatus;