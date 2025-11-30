import { ParticipantSearch } from "@/components/participant-search";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, QrCode, Users } from "lucide-react";

export default function ParticipantSearchPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Users className="h-8 w-8 text-[#8B4513]" />
            <h1 className="text-4xl font-bold text-gray-900">Participant Lookup</h1>
          </div>
          <p className="text-gray-700 text-lg">
            Search for any festival participant by name or chest number, or scan their QR code
          </p>
        </div>

        <ParticipantSearch />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Card className="p-6 bg-white border-gray-200 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <Search className="h-5 w-5 text-[#8B4513]" />
              <CardTitle className="text-gray-900">Search by Name</CardTitle>
            </div>
            <CardDescription className="text-gray-600">
              Type the participant&apos;s name or chest number in the search box above to find their profile instantly.
            </CardDescription>
          </Card>

          <Card className="p-6 bg-white border-gray-200 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <QrCode className="h-5 w-5 text-[#8B4513]" />
              <CardTitle className="text-gray-900">Scan QR Code</CardTitle>
            </div>
            <CardDescription className="text-gray-600">
              Use the QR scanner to quickly access a participant&apos;s profile by scanning their QR code badge.
            </CardDescription>
          </Card>
        </div>

        <Card className="p-6 bg-gray-50 border-gray-200">
          <CardTitle className="mb-2 text-gray-900">What you&apos;ll see</CardTitle>
          <CardDescription className="text-gray-700">
            Each participant profile includes their basic information, team details, total points earned, 
            all programs they participated in, results and grades for each item, penalties (if any), 
            and visual statistics with interactive charts.
          </CardDescription>
        </Card>
      </div>
    </div>
  );
}

