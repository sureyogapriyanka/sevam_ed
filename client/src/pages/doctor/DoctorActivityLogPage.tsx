import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import ActivityLog from "../../components/common/ActivityLog";
import { Download } from "lucide-react";

export default function DoctorActivityLogPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-blue-900">Activity Log</h2>
                <Button
                    variant="outline"
                    className="flex items-center border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Export Log
                </Button>
            </div>
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-2 border-cyan-200">
                <CardContent className="p-0">
                    <ActivityLog />
                </CardContent>
            </Card>
        </div>
    );
}
