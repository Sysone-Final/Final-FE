import { useState } from "react";
import { NavLink } from "react-router-dom";
function Sidebar() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // const { user } = useAuth();

  const toggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const menuItems = [
    {
      id: "konva",
      label: "콘바",
      path: "/datacenterview",
    },
    {
      id: "babylon",
      label: "바빌론",
      path: "/babylonmap",
    },
    // MASTER 권한자에게만 인사관리 메뉴 표시
    // ...(user?.role === 'MASTER' ? [{
    //   id: "hr",
    //   label: "인사관리",
    //   icon: <People />,
    //   path: "/hr",
    // }] : []),
  ];

  return (
    <aside
      className={`
        text-white transition-all duration-300 ease-in h-full flex-shrink-0
        ${sidebarCollapsed ? "w-20" : "w-52"}
        flex flex-col
      `}
    >
      {/* 로고 영역 */}
      <div className="pl-6 pt-4">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleCollapse}
            className="p-2 rounded hover:bg-white/20 transition-colors flex-shrink-0"
          >
            <svg
              className="w-5 h-5 transition-all duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d={"M4 6h16 M4 12h16 M4 18h16"}
              />
            </svg>
          </button>
          {!sidebarCollapsed && (
            <div className="flex-1 pl-4">
              <span className="text-lg font-bold text-amber-400">SERVER</span>
              <span className="text-lg font-bold text-green-600">WAY</span>
            </div>
          )}
        </div>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 p-4 flex flex-col overflow-y-auto">
        <ul className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 text-white group ${
                    isActive ? "bg-white/20" : "hover:bg-white/10"
                  }`
                }
                title={sidebarCollapsed ? item.label : undefined}
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 group-hover:text-white">
                  {/* <span className="text-lg">{item.icon}</span> */}
                </div>
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* 사용자 프로필 카드 */}
        {/* {!sidebarCollapsed && (
          <div className="mt-4 p-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mr-3">
                <span className="text-white">👤</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-white/70">{user?.position}</p>
              </div>
            </div>
          </div>
        )} */}
      </nav>
    </aside>
  );
}

export default Sidebar;
