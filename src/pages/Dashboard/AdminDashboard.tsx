import { ShieldAlert, Users, Store, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const metrics = [
    { title: "Total Users", value: "24,593", icon: <Users /> },
    { title: "Total Sellers", value: "1,240", icon: <Store /> },
    { title: "Platform Revenue", value: "$85,200", icon: <Activity /> },
    { title: "Pending Approvals", value: "12", icon: <ShieldAlert /> },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Admin Control Panel</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((m, i) => (
          <div key={i} className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-700 flex items-center gap-4">
            <div className="bg-slate-900/30 text-slate-400 p-4 rounded-xl">
              {m.icon}
            </div>
            <div>
              <p className="text-sm text-slate-400 font-medium mb-1">{m.title}</p>
              <h3 className="text-2xl font-bold">{m.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Seller Approvals</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                <div>
                  <h4 className="font-bold text-slate-900">Tech Store {i}</h4>
                  <p className="text-xs text-slate-500">Registered today</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded hover:bg-slate-200">Reject</button>
                  <button className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded hover:bg-slate-800">Approve</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">System Health</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">Server Load</span>
                <span className="text-green-600 font-bold">24%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-1/4"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">Database Storage</span>
                <span className="text-amber-600 font-bold">78%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
