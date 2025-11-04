// import { Logout } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { LiaCubesSolid } from "react-icons/lia";
import { GrResources } from "react-icons/gr";
import { LuLayoutDashboard } from "react-icons/lu";

function Header() {
  const menuItems = [
    {
      id: "dashboard",
      label: "대시보드",
      path: "/dashboard",
      icon: <LuLayoutDashboard className="text-2xl text-sky-500" />,
    },
    {
      id: "serverRoom",
      label: "서버실",
      path: "/server-room-dashboard",
      icon: <LiaCubesSolid className="text-2xl text-amber-500" />,
    },
    {
      id: "assets",
      label: "자원관리",
      path: "/assets",
      icon: <GrResources className="text-2xl text-green-500" />,
    },
  ];

  return (
    <header className="px-10">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center">
          {/* 로고 */}
          <div className="flex items-center gap-2 mr-8">
            <img src="/logo.svg" alt="SERVERWAY" className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-50">SERVERWAY</span>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="flex items-center gap-x-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-4 transition-all duration-300 ${
                    isActive
                      ? "text-gray-50 border-b border-gray-100"
                      : "text-gray-500 hover:text-gray-200"
                  }`
                }
              >
                <span className="text-lg font-semibold flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* 알림 */}
          {/* <button className="p-2 text-white hover:bg-white/30 rounded-lg relative">
            <div className="w-5 h-5 flex items-center justify-center">
              <Notifications/>
            </div>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              ?
            </span>
          </button> */}

          {/* 사용자 메뉴 */}
          <div className="flex items-center bg-white/20 text-white rounded-xl px-4 py-2 space-x-2">
            {/* <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-xs">
              테스트
              {user?.name?.[0] || 'U'}
            </div> */}
            테스트
            {/* <span className="font-semibold text-sm">{user?.name || '사용자'}</span> */}
          </div>

          {/* 로그아웃 버튼 */}
          {/* <button 
            onClick={handleLogout}
            className="p-2 text-white hover:bg-white/30 rounded-lg"
            title="로그아웃"
          >
            <Logout />
          </button> */}
        </div>
      </div>
    </header>
  );
}

export default Header;
