"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type StatusChartItem = {
  name: string;
  value: number;
  color: string;
};

type PriorityChartItem = {
  name: string;
  value: number;
};

type ProjectProgressItem = {
  name: string;
  progress: number;
};

type WorkspaceChartsProps = {
  statusData: StatusChartItem[];
  priorityData: PriorityChartItem[];
  projectProgressData: ProjectProgressItem[];
};

type TooltipPayload = {
  name?: string;
  value?: number;
  payload?: {
    name?: string;
    progress?: number;
  };
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  suffix?: string;
};

function CustomTooltip({
  active,
  payload,
  label,
  suffix = "",
}: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const firstItem = payload[0];
  const displayName =
    label ?? firstItem.payload?.name ?? firstItem.name ?? "";

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 shadow-xl">
      <p className="text-sm font-semibold text-white">
        {displayName}
      </p>

      <p className="mt-1 text-sm text-slate-400">
        {firstItem.value}
        {suffix}
      </p>
    </div>
  );
}

export function WorkspaceCharts({
  statusData,
  priorityData,
  projectProgressData,
}: WorkspaceChartsProps) {
  const totalStatusTasks = statusData.reduce(
    (total, item) => total + item.value,
    0,
  );

  return (
    <section className="mt-6 grid gap-6 xl:grid-cols-2">
      <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
        <div>
          <h2 className="font-semibold text-white">
            Task status distribution
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current task workflow across your projects
          </p>
        </div>

        {totalStatusTasks > 0 ? (
          <>
            <div className="mt-6 h-72">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={4}
                  >
                    {statusData.map((item) => (
                      <Cell
                        key={item.name}
                        fill={item.color}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    content={<CustomTooltip />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {statusData.map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl bg-slate-950 p-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{
                        backgroundColor: item.color,
                      }}
                    />

                    <span className="text-xs text-slate-500">
                      {item.name}
                    </span>
                  </div>

                  <p className="mt-2 text-lg font-bold text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-72 items-center justify-center">
            <p className="text-sm text-slate-600">
              No task data available.
            </p>
          </div>
        )}
      </article>

      <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
        <div>
          <h2 className="font-semibold text-white">
            Tasks by priority
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Workload grouped by importance
          </p>
        </div>

        <div className="mt-6 h-80">
          {priorityData.some((item) => item.value > 0) ? (
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={priorityData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#1e293b"
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{
                    fill: "#0f172a",
                  }}
                  content={<CustomTooltip />}
                />

                <Bar
                  dataKey="value"
                  radius={[8, 8, 0, 0]}
                  fill="#2563eb"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-slate-600">
                No priority data available.
              </p>
            </div>
          )}
        </div>
      </article>

      <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 xl:col-span-2">
        <div>
          <h2 className="font-semibold text-white">
            Project completion
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Task completion percentage for recent projects
          </p>
        </div>

        <div className="mt-6 h-80">
          {projectProgressData.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={projectProgressData}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 30,
                  left: 15,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#1e293b"
                />

                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={130}
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 12,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{
                    fill: "#0f172a",
                  }}
                  content={
                    <CustomTooltip suffix="%" />
                  }
                />

                <Bar
                  dataKey="progress"
                  radius={[0, 8, 8, 0]}
                  fill="#7c3aed"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-slate-600">
                No project progress data available.
              </p>
            </div>
          )}
        </div>
      </article>
    </section>
  );
}