import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';

interface AdminChartsProps {
  requestsOverTime?: Array<{ date: string; count: number }>;
  bloodGroupDemand?: Array<{ group: string; count: number }>;
}

export const AdminCharts: React.FC<AdminChartsProps> = ({
  requestsOverTime = [
    { date: 'Mon', count: 4 },
    { date: 'Tue', count: 7 },
    { date: 'Wed', count: 5 },
    { date: 'Thu', count: 9 },
    { date: 'Fri', count: 12 },
    { date: 'Sat', count: 8 },
    { date: 'Sun', count: 6 },
  ],
  bloodGroupDemand = [
    { group: 'O+', count: 14 },
    { group: 'A+', count: 10 },
    { group: 'B+', count: 8 },
    { group: 'O-', count: 6 },
    { group: 'AB+', count: 4 },
    { group: 'A-', count: 3 },
  ],
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
      {/* Chart 1: Requests Over Time */}
      <Card className="p-5 border-stone-200 bg-white shadow-xs">
        <CardHeader className="p-0 pb-4 border-b border-stone-100">
          <CardTitle className="text-sm font-bold text-stone-900">
            Blood Requests Trend (7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={requestsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f3f0" />
              <XAxis dataKey="date" stroke="#737373" fontSize={11} />
              <YAxis stroke="#737373" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#171717',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#C62828"
                strokeWidth={2.5}
                dot={{ fill: '#C62828', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Chart 2: Blood Group Demand */}
      <Card className="p-5 border-stone-200 bg-white shadow-xs">
        <CardHeader className="p-0 pb-4 border-b border-stone-100">
          <CardTitle className="text-sm font-bold text-stone-900">
            Blood Group Demand Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bloodGroupDemand}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f3f0" />
              <XAxis dataKey="group" stroke="#737373" fontSize={11} />
              <YAxis stroke="#737373" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#171717',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" fill="#8F1D2C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
